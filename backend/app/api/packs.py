"""Content pack catalog API (SN-030): the Learn tab's pack cards."""

from fastapi import APIRouter
from pydantic import BaseModel

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


class PackListResponse(BaseModel):
    """The scenario packs declared in the content manifest."""

    packs: list[PackOut]


@router.get("", response_model=PackListResponse)
async def list_packs() -> PackListResponse:
    """Return every scenarios-type pack from the content manifest.

    Vocabulary packs stay server-side for now; only scenario packs map
    to a browsable card rail on the Learn tab.
    """
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
        )
        for entry in load_manifest().get("packs", [])
        if entry.get("type") == "scenarios"
    ]
    return PackListResponse(packs=packs)
