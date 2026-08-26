"""Content pack catalog API (SN-030, SN-035): the Learn tab's pack cards."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.scenario import Scenario
from app.services.content_service import load_manifest

router = APIRouter(prefix="/packs", tags=["packs"])


class PackOut(BaseModel):
    """One manifest pack as rendered by the mobile pack cards."""

    id: str
    type: str
    language: str
    title: str
    description: str
    category: str
    tier: str
    theme_color: str
    icon: str
    #: Live catalog stats keyed on Scenario.pack_id (SN-035).
    scenario_count: int = 0
    premium_count: int = 0


class PackListResponse(BaseModel):
    """The scenario packs declared in the content manifest."""

    packs: list[PackOut]


@router.get("", response_model=PackListResponse)
async def list_packs(db: AsyncSession = Depends(get_db)) -> PackListResponse:
    """Return every scenarios-type pack from the content manifest.

    Vocabulary packs stay server-side for now; only scenario packs map
    to a browsable card rail on the Learn tab. Counts come from the
    seeded scenarios table grouped by pack_id (SN-035), so a pack that
    has not been seeded yet reports zeros instead of file guesses.
    """
    rows = await db.execute(
        select(
            Scenario.pack_id,
            func.count(),
            func.coalesce(
                func.sum(case((Scenario.is_premium.is_(True), 1), else_=0)),
                0,
            ),
        )
        .where(Scenario.is_published.is_(True))
        .group_by(Scenario.pack_id)
    )
    counts = {
        pack_id: (int(total), int(premium))
        for pack_id, total, premium in rows.all()
    }
    packs = [
        PackOut(
            id=str(entry["id"]),
            type=str(entry["type"]),
            language=str(entry["language"]),
            title=str(entry["title"]),
            description=str(entry["description"]),
            category=str(entry["category"]),
            tier=str(entry["tier"]),
            theme_color=str(entry["theme_color"]),
            icon=str(entry["icon"]),
            scenario_count=counts.get(str(entry["id"]), (0, 0))[0],
            premium_count=counts.get(str(entry["id"]), (0, 0))[1],
        )
        for entry in load_manifest().get("packs", [])
        if entry.get("type") == "scenarios"
    ]
    return PackListResponse(packs=packs)
