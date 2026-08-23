"""Analytics event model.

user_id is a plain UUID with no foreign key by design: the events table is
append-heavy and intentionally decoupled from user lifecycle so event writes
never contend with user row updates.
"""

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, Index, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column
from uuid6 import uuid7

from app.db.base import Base, JSONB


class AnalyticsEvent(Base):
    """A single product analytics event."""

    __tablename__ = "analytics_events"
    __table_args__ = (
        Index("idx_analytics_event", "event_name", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid(), primary_key=True, default=uuid7)
    user_id: Mapped[uuid.UUID | None] = mapped_column(Uuid())
    event_name: Mapped[str] = mapped_column(String(100))
    event_properties: Mapped[dict[str, Any]] = mapped_column(
        JSONB, default=dict
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return (
            f"AnalyticsEvent(id={self.id!r}, event_name={self.event_name!r}, "
            f"user_id={self.user_id!r}, created_at={self.created_at!r})"
        )
