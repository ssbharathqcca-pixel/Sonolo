"""Analytics event recording (SN-014).

Events carry ids, codes, xp amounts, and local dates — never raw
transcripts, tokens, or secrets.
"""

from typing import Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.analytics import AnalyticsEvent

EVENT_SESSION_COMPLETED = "session.completed"
EVENT_SESSION_XP_AWARDED = "session.xp_awarded"
EVENT_QUEST_COMPLETED = "quest.completed"
EVENT_QUEST_XP_AWARDED = "quest.xp_awarded"
EVENT_BADGE_AWARDED = "badge.awarded"
EVENT_STREAK_UPDATED = "streak.updated"
EVENT_VOCAB_REVIEWED = "vocab.reviewed"


async def record_event(
    db: AsyncSession,
    user_id: UUID,
    event_name: str,
    properties: dict[str, Any] | None = None,
) -> None:
    """Queue one analytics event in the current transaction."""
    db.add(
        AnalyticsEvent(
            user_id=user_id,
            event_name=event_name,
            event_properties=properties or {},
        )
    )
