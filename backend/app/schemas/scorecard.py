"""CanadaReady™ Scorecard domain models and logic (SN-048).

Shared between the API router and the PDF renderer, following the
`app/schemas/` convention used by the user profile (`UserRead`).
"""

from datetime import datetime
from pydantic import BaseModel

from app.models.user import User, UserSkill

#: Every scorecard surface must carry this disclaimer (brand rule).
DISCLAIMER = "CLB-inspired self-assessment — not an official language test."

#: Six speaking-readiness dimensions, in the canonical order.
BAND_DEFINITIONS = [
    ("fluency", "Fluency"),
    ("pronunciation", "Pronunciation"),
    ("grammar", "Grammar"),
    ("vocabulary", "Vocabulary"),
    ("coherence", "Coherence"),
    ("task_completion", "Task Completion"),
]


class BadgeOut(BaseModel):
    """The scorecard badge earned at the learner's current level."""

    code: str
    title: str
    tagline: str


class BandOut(BaseModel):
    """One dimension with its CLB-inspired hint."""

    code: str
    label: str
    score: int
    clb_hint: str


class StatsOut(BaseModel):
    """Session and engagement stats shown under the bands."""

    sessions_completed: int
    speaking_minutes: int
    streak_current: int
    total_xp: int


class ScorecardOut(BaseModel):
    """The CanadaReady™ Scorecard payload."""

    generated_at: datetime
    badge: BadgeOut
    canada_ready_score: int
    bands: list[BandOut]
    stats: StatsOut
    disclaimer: str


def clb_hint_for(score: int) -> str:
    """CLB-inspired hint for a 0-100 band score."""
    if score >= 70:
        return "CLB-inspired 7+"
    if score >= 40:
        return "CLB-inspired 5-6"
    return "CLB-inspired 3-4"


def badge_for(score: int) -> BadgeOut:
    """Badge tier by CanadaReady score (affirming tone only)."""
    if score >= 70:
        return BadgeOut(
            code="canada-ready",
            title="CanadaReady™",
            tagline="You sound like you belong — keep the momentum going.",
        )
    if score >= 40:
        return BadgeOut(
            code="confident-colleague",
            title="Confident Colleague",
            tagline="You're holding real conversations with confidence.",
        )
    return BadgeOut(
        code="finding-your-feet",
        title="Finding Your Feet",
        tagline="Every session is a step toward sounding like you belong.",
    )


def first_steps_badge() -> BadgeOut:
    """Null-safe badge for a learner with no skill scores yet."""
    return BadgeOut(
        code="first-steps",
        title="First Steps",
        tagline="Complete your first session to unlock your CanadaReady™ score.",
    )


def band_scores(skills: UserSkill | None) -> list[int]:
    """The six band scores; all zero when no skills row exists yet."""
    if skills is None:
        return [0] * len(BAND_DEFINITIONS)
    values = {
        "fluency": skills.fluency_score,
        "pronunciation": skills.pronunciation_score,
        "grammar": skills.grammar_score,
        "vocabulary": skills.vocabulary_score,
        "coherence": skills.coherence_score,
        "task_completion": skills.task_completion_score,
    }
    return [max(0, min(100, round(values[code]))) for code, _ in BAND_DEFINITIONS]


def build_scorecard(user: User, skills: UserSkill | None) -> ScorecardOut:
    """Assemble the scorecard payload for one user (null-safe)."""
    scores = band_scores(skills)
    canada_ready = (
        0 if skills is None else max(0, min(100, round(skills.canada_ready_score)))
    )
    badge = first_steps_badge() if skills is None else badge_for(canada_ready)
    bands = [
        BandOut(code=code, label=label, score=score, clb_hint=clb_hint_for(score))
        for (code, label), score in zip(BAND_DEFINITIONS, scores)
    ]
    return ScorecardOut(
        generated_at=datetime.now(),
        badge=badge,
        canada_ready_score=canada_ready,
        bands=bands,
        stats=StatsOut(
            sessions_completed=len(user.sessions),
            speaking_minutes=user.total_speaking_seconds // 60,
            streak_current=user.streak_count,
            total_xp=user.total_xp,
        ),
        disclaimer=DISCLAIMER,
    )
