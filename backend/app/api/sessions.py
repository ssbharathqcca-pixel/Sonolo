"""Session APIs: feedback evaluation (SN-011) and completion (SN-014).

`/sessions/complete` runs one transaction: persistence, skill updates,
XP, streak, quests, badges, and analytics events.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.core.time import utc_now
from app.db.session import get_db
from app.learning.evaluator import SessionEvaluator
from app.learning.schemas import EvaluationRequest, EvaluationResponse
from app.models.user import User
from app.models.session import SpeakingSession
from app.schemas.gamification import (
    SessionCompleteRequest,
    SessionCompleteResponse,
)
from app.services.session_service import (
    ScenarioNotFoundError,
    SessionConflictError,
    SessionService,
)

router = APIRouter(tags=["sessions"])

_evaluator = SessionEvaluator()


def get_evaluator() -> SessionEvaluator:
    """Dependency returning the shared evaluator instance."""
    return _evaluator


@router.post(
    "/sessions/{session_id}/feedback",
    response_model=EvaluationResponse,
    status_code=status.HTTP_200_OK,
)
async def session_feedback(
    session_id: UUID,
    request: EvaluationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    evaluator: SessionEvaluator = Depends(get_evaluator),
) -> EvaluationResponse:
    """Evaluate a completed session and return scores plus insights.

    Ownership: when a persisted session exists for this id (SN-014),
    only its owner may request feedback for it — other users get 404.
    Unpersisted ids remain stateless evaluations for now.
    """
    if request.session_id != session_id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Body session_id must match the path session_id.",
        )
    persisted = await db.get(SpeakingSession, session_id)
    if persisted is not None and persisted.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found.",
        )
    return await evaluator.evaluate(request)


@router.post(
    "/sessions/complete",
    response_model=SessionCompleteResponse,
    status_code=status.HTTP_200_OK,
)
async def complete_session(
    payload: SessionCompleteRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SessionCompleteResponse:
    """Persist a completed voice session and award all progress."""
    service = SessionService(db)
    try:
        result = await service.complete_session(user, payload, utc_now())
    except ScenarioNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scenario not found.",
        ) from exc
    except SessionConflictError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "A different session already exists for this "
                "client_session_id."
            ),
        ) from exc
    await db.commit()
    return result
