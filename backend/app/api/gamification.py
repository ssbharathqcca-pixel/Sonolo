"""Gamification summary API (SN-014) — read-only."""

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.gamification import GamificationSummaryOut
from app.services.gamification_service import GamificationService
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/gamification", tags=["gamification"])


@router.get("/me", response_model=GamificationSummaryOut)
async def get_gamification_summary(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> GamificationSummaryOut:
    """Return XP, level, streaks, and badges without mutating state."""
    return await GamificationService(db).get_summary(user)
