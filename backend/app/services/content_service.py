"""
Content service for loading and materializing Sonolo learning packs.
Both v1 and v2 packs are loaded together to provide the full 40-scenario
English catalog, and SN-020 appends the French Quebec pack so learners
with `preferred_language == "fr"` get a catalog of their own. Vocabulary
materialization stays capped by `content_vocabulary_pack_limit` (default
200); seeds tagged with the learner's preferred language are ordered
ahead of the pool so French users materialize French cards inside the
same cap instead of losing them to the 200 English cards.
"""

import json
import logging
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.db.session import dialect_name
from app.models.scenario import Scenario
from app.models.vocabulary import VocabularyCard

logger = logging.getLogger(__name__)

#: Stable namespace so repeated seeds and materializations reuse IDs.
CONTENT_NAMESPACE = uuid.uuid5(uuid.NAMESPACE_URL, "https://sonolo.app/content")

LEVEL_DIFFICULTY: dict[str, int] = {
    "seed": 1,
    "sprout": 2,
    "branch": 3,
    "bloom": 4,
    "canopy": 5,
    "summit": 5,
}

#: Pack editions loaded in order. SN-018 loads the two English editions;
#: SN-020 appends the French Quebec pack.
SCENARIO_PACK_EDITIONS = (
    "../content/scenarios/canadian-life-v1.json",
    "../content/scenarios/canadian-life-v2.json",
    "../content/scenarios/quebec-life-v1.json",
)
#: Vocabulary editions paired with their pack-level language metadata.
#: The language orders seeds at materialization time so a learner's
#: preferred language fills the 200-card cap before other languages.
VOCABULARY_PACK_EDITIONS: tuple[tuple[str, str], ...] = (
    ("../content/vocabulary/core-v1.json", "en"),
    ("../content/vocabulary/core-v2.json", "en"),
    ("../content/vocabulary/core-fr-v1.json", "fr"),
)


def _vocabulary_pack_limit() -> int:
    """Cap on cards materialized per user from the vocabulary packs.

    Settings-driven via the optional `content_vocabulary_pack_limit`
    field, defaulting to 200 for the combined SN-009 + SN-018 pack
    until the field is declared in Settings.
    """
    return int(getattr(get_settings(), "content_vocabulary_pack_limit", 200))


def content_scenario_id(content_id: str) -> UUID:
    """Deterministic scenario PK for a content-pack slug."""
    return uuid.uuid5(CONTENT_NAMESPACE, f"scenario:{content_id}")


def content_vocabulary_card_id(user_id: UUID, content_id: str) -> UUID:
    """Deterministic per-user card PK for a content-pack vocab id."""
    return uuid.uuid5(CONTENT_NAMESPACE, f"vocab:{user_id}:{content_id}")


def _primary_language_tag(code: str) -> str:
    """Base subtag of a BCP-47-style code so "fr-CA" matches the "fr" pack."""
    return code.strip().lower().split("-", 1)[0]


def _resolve(path_setting: str) -> Path:
    path = Path(path_setting)
    if path.is_absolute():
        return path
    backend_dir = Path(__file__).resolve().parents[2]
    return backend_dir / path


@dataclass(frozen=True)
class ScenarioSeed:
    """One flattened scenario row from the SN-008 pack."""

    id: UUID
    title: str
    description: str
    category: str
    mode: str
    level: str
    difficulty: int
    target_language: str
    system_prompt: str
    opening_line: str
    expected_turns: int
    success_criteria: dict[str, Any]
    vocabulary_targets: list[str]
    grammar_targets: list[str]
    cultural_notes: str
    is_premium: bool


@dataclass(frozen=True)
class VocabularySeed:
    """One word definition from the SN-009 pack with FSRS priors."""

    content_id: str
    word: str
    translations: dict[str, str]
    difficulty: float  # FSRS 1-10
    stability: float  # FSRS days
    language: str


def load_scenario_seeds() -> list[ScenarioSeed]:
    """Read and validate every scenario pack edition (SN-008 + SN-018 + SN-020)."""
    # English v1+v2 first, then the French Quebec pack: 45 total scenarios.
    paths = [_resolve(rel) for rel in SCENARIO_PACK_EDITIONS]
    seeds: list[ScenarioSeed] = []
    seen_ids: set[str] = set()
    for path in paths:
        with path.open(encoding="utf-8") as handle:
            raw: list[dict[str, Any]] = json.load(handle)
        for entry in raw:
            content_id = str(entry["id"])
            if content_id in seen_ids:
                raise ValueError(
                    f"Duplicate scenario id across packs: {content_id!r}"
                )
            seen_ids.add(content_id)
            level = str(entry["level"])
            seeds.append(
                ScenarioSeed(
                    id=content_scenario_id(content_id),
                    title=str(entry["title"]),
                    description=str(entry["description"]),
                    category=str(entry["category"]),
                    mode=str(entry["mode"]),
                    level=level,
                    difficulty=LEVEL_DIFFICULTY.get(level, 3),
                    target_language=str(entry["target_language"]),
                    system_prompt=str(entry["system_prompt"]),
                    opening_line=str(entry["opening_line"]),
                    expected_turns=int(entry["expected_turns"]),
                    success_criteria={"items": list(entry["success_criteria"])},
                    vocabulary_targets=list(entry["vocabulary_targets"]),
                    grammar_targets=list(entry["grammar_targets"]),
                    cultural_notes=str(entry["cultural_notes"]),
                    is_premium=bool(entry["is_premium"]),
                )
            )
    return seeds


def load_vocabulary_seeds() -> list[VocabularySeed]:
    """Read and validate every vocabulary pack edition (SN-009 + SN-018 + SN-020)."""
    # English v1+v2 first, then the French pack: 220 total cards.
    seeds: list[VocabularySeed] = []
    seen_ids: set[str] = set()
    for relative_path, pack_language in VOCABULARY_PACK_EDITIONS:
        with _resolve(relative_path).open(encoding="utf-8") as handle:
            raw: list[dict[str, Any]] = json.load(handle)
        language = str(pack_language or "en")
        for entry in raw:
            content_id = str(entry["id"])
            if content_id in seen_ids:
                raise ValueError(
                    f"Duplicate vocabulary id across packs: {content_id!r}"
                )
            seen_ids.add(content_id)
            params = entry["fsrs_params"]
            seeds.append(
                VocabularySeed(
                    content_id=content_id,
                    word=str(entry["word"]),
                    translations={
                        code: str(translation)
                        for code, translation in entry["translations"].items()
                    },
                    # Pack difficulty is 0-1; FSRS difficulty runs 1-10.
                    difficulty=round(1.0 + 9.0 * float(params["difficulty"]), 4),
                    stability=float(params["stability"]),
                    language=language,
                )
            )
    return seeds


async def seed_scenarios(db: AsyncSession) -> int:
    """Idempotently upsert all scenarios from every pack edition."""
    seeds = load_scenario_seeds()
    for seed in seeds:
        values = {
            "id": seed.id,
            "title": seed.title,
            "description": seed.description,
            "category": seed.category,
            "mode": seed.mode,
            "level": seed.level,
            "difficulty": seed.difficulty,
            "target_language": seed.target_language,
            "system_prompt": seed.system_prompt,
            "opening_line": seed.opening_line,
            "expected_turns": seed.expected_turns,
            "success_criteria": seed.success_criteria,
            "vocabulary_targets": seed.vocabulary_targets,
            "grammar_targets": seed.grammar_targets,
            "cultural_notes": seed.cultural_notes,
            "is_premium": seed.is_premium,
            "is_published": True,
        }
        if dialect_name(db) == "postgresql":
            statement = (
                pg_insert(Scenario)
                .values(**values)
                .on_conflict_do_update(index_elements=["id"], set_=values)
            )
        else:
            statement = (
                sqlite_insert(Scenario)
                .values(**values)
                .on_conflict_do_update(index_elements=["id"], set_=values)
            )
        await db.execute(statement)
    await db.commit()
    logger.info("Seeded %d scenarios from the content pack.", len(seeds))
    return len(seeds)


async def ensure_user_vocabulary(
    db: AsyncSession,
    user_id: UUID,
    preferred_language: str | None = None,
) -> int:
    """Lazily materialize the vocabulary packs for a user with no cards.

    Loads every edition (SN-009 + SN-018 + SN-020, 220 items) up to the
    settings-driven pack limit, ordering seeds whose language matches
    `preferred_language` first so preferred-language cards always fit
    inside the cap. Regional preferences such as "fr-CA" match their
    base pack ("fr"). Existing cards are never touched; re-runs are
    no-ops thanks to deterministic per-user card ids.
    """
    count = (
        await db.execute(
            select(func.count())
            .select_from(VocabularyCard)
            .where(VocabularyCard.user_id == user_id)
        )
    ).scalar_one()
    if int(count) > 0:
        return 0

    seeds = load_vocabulary_seeds()
    if preferred_language:
        preferred_tag = _primary_language_tag(preferred_language)
        matching = [
            seed
            for seed in seeds
            if _primary_language_tag(seed.language) == preferred_tag
        ]
        seeds = matching + [
            seed
            for seed in seeds
            if _primary_language_tag(seed.language) != preferred_tag
        ]
    seeds = seeds[:_vocabulary_pack_limit()]
    for seed in seeds:
        card = VocabularyCard(
            id=content_vocabulary_card_id(user_id, seed.content_id),
            user_id=user_id,
            word=seed.word,
            translations=seed.translations,
            stability=seed.stability,
            difficulty=seed.difficulty,
            state=0,
        )
        db.add(card)
    await db.flush()
    logger.info(
        "Materialized %d vocabulary cards for user %s.", len(seeds), user_id
    )
    return len(seeds)