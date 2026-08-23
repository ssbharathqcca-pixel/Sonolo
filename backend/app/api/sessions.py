"""Session feedback API.

Computes (but does not yet persist) the post-session evaluation for the
mobile feedback screen. Database writes for `user_skills` and `sessions`
arrive in a later task; this endpoint only calculates and returns JSON.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.learning.evaluator import SessionEvaluator
from app.learning.schemas import EvaluationRequest, EvaluationResponse

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
    evaluator: SessionEvaluator = Depends(get_evaluator),
) -> EvaluationResponse:
    """Evaluate a completed session and return scores plus insights."""
    if request.session_id != session_id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Body session_id must match the path session_id.",
        )
    return await evaluator.evaluate(request)
