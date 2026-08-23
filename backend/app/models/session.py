"""Speaking session model.

users.session_type domain: 'quick_speak' | 'daily_lesson' | 'deep_dive' |
'boss' | 'review' | 'free_talk'
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    UniqueConstraint,
    Uuid,
    false,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid6 import uuid7

from app.db.base import Base, JSONB

if TYPE_CHECKING:
    from app.models.scenario import Scenario
    from app.models.user import User


class SpeakingSession(Base):
    """One completed speaking session with its scores and artifacts.

    errors_detected: list of {type, original, correction, explanation}.
    transcript: list of {role, content, timestamp}.
    """

    __tablename__ = "sessions"
    __table_args__ = (
        Index("idx_sessions_user_date", "user_id", "created_at"),
        UniqueConstraint(
            "user_id",
            "client_session_id",
            name="uq_sessions_user_client_session",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid7)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"), index=False
    )
    scenario_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("scenarios.id")
    )
    client_session_id: Mapped[uuid.UUID] = mapped_column(Uuid())
    session_type: Mapped[str]
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    ended_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    duration_seconds: Mapped[int] = mapped_column(Integer)
    turns_count: Mapped[int] = mapped_column(Integer)
    fluency_score: Mapped[float] = mapped_column(Float)
    pronunciation_score: Mapped[float] = mapped_column(Float)
    grammar_score: Mapped[float] = mapped_column(Float)
    vocabulary_score: Mapped[float] = mapped_column(Float)
    coherence_score: Mapped[float] = mapped_column(Float)
    task_completion_score: Mapped[float] = mapped_column(Float)
    composite_score: Mapped[float] = mapped_column(Float)
    xp_earned: Mapped[int] = mapped_column(Integer)
    errors_detected: Mapped[list[dict[str, Any]]] = mapped_column(
        JSONB, default=list
    )
    transcript: Mapped[list[dict[str, Any]]] = mapped_column(
        JSONB, default=list
    )
    evaluation_json: Mapped[dict[str, Any]] = mapped_column(
        JSONB, default=dict
    )
    overall_score: Mapped[float] = mapped_column(
        Float, default=0.0, server_default=text("0")
    )
    is_xp_eligible: Mapped[bool] = mapped_column(
        Boolean, default=False, server_default=false()
    )
    session_xp: Mapped[int] = mapped_column(
        Integer, default=0, server_default=text("0")
    )
    quest_xp: Mapped[int] = mapped_column(
        Integer, default=0, server_default=text("0")
    )
    total_xp: Mapped[int] = mapped_column(
        Integer, default=0, server_default=text("0")
    )
    audio_stored: Mapped[bool] = mapped_column(
        Boolean, default=False, server_default=false()
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    user: Mapped["User"] = relationship(
        back_populates="sessions", lazy="selectin"
    )
    scenario: Mapped["Scenario | None"] = relationship(
        back_populates="sessions", lazy="selectin"
    )

    def __repr__(self) -> str:
        return (
            f"SpeakingSession(id={self.id!r}, user_id={self.user_id!r}, "
            f"session_type={self.session_type!r}, "
            f"composite_score={self.composite_score!r}, "
            f"xp_earned={self.xp_earned!r})"
        )
