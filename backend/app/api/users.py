"""User profile API.

The canonical public payload is `UserRead` (`app/schemas/user.py`);
`ProfileResponse` attaches the latest skill scores. Password material
never appears in any response.
"""

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import (
    SUBSCRIPTION_PREMIUM,
    PreferredLanguage,
    User,
)
from app.schemas.user import UserRead

router = APIRouter(prefix="/users", tags=["users"])

#: Historical name for `UserRead`, kept so existing imports stay stable.
UserResponse = UserRead


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


class ProfileResponse(UserRead):
    """`/users/me` payload: profile plus skill scores."""

    skills: UserSkillResponse | None


class LanguageUpdateRequest(BaseModel):
    """Body for `POST /users/me/language` (SN-020)."""

    language: PreferredLanguage


@router.get("/me", response_model=ProfileResponse)
async def read_current_user(
    current_user: User = Depends(get_current_user),
) -> ProfileResponse:
    """Return the authenticated user's profile and scores."""
    return ProfileResponse.model_validate(current_user)


@router.post("/me/upgrade", response_model=ProfileResponse)
async def upgrade_current_user(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    """Mock monetization upgrade (SN-026): flip the account to premium.

    Stand-in for the real RevenueCat receipt flow; grants immediate
    access to premium scenarios with no payment collected.
    """
    current_user.subscription_tier = SUBSCRIPTION_PREMIUM
    await db.commit()
    return ProfileResponse.model_validate(current_user)


@router.post("/me/language", response_model=ProfileResponse)
async def update_preferred_language(
    payload: LanguageUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    """Persist the learner's content language (SN-020).

    Clients refetch the scenario catalog with the returned
    `preferred_language` so the library matches the choice.
    """
    current_user.preferred_language = payload.language.value
    await db.commit()
    return ProfileResponse.model_validate(current_user)
