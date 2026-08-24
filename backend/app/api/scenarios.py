"""Scenario catalog API (SN-015): the mobile session launcher's data."""

from uuid import UUID

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.scenario import Scenario
from app.models.user import SUBSCRIPTION_FREE, User

router = APIRouter(prefix="/scenarios", tags=["scenarios"])


class ScenarioOut(BaseModel):
    """One practice scenario as shown in the mobile catalog."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    description: str
    category: str
    difficulty: int | None
    #: True when the scenario is premium and the caller is on the free
    #: tier (SN-026) — the mobile client renders a paywall for these.
    is_locked: bool = False


class ScenarioListResponse(BaseModel):
    """The published scenario catalog."""

    scenarios: list[ScenarioOut]


@router.get("", response_model=ScenarioListResponse)
async def list_scenarios(
    current_user: User = Depends(get_current_user),
    limit: int = Query(default=50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> ScenarioListResponse:
    """Return published scenarios, ordered by title for a stable list."""
    result = await db.execute(
        select(Scenario)
        .where(Scenario.is_published.is_(True))
        .order_by(Scenario.title.asc())
        .limit(limit)
    )
    scenarios = list(result.scalars().all())
    is_free_tier = current_user.subscription_tier == SUBSCRIPTION_FREE
    return ScenarioListResponse(
        scenarios=[
            ScenarioOut(
                id=scenario.id,
                title=scenario.title,
                description=scenario.description,
                category=scenario.category,
                difficulty=scenario.difficulty,
                is_locked=bool(scenario.is_premium and is_free_tier),
            )
            for scenario in scenarios
        ]
    )
