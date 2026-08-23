"""Daily quest API (SN-014)."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.core.time import get_local_date_for_user, utc_now
from app.db.session import get_db
from app.models.user import User
from app.schemas.gamification import QuestListResponse, QuestOut
from app.services.quest_service import QuestService

router = APIRouter(prefix="/quests", tags=["quests"])


@router.get("/today", response_model=QuestListResponse)
async def get_today_quests(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> QuestListResponse:
    """Return (and lazily generate) the user's quests for their local date."""
    now = utc_now()
    quest_date = get_local_date_for_user(now, user.timezone)
    quests = await QuestService(db).ensure_daily_quests(user.id, quest_date)
    await db.commit()
    return QuestListResponse(
        quest_date=quest_date,
        timezone=user.timezone,
        quests=[
            QuestOut(
                code=quest.code,
                title=quest.title,
                description=quest.description,
                target_count=quest.target_count,
                progress_count=quest.progress_count,
                reward_xp=quest.xp_reward,
                completed=quest.completed,
                completed_at=quest.completed_at,
            )
            for quest in quests
        ],
    )
