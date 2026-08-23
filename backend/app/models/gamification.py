"""Gamification models: earned badges and daily quests.

daily_quests.quest_type domain: 'quick_speak' | 'review' | 'listen' | 'boss'.
"""

import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    false,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid6 import uuid7

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.scenario import Scenario
    from app.models.user import User


class UserBadge(Base):
    """A badge earned by a user; (user, badge) pairs are unique."""

    __tablename__ = "user_badges"
    __table_args__ = (
        UniqueConstraint("user_id", "badge_id", name="uq_user_badges_user_badge"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid7)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    badge_id: Mapped[str] = mapped_column(String(50))
    title: Mapped[str] = mapped_column(String(255), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    earned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    user: Mapped["User"] = relationship(
        back_populates="badges", lazy="selectin"
    )

    def __repr__(self) -> str:
        return (
            f"UserBadge(id={self.id!r}, user_id={self.user_id!r}, "
            f"badge_id={self.badge_id!r}, earned_at={self.earned_at!r})"
        )


class DailyQuest(Base):
    """A user's generated quest for a given day."""

    __tablename__ = "daily_quests"
    __table_args__ = (
        Index("idx_quests_user_date", "user_id", "quest_date"),
        UniqueConstraint(
            "user_id",
            "quest_date",
            "code",
            name="uq_daily_quests_user_date_code",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid7)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    quest_date: Mapped[date] = mapped_column(Date)
    quest_type: Mapped[str] = mapped_column(String(30))
    code: Mapped[str] = mapped_column(String(50))
    title: Mapped[str] = mapped_column(String(255), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    target_count: Mapped[int] = mapped_column(
        Integer, default=1, server_default=text("1")
    )
    progress_count: Mapped[int] = mapped_column(
        Integer, default=0, server_default=text("0")
    )
    scenario_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("scenarios.id")
    )
    completed: Mapped[bool] = mapped_column(
        Boolean, default=False, server_default=false()
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    xp_reward: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    user: Mapped["User"] = relationship(
        back_populates="daily_quests", lazy="selectin"
    )
    scenario: Mapped["Scenario | None"] = relationship(
        back_populates="daily_quests", lazy="selectin"
    )

    def __repr__(self) -> str:
        return (
            f"DailyQuest(id={self.id!r}, user_id={self.user_id!r}, "
            f"quest_date={self.quest_date!r}, quest_type={self.quest_type!r}, "
            f"completed={self.completed!r})"
        )
