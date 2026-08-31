"""Culture Corner micro-lesson API (SN-047): one-minute cultural reads.

Micro-lessons are a read-only content format served straight from the
manifest packs — no database rows, no per-user state. The mobile Learn
tab fetches the summaries for a horizontal rail, then a detail screen
loads one lesson by id.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.api.dependencies import get_current_user
from app.models.user import User
from app.services.content_service import (
    MicroLessonSeed,
    load_microlesson_seeds,
)

router = APIRouter(prefix="/microlessons", tags=["microlessons"])


class MicroLessonSectionOut(BaseModel):
    """One headed paragraph of a micro-lesson."""

    heading: str
    text: str


class MicroLessonSummaryOut(BaseModel):
    """One micro-lesson as shown in the mobile Learn rail (SN-047)."""

    id: str
    title: str
    hook: str
    read_minutes: int
    #: Manifest pack the lesson belongs to, plus the pack's UI metadata
    #: so the mobile rail can theme and icon the cards.
    pack_id: str
    theme_color: str
    icon: str


class MicroLessonOut(MicroLessonSummaryOut):
    """The full lesson body for the reader screen."""

    sections: list[MicroLessonSectionOut]
    takeaway: str
    try_it: str


class MicroLessonListResponse(BaseModel):
    """The Culture Corner catalog."""

    microlessons: list[MicroLessonSummaryOut]


def _summary(seed: MicroLessonSeed) -> MicroLessonSummaryOut:
    return MicroLessonSummaryOut(
        id=seed.id,
        title=seed.title,
        hook=seed.hook,
        read_minutes=seed.read_minutes,
        pack_id=seed.pack_id,
        theme_color=seed.theme_color,
        icon=seed.icon,
    )


@router.get("", response_model=MicroLessonListResponse)
async def list_microlessons(
    current_user: User = Depends(get_current_user),
) -> MicroLessonListResponse:
    """Return every Culture Corner micro-lesson summary (SN-047)."""
    seeds = load_microlesson_seeds()
    return MicroLessonListResponse(microlessons=[_summary(s) for s in seeds])


@router.get("/{lesson_id}", response_model=MicroLessonOut)
async def get_microlesson(
    lesson_id: str,
    current_user: User = Depends(get_current_user),
) -> MicroLessonOut:
    """Return one full micro-lesson, or 404 for an unknown id."""
    for seed in load_microlesson_seeds():
        if seed.id == lesson_id:
            return MicroLessonOut(
                **_summary(seed).model_dump(),
                sections=[
                    MicroLessonSectionOut(
                        heading=section.heading,
                        text=section.text,
                    )
                    for section in seed.sections
                ],
                takeaway=seed.takeaway,
                try_it=seed.try_it,
            )
    raise HTTPException(status_code=404, detail="Microlesson not found.")
