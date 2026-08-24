"""Public user read schemas (SN-026).

`UserRead` is the canonical user payload returned by the API: it never
includes password material, and always carries `subscription_tier` so
clients can gate premium scenarios.
"""

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class UserRead(BaseModel):
    """Public view of a user — no password material, ever."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str | None
    name: str
    native_language: str
    target_language: str
    learning_goal: str
    current_level: str
    #: Content language driving scenario catalog filtering (SN-020).
    preferred_language: str
    subscription_tier: str
    streak_count: int
    streak_last_date: date | None
    total_xp: int
    total_speaking_seconds: int
    onboarding_completed: bool
    created_at: datetime
