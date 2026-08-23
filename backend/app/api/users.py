"""User profile API.

Shared response models live here: `UserResponse` never includes the
password hash, and `ProfileResponse` attaches the latest skill scores.
"""

from datetime import date, datetime
from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict

from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])


class UserResponse(BaseModel):
    """Public view of a user — no password material, ever."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str | None
    name: str
    native_language: str
    target_language: str
    learning_goal: str
    current_level: str
    subscription_tier: str
    streak_count: int
    streak_last_date: date | None
    total_xp: int
    total_speaking_seconds: int
    onboarding_completed: bool
    created_at: datetime


class UserSkillResponse(BaseModel):
    """The learner's latest speaking-readiness scores."""

    model_config = ConfigDict(from_attributes=True)

    fluency_score: float
    pronunciation_score: float
    grammar_score: float
    vocabulary_score: float
    coherence_score: float
    task_completion_score: float
    composite_score: float
    canada_ready_score: float
    confidence_score: float
    updated_at: datetime


class ProfileResponse(UserResponse):
    """`/users/me` payload: profile plus skill scores."""

    skills: UserSkillResponse | None


@router.get("/me", response_model=ProfileResponse)
async def read_current_user(
    current_user: User = Depends(get_current_user),
) -> ProfileResponse:
    """Return the authenticated user's profile and scores."""
    return ProfileResponse.model_validate(current_user)
