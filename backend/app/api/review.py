"""FSRS review API: due-card queue and answer submission (SN-012, SN-014A).

All endpoints require the authenticated user; cards are user-scoped
(vocabulary_cards carries per-user FSRS state by design since SN-006),
and a successful answer also progresses the daily vocabulary quest.
"""

from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.core.time import get_local_date_for_user
from app.db.session import get_db
from app.learning.fsrs import FSRS
from app.learning.schemas import CardResponse, DueCardResponse, ReviewSubmission
from app.models.user import User
from app.models.vocabulary import VocabularyCard
from app.services.analytics import (
    EVENT_QUEST_XP_AWARDED,
    EVENT_VOCAB_REVIEWED,
    record_event,
)
from app.services.gamification_service import GamificationService
from app.services.quest_service import QuestService

router = APIRouter(prefix="/review", tags=["review"])

fsrs = FSRS()


@router.get("/due", response_model=list[DueCardResponse])
async def get_due_cards(
    current_user: User = Depends(get_current_user),
    limit: int = Query(default=20, ge=1, le=100),
    session: AsyncSession = Depends(get_db),
) -> list[DueCardResponse]:
    """Return the authenticated user's due cards, oldest due first.

    Due means `due_date <= now` and `state < 3` per the MVP spec —
    relearning cards are answered directly, not queued here.
    """
    result = await session.execute(
        select(VocabularyCard)
        .where(VocabularyCard.user_id == current_user.id)
        .where(VocabularyCard.due_date <= datetime.now(UTC))
        .where(VocabularyCard.state < 3)
        .order_by(VocabularyCard.due_date.asc())
        .limit(limit)
    )
    cards = list(result.scalars().all())
    return [DueCardResponse.model_validate(card) for card in cards]


@router.post("/answer", response_model=CardResponse)
async def submit_review(
    submission: ReviewSubmission,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> CardResponse:
    """Grade one of the user's cards through FSRS and persist the state.

    Cards belonging to other users are reported as not found — never
    leaked. A successful review also counts toward the vocab quest.
    """
    card = await session.get(VocabularyCard, submission.card_id)
    if card is None or card.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vocabulary card not found.",
        )

    now = datetime.now(UTC)
    fsrs.review_card(card, submission.rating, now)

    local_date = get_local_date_for_user(now, current_user.timezone)
    quest_service = QuestService(session)
    results = await quest_service.progress_vocab_quest(
        current_user.id, local_date, now
    )
    quest_xp = sum(result.reward_xp_awarded for result in results)
    if quest_xp > 0:
        gamification = GamificationService(session)
        locked_user = await gamification.lock_user_for_update(
            current_user.id
        )
        await gamification.apply_session_xp(
            locked_user, quest_xp, local_date, now
        )
        for result in results:
            if result.reward_xp_awarded > 0:
                await record_event(
                    session,
                    current_user.id,
                    EVENT_QUEST_XP_AWARDED,
                    {
                        "quest_code": result.code,
                        "xp": result.reward_xp_awarded,
                        "local_date": local_date.isoformat(),
                    },
                )

    await record_event(
        session,
        current_user.id,
        EVENT_VOCAB_REVIEWED,
        {
            "card_id": str(card.id),
            "rating": submission.rating,
            "state": card.state,
            "scheduled_days": card.scheduled_days,
            "local_date": local_date.isoformat(),
        },
    )

    await session.commit()
    await session.refresh(card)
    return CardResponse.model_validate(card)
