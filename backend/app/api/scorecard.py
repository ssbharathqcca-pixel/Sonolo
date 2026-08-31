"""CanadaReady™ Scorecard API (SN-048).

A friendly, CLB-inspired snapshot of a learner's speaking readiness,
built from the latest UserSkill row plus session/gamification stats.
The JSON view is open to every authenticated user; the PDF export is a
premium feature gated server-side (mirroring the SN-041 403 pattern),
so the paywall is not cosmetic.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.session import SpeakingSession
from app.models.user import SUBSCRIPTION_PREMIUM, User
from app.schemas.scorecard import ScorecardOut, build_scorecard
from app.services.scorecard_pdf import build_scorecard_pdf

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me/scorecard", response_model=ScorecardOut)
async def read_scorecard(
    current_user: User = Depends(get_current_user),
) -> ScorecardOut:
    """Return the caller's CanadaReady™ Scorecard (any tier)."""
    return build_scorecard(current_user, current_user.skills)


@router.get("/me/scorecard/pdf")
async def read_scorecard_pdf(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
    """Export the scorecard as a branded PDF (premium only).

    Free-tier callers get a 403 mirroring the SN-041 premium
    enforcement pattern; the mobile client routes them to the paywall
    before this endpoint is ever hit.
    """
    if current_user.subscription_tier != SUBSCRIPTION_PREMIUM:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="PDF export requires a premium subscription.",
        )
    sessions_completed = (
        await db.execute(
            select(func.count())
            .select_from(SpeakingSession)
            .where(SpeakingSession.user_id == current_user.id)
        )
    ).scalar_one()
    scorecard = build_scorecard(current_user, current_user.skills)
    pdf_bytes = build_scorecard_pdf(scorecard, sessions_completed)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="sonolo-scorecard.pdf"'},
    )
