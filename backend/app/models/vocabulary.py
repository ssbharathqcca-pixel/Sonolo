"""Vocabulary card model with FSRS scheduling state.

state domain: 0 = new, 1 = learning, 2 = review, 3 = relearning.
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    Text,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid6 import uuid7

from app.db.base import Base, JSONB

if TYPE_CHECKING:
    from app.models.user import User


class VocabularyCard(Base):
    """A user's word with its FSRS memory-state schedule."""

    __tablename__ = "vocabulary_cards"
    __table_args__ = (
        Index(
            "idx_vocab_due",
            "user_id",
            "due_date",
            postgresql_where=text("state < 3"),
            sqlite_where=text("state < 3"),
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid7)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    word: Mapped[str] = mapped_column(Text)
    translations: Mapped[dict[str, str]] = mapped_column(
        JSONB, default=dict
    )
    stability: Mapped[float] = mapped_column(
        Float, default=0.0, server_default=text("0")
    )
    difficulty: Mapped[float] = mapped_column(
        Float, default=0.0, server_default=text("0")
    )
    elapsed_days: Mapped[int] = mapped_column(
        Integer, default=0, server_default=text("0")
    )
    scheduled_days: Mapped[int] = mapped_column(
        Integer, default=0, server_default=text("0")
    )
    reps: Mapped[int] = mapped_column(
        Integer, default=0, server_default=text("0")
    )
    lapses: Mapped[int] = mapped_column(
        Integer, default=0, server_default=text("0")
    )
    state: Mapped[int] = mapped_column(
        Integer, default=0, server_default=text("0")
    )
    due_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    last_review: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    user: Mapped["User"] = relationship(
        back_populates="vocabulary_cards", lazy="selectin"
    )

    def __repr__(self) -> str:
        return (
            f"VocabularyCard(id={self.id!r}, word={self.word!r}, "
            f"state={self.state!r}, due_date={self.due_date!r})"
        )
