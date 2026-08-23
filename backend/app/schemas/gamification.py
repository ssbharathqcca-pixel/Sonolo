"""Pydantic v2 schemas for SN-014: session completion and gamification."""

from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import (
    AwareDatetime,
    BaseModel,
    ConfigDict,
    Field,
    computed_field,
    model_validator,
)

TranscriptRole = Literal["user", "assistant", "system"]


class TranscriptTurn(BaseModel):
    """One turn of the voice conversation."""

    model_config = ConfigDict(extra="forbid")

    role: TranscriptRole
    text: str = Field(min_length=1, max_length=20000)
    started_at: AwareDatetime | None = None
    ended_at: AwareDatetime | None = None
    confidence: float | None = Field(default=None, ge=0.0, le=1.0)


class EvaluationScores(BaseModel):
    """The six Sonolo communication dimensions (0-100 each)."""

    model_config = ConfigDict(extra="forbid")

    fluency: float = Field(ge=0.0, le=100.0)
    pronunciation: float = Field(ge=0.0, le=100.0)
    grammar: float = Field(ge=0.0, le=100.0)
    vocabulary: float = Field(ge=0.0, le=100.0)
    coherence: float = Field(ge=0.0, le=100.0)
    task_completion: float = Field(ge=0.0, le=100.0)


class EvaluationPayload(BaseModel):
    """Evaluator output persisted alongside the session."""

    model_config = ConfigDict(extra="forbid")

    scores: EvaluationScores
    overall_score: float = Field(ge=0.0, le=100.0)
    insights: list[str] = Field(default_factory=list, max_length=20)
    engine_version: str = "sn011-deterministic-v1"


class SessionCompleteRequest(BaseModel):
    """Payload sent when a voice session finishes."""

    model_config = ConfigDict(extra="forbid")

    client_session_id: UUID
    scenario_id: UUID
    started_at: AwareDatetime
    ended_at: AwareDatetime
    duration_seconds: int = Field(ge=0, le=7200)
    transcript: list[TranscriptTurn]
    evaluation: EvaluationPayload
    client_info: dict[str, str] | None = None

    @model_validator(mode="after")
    def validate_time_window(self) -> "SessionCompleteRequest":
        """ended_at after started_at; duration consistent within 5s."""
        if self.ended_at <= self.started_at:
            raise ValueError("ended_at must be after started_at.")
        span = (self.ended_at - self.started_at).total_seconds()
        if abs(span - self.duration_seconds) > 5.0:
            raise ValueError(
                "duration_seconds must match started_at/ended_at within "
                "5 seconds."
            )
        return self


class QuestOut(BaseModel):
    """A daily quest with progress."""

    code: str
    title: str
    description: str
    target_count: int
    progress_count: int
    reward_xp: int
    completed: bool
    completed_at: datetime | None


class XPAwardOut(BaseModel):
    """XP breakdown for one completion request."""

    session_xp: int
    quest_xp: int
    total_xp: int
    xp_total: int
    xp_today: int
    level: int
    progress_to_next_level: int


class SkillUpdateOut(BaseModel):
    """One dimension's EMA update result."""

    dimension: str
    previous_score: float | None
    session_score: float
    new_score: float


class BadgeOut(BaseModel):
    """An awarded badge."""

    code: str
    title: str
    description: str
    awarded_at: datetime


class SessionCompleteResponse(BaseModel):
    """Full gamified result for the completed session."""

    session_id: UUID
    idempotent_replayed: bool
    xp_eligible: bool
    xp: XPAwardOut
    skills: list[SkillUpdateOut]
    streak_current: int
    streak_longest: int
    quests: list[QuestOut]
    newly_awarded_badges: list[BadgeOut]
    completed_at: datetime


class GamificationSummaryOut(BaseModel):
    """Read-only progress snapshot for /gamification/me."""

    xp_total: int
    xp_today: int
    xp_today_date: date | None
    level: int
    progress_to_next_level: int
    next_level_xp_threshold: int

    @computed_field  # noqa: B008
    @property
    def xp_into_level(self) -> int:
        """Alias kept for client convenience."""
        return self.progress_to_next_level

    current_streak: int
    longest_streak: int
    last_activity_at: datetime | None
    last_activity_local_date: date | None
    badges: list[BadgeOut]


class QuestListResponse(BaseModel):
    """Today's quests in the user's local date."""

    quest_date: date
    timezone: str
    quests: list[QuestOut]
