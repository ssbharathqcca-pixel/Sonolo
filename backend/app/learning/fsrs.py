"""Native FSRS-5 scheduling engine.

Implements the Free Spaced Repetition Scheduler (FSRS-5) with 19
parameters, the power forgetting curve, and short-term (same-day)
stability — written from the published formulas so Sonolo owns the
exact math and state transitions. No external FSRS library.

Reference: open-spaced-repetition FSRS-5 defaults; parameters are
tunable per deployment once review logs accumulate.
"""

import math
from collections.abc import Sequence
from datetime import datetime, timedelta

from app.learning.schemas import Rating
from app.models.vocabulary import VocabularyCard

RATING_VALUES: dict[str, int] = {"again": 1, "hard": 2, "good": 3, "easy": 4}

#: FSRS-5 default weights w0..w18.
DEFAULT_PARAMETERS: tuple[float, ...] = (
    0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046,
    1.54575, 0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315,
    2.9898, 0.51655, 0.6621,
)

DECAY = -0.5
FACTOR = 19.0 / 81.0
MIN_STABILITY = 0.1
MAX_STABILITY = 36500.0
MIN_DIFFICULTY = 1.0
MAX_DIFFICULTY = 10.0

#: 0.95 keeps early intervals short (a new card rated Good graduates at
#: ~1 day); 0.90 is the upstream default once parameters are optimized.
DEFAULT_REQUEST_RETENTION = 0.95

#: Minutes until the next step while a card sits in Learning or
#: Relearning (Again re-shows sooner than Hard).
LEARNING_STEP_MINUTES = {1: 5, 2: 10}

#: state x rating-grade -> next state (0 new, 1 learning, 2 review,
#: 3 relearning), exactly per the Sonolo task card.
STATE_TRANSITIONS: dict[int, dict[int, int]] = {
    0: {1: 1, 2: 1, 3: 2, 4: 2},
    1: {1: 3, 2: 1, 3: 2, 4: 2},
    2: {1: 3, 2: 2, 3: 2, 4: 2},
    3: {1: 3, 2: 3, 3: 2, 4: 2},
}


def _constrain(value: float, lower: float, upper: float) -> float:
    return min(max(value, lower), upper)


class FSRS:
    """Schedules one card at a time; safe to share as a singleton."""

    def __init__(
        self,
        parameters: Sequence[float] = DEFAULT_PARAMETERS,
        request_retention: float = DEFAULT_REQUEST_RETENTION,
    ) -> None:
        if len(parameters) != 19:
            raise ValueError("FSRS-5 requires exactly 19 parameters.")
        if not 0.5 < request_retention < 1.0:
            raise ValueError("request_retention must be in (0.5, 1.0).")
        self.w: tuple[float, ...] = tuple(float(p) for p in parameters)
        self.request_retention = request_retention

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def review_card(
        self,
        card: VocabularyCard,
        rating: Rating,
        review_time: datetime,
    ) -> VocabularyCard:
        """Apply one review to `card` in place and return it."""
        if review_time.tzinfo is None:
            raise ValueError("review_time must be timezone-aware.")
        grade = RATING_VALUES[rating]

        old_state = card.state
        old_stability = card.stability
        old_difficulty = card.difficulty
        elapsed_days = self._elapsed_days(card.last_review, review_time)
        card.elapsed_days = elapsed_days

        if old_state == 0:
            new_difficulty = self.init_difficulty(grade)
            new_stability = self.init_stability(grade)
        elif elapsed_days == 0:
            # Same-day review: short-term stability update only.
            new_difficulty = self.next_difficulty(old_difficulty, grade)
            new_stability = self.short_term_stability(
                old_stability, grade
            )
        else:
            retrievability = self.retrievability(
                old_stability, elapsed_days
            )
            new_difficulty = self.next_difficulty(old_difficulty, grade)
            if grade == 1:
                new_stability = self.next_forget_stability(
                    old_difficulty, old_stability, retrievability
                )
            else:
                new_stability = self.next_recall_stability(
                    old_difficulty, old_stability, retrievability, grade
                )

        new_state = STATE_TRANSITIONS[old_state][grade]

        card.stability = round(new_stability, 4)
        card.difficulty = round(new_difficulty, 4)
        card.state = new_state
        card.reps += 1
        if old_state == 2 and grade == 1:
            card.lapses += 1

        if new_state in (1, 3):
            minutes = LEARNING_STEP_MINUTES[1] if grade == 1 else LEARNING_STEP_MINUTES[2]
            card.scheduled_days = 0
            card.due_date = review_time + timedelta(minutes=minutes)
        else:
            card.scheduled_days = max(
                1, round(self.interval_days(new_stability))
            )
            card.due_date = review_time + timedelta(
                days=card.scheduled_days
            )
        card.last_review = review_time
        return card

    # ------------------------------------------------------------------
    # FSRS-5 formulas
    # ------------------------------------------------------------------

    def init_stability(self, grade: int) -> float:
        """S0(G) = w[G-1] for a first review."""
        return _constrain(self.w[grade - 1], MIN_STABILITY, MAX_STABILITY)

    def init_difficulty(self, grade: int) -> float:
        """D0(G) = w4 - e^(w5*(G-1)) + 1, clamped to [1, 10]."""
        value = self.w[4] - math.exp(self.w[5] * (grade - 1)) + 1.0
        return _constrain(value, MIN_DIFFICULTY, MAX_DIFFICULTY)

    def next_difficulty(self, difficulty: float, grade: int) -> float:
        """D' = D - w6*(G-3), clamped to [1, 10] (FSRS-5, no reversion)."""
        value = difficulty - self.w[6] * (grade - 3)
        return _constrain(value, MIN_DIFFICULTY, MAX_DIFFICULTY)

    def retrievability(self, stability: float, elapsed_days: int) -> float:
        """Power forgetting curve R(t, S) = (1 + F*t/S)^DECAY."""
        if stability <= 0.0:
            return 0.0
        return (1.0 + FACTOR * elapsed_days / stability) ** DECAY

    def next_recall_stability(
        self, difficulty: float, stability: float, retrievability: float, grade: int
    ) -> float:
        """S' for successful recall, with hard penalty / easy bonus."""
        hard_penalty = self.w[15] if grade == 2 else 1.0
        easy_bonus = self.w[16] if grade == 4 else 1.0
        growth = (
            math.exp(self.w[8])
            * (11.0 - difficulty)
            * stability ** (-self.w[9])
            * (math.exp(self.w[10] * (1.0 - retrievability)) - 1.0)
        )
        return _constrain(
            stability * (1.0 + growth * hard_penalty * easy_bonus),
            MIN_STABILITY,
            MAX_STABILITY,
        )

    def next_forget_stability(
        self, difficulty: float, stability: float, retrievability: float
    ) -> float:
        """S' after forgetting: w11 * D^-w12 * ((S+1)^w13 - 1) * e^(w14*(1-R))."""
        forgotten = (
            self.w[11]
            * difficulty ** (-self.w[12])
            * ((stability + 1.0) ** self.w[13] - 1.0)
            * math.exp(self.w[14] * (1.0 - retrievability))
        )
        return _constrain(forgotten, MIN_STABILITY, MAX_STABILITY)

    def short_term_stability(self, stability: float, grade: int) -> float:
        """Same-day review: S' = S * e^(w17*(G - 3 + w18))."""
        value = stability * math.exp(
            self.w[17] * (grade - 3 + self.w[18])
        )
        return _constrain(value, MIN_STABILITY, MAX_STABILITY)

    def interval_days(self, stability: float) -> float:
        """Days until retrievability decays to `request_retention`."""
        return (
            stability
            * (self.request_retention ** (1.0 / DECAY) - 1.0)
            / FACTOR
        )

    @staticmethod
    def _elapsed_days(
        last_review: datetime | None, review_time: datetime
    ) -> int:
        """Whole days since the previous review (0 for new/same-day)."""
        if last_review is None:
            return 0
        return max(0, (review_time - last_review).days)
