"""FSRS review API: due-card queue and answer submission.

`user_id` is a query parameter for the MVP (no auth yet); ownership
checks arrive with the authentication task.
"""

from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.learning.fsrs import FSRS
from app.learning.schemas import CardResponse, DueCardResponse, ReviewSubmission
from app.models.vocabulary import VocabularyCard

router = APIRouter(prefix="/review", tags=["review"])

fsrs = FSRS()


@router.get("/due", response_model=list[DueCardResponse])
async def get_due_cards(
    user_id: UUID = Query(description="Owner of the cards."),
    limit: int = Query(default=20, ge=1, le=100),
    session: AsyncSession = Depends(get_db),
) -> list[DueCardResponse]:
    """Return the learner's due cards, oldest due first.

    Due means `due_date <= now` and `state < 3` per the MVP spec —
    relearning cards are answered directly, not queued here.
    """
    result = await session.execute(
        select(VocabularyCard)
        .where(VocabularyCard.user_id == user_id)
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
    session: AsyncSession = Depends(get_db),
) -> CardResponse:
    """Grade one card through the FSRS engine and persist the new state."""
    card = await session.get(VocabularyCard, submission.card_id)
    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vocabulary card not found.",
        )
    fsrs.review_card(card, submission.rating, datetime.now(UTC))
    await session.commit()
    await session.refresh(card)
    return CardResponse.model_validate(card)
