"""Mathematical tests for the native FSRS-5 engine."""

import uuid
from datetime import UTC, datetime, timedelta

import pytest

from app.learning.fsrs import DEFAULT_PARAMETERS, FSRS
from app.models.vocabulary import VocabularyCard

REVIEW_TIME = datetime(2026, 8, 22, 12, 0, 0, tzinfo=UTC)
W = DEFAULT_PARAMETERS

# Interval factor at 0.95 retention: S * (0.95**-2 - 1) / (19/81).
RETENTION_FACTOR = 0.95 ** (-2.0) - 1.0
RETENTION_FACTOR = RETENTION_FACTOR / (19.0 / 81.0)  # ~0.46061


def make_card(
    state: int = 0,
    stability: float = 0.0,
    difficulty: float = 0.0,
    last_review: datetime | None = None,
    reps: int = 0,
    lapses: int = 0,
) -> VocabularyCard:
    card = VocabularyCard(user_id=uuid.uuid4(), word="double-double")
    card.state = state
    card.stability = stability
    card.difficulty = difficulty
    card.last_review = last_review
    card.reps = reps
    card.lapses = lapses
    return card


def review_card_state(
    stability: float = 10.0,
    difficulty: float = 5.0,
    elapsed_days: int = 10,
    reps: int = 3,
) -> VocabularyCard:
    return make_card(
        state=2,
        stability=stability,
        difficulty=difficulty,
        last_review=REVIEW_TIME - timedelta(days=elapsed_days),
        reps=reps,
    )


def test_new_card_good_graduates_to_review_one_day() -> None:
    engine = FSRS()
    card = engine.review_card(make_card(), "good", REVIEW_TIME)

    assert card.state == 2
    assert card.stability == pytest.approx(W[2], abs=1e-3)
    assert card.scheduled_days == 1
    assert card.due_date == REVIEW_TIME + timedelta(days=1)
    assert card.reps == 1
    assert card.lapses == 0


def test_new_card_initial_stability_ordering_and_states() -> None:
    engine = FSRS()
    stabilities = []
    states = {}
    for rating in ("again", "hard", "good", "easy"):
        card = engine.review_card(make_card(), rating, REVIEW_TIME)
        stabilities.append(card.stability)
        states[rating] = card.state
    assert stabilities == sorted(stabilities)
    assert stabilities[0] == pytest.approx(W[0], abs=1e-3)
    assert stabilities[3] == pytest.approx(W[3], abs=1e-3)
    assert states == {"again": 1, "hard": 1, "good": 2, "easy": 2}
    # Easy on defaults schedules ~7 days out (15.69 * 0.4606).
    assert engine.review_card(make_card(), "easy", REVIEW_TIME).scheduled_days == 7


def test_initial_difficulty_per_rating() -> None:
    engine = FSRS()
    difficulties = {
        rating: engine.review_card(make_card(), rating, REVIEW_TIME).difficulty
        for rating in ("again", "hard", "good", "easy")
    }
    assert difficulties["again"] == pytest.approx(7.1949, abs=1e-3)
    assert difficulties["hard"] == pytest.approx(6.4882, abs=1e-3)
    assert difficulties["good"] == pytest.approx(5.2829, abs=1e-3)
    assert difficulties["easy"] == pytest.approx(3.2248, abs=1e-3)
    assert difficulties["again"] > difficulties["easy"]


def test_review_again_moves_to_relearning_and_increments_lapses() -> None:
    engine = FSRS()
    card = engine.review_card(review_card_state(), "again", REVIEW_TIME)

    assert card.state == 3
    assert card.lapses == 1
    assert card.stability < 5.0  # post-lapse stability ~2.1 from S=10
    assert card.scheduled_days == 0  # relearning step: minutes, not days
    assert card.due_date == REVIEW_TIME + timedelta(minutes=5)


def test_review_easy_grows_stability_and_interval() -> None:
    engine = FSRS()
    card = engine.review_card(review_card_state(), "easy", REVIEW_TIME)

    assert card.state == 2
    assert card.stability == pytest.approx(78.68, abs=0.2)
    assert card.scheduled_days == 36  # 78.68 * 0.4606
    assert card.due_date == REVIEW_TIME + timedelta(days=36)


def test_hard_good_easy_stability_ordering() -> None:
    engine = FSRS()
    hard = engine.review_card(review_card_state(), "hard", REVIEW_TIME)
    good = engine.review_card(review_card_state(), "good", REVIEW_TIME)
    easy = engine.review_card(review_card_state(), "easy", REVIEW_TIME)

    assert hard.stability < good.stability < easy.stability
    assert good.stability == pytest.approx(32.97, abs=0.2)
    assert hard.stability == pytest.approx(15.32, abs=0.2)


def test_same_day_review_uses_short_term_stability() -> None:
    engine = FSRS()
    card = make_card(
        state=2,
        stability=10.0,
        difficulty=5.0,
        last_review=REVIEW_TIME - timedelta(hours=2),
        reps=3,
    )
    updated = engine.review_card(card, "good", REVIEW_TIME)

    # S' = S * e^(w17 * w18) for Good on the same day (~14.079).
    assert updated.stability == pytest.approx(14.079, rel=1e-3)
    assert updated.elapsed_days == 0


def test_difficulty_evolution_and_clamping() -> None:
    engine = FSRS()
    card = make_card(
        state=2,
        stability=10.0,
        difficulty=9.5,
        last_review=REVIEW_TIME - timedelta(days=10),
        reps=5,
    )
    for _ in range(3):
        card = engine.review_card(card, "again", REVIEW_TIME)
        card.last_review = REVIEW_TIME - timedelta(days=1)
        card.state = 2
    assert card.difficulty == 10.0  # clamped at the ceiling

    card.difficulty = 1.5
    card = engine.review_card(card, "easy", REVIEW_TIME)
    assert card.difficulty == 1.0  # clamped at the floor


def test_learning_state_transitions_use_minute_steps() -> None:
    engine = FSRS()
    hard = make_card(state=1, stability=1.0, difficulty=5.0,
                     last_review=REVIEW_TIME - timedelta(days=1), reps=1)
    updated_hard = engine.review_card(hard, "hard", REVIEW_TIME)
    assert updated_hard.state == 1
    assert updated_hard.scheduled_days == 0
    assert updated_hard.due_date == REVIEW_TIME + timedelta(minutes=10)

    again = make_card(state=1, stability=1.0, difficulty=5.0,
                      last_review=REVIEW_TIME - timedelta(days=1), reps=1)
    updated_again = engine.review_card(again, "again", REVIEW_TIME)
    assert updated_again.state == 3
    assert updated_again.due_date == REVIEW_TIME + timedelta(minutes=5)
    # Lapses only count forgettings from the Review state.
    assert updated_again.lapses == 0


def test_relearning_graduates_on_good() -> None:
    engine = FSRS()
    card = make_card(
        state=3,
        stability=2.0,
        difficulty=6.0,
        last_review=REVIEW_TIME - timedelta(days=1),
        reps=4,
        lapses=1,
    )
    updated = engine.review_card(card, "good", REVIEW_TIME)

    assert updated.state == 2
    assert updated.lapses == 1  # unchanged by a successful graduation
    assert updated.scheduled_days >= 1
    assert updated.due_date > REVIEW_TIME


def test_reps_and_elapsed_days_are_recorded() -> None:
    engine = FSRS()
    card = review_card_state(reps=7)
    updated = engine.review_card(card, "good", REVIEW_TIME)

    assert updated.reps == 8
    assert updated.elapsed_days == 10
    assert updated.last_review == REVIEW_TIME


def test_interval_scales_linearly_with_stability() -> None:
    engine = FSRS()
    for stability in (1.0, 5.0, 20.0, 100.0):
        assert engine.interval_days(stability) == pytest.approx(
            stability * RETENTION_FACTOR, rel=1e-6
        )


def test_engine_rejects_bad_configuration() -> None:
    with pytest.raises(ValueError):
        FSRS(parameters=(0.1, 0.2))
    with pytest.raises(ValueError):
        FSRS(request_retention=0.3)
    with pytest.raises(ValueError):
        FSRS().review_card(make_card(), "good", datetime(2026, 8, 22))
