"""Pydantic schemas for the learning engine.

Session evaluation models (SN-011) and FSRS review models (SN-012).
"""

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

Rating = Literal["again", "hard", "good", "easy"]

SkillDimension = Literal[
    "fluency",
    "pronunciation",
    "grammar",
    "vocabulary",
    "coherence",
    "task_completion",
]


class TranscriptTurn(BaseModel):
    """One turn of the completed conversation."""

    role: Literal["user", "tutor"]
    text: str = Field(min_length=1)


class ScenarioTargets(BaseModel):
    """Target vocabulary and grammar points for the scenario."""

    vocabulary: list[str] = Field(default_factory=list)
    grammar: list[str] = Field(default_factory=list)


class EvaluationRequest(BaseModel):
    """Everything the evaluator needs to score a finished session.

    `duration_seconds` is optional: when the client provides the real
    speaking time it is used for WPM; otherwise the evaluator estimates
    it deterministically from the transcript.
    """

    session_id: UUID
    transcript: list[TranscriptTurn] = Field(min_length=1)
    scenario_targets: ScenarioTargets | None = None
    duration_seconds: float | None = Field(default=None, gt=0.0)

    @field_validator("transcript")
    @classmethod
    def require_user_turn(cls, value: list[TranscriptTurn]) -> list[TranscriptTurn]:
        """A session without learner speech cannot be evaluated."""
        if not any(turn.role == "user" for turn in value):
            raise ValueError("Transcript must contain at least one user turn.")
        return value


class SkillScore(BaseModel):
    """Score and feedback for one of the six skill dimensions."""

    dimension: SkillDimension
    score: float = Field(ge=0.0, le=100.0)
    feedback: str


class Insight(BaseModel):
    """A win (praise) or growth area (correction) for the learner."""

    type: Literal["win", "growth"]
    text: str
    original_text: str | None = None
    correction: str | None = None


class EvaluationResponse(BaseModel):
    """The post-session feedback payload consumed by the mobile app."""

    speaking_power_score: float = Field(ge=0.0, le=100.0)
    skills: list[SkillScore]
    insights: list[Insight]
    xp_earned: int = Field(ge=0)


# -----------------------------------------------------------------------
# FSRS review (SN-012)
# -----------------------------------------------------------------------


class ReviewSubmission(BaseModel):
    """One graded answer for a vocabulary card."""

    card_id: UUID
    rating: Rating


class DueCardResponse(BaseModel):
    """A card queued for review on the mobile flashcard screen."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    word: str
    translations: dict[str, str]
    due_date: datetime
    state: int


class CardResponse(DueCardResponse):
    """The full updated card returned after a review is processed."""

    stability: float
    difficulty: float
    elapsed_days: int
    scheduled_days: int
    reps: int
    lapses: int
    last_review: datetime | None
