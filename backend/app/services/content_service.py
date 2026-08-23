"""Content bootstrap service (SN-014B).

Loads the validated SN-008 scenario pack and SN-009 vocabulary pack
into the runtime database:

- Scenarios are shared content rows, upserted idempotently under
  deterministic UUIDs derived from the content id.
- Vocabulary cards are USER-SCOPED instances by design (SN-006): the
  pack is shared content, lazily materialized per user the first time
  they request due cards, seeding FSRS state from the pack's
  fsrs_params (difficulty scaled 0-1 -> 1-10, stability as-is).
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

VOCABULARY_PACK_LIMIT = 100


def content_scenario_id(content_id: str) -> UUID:
    """Deterministic scenario PK for a content-pack slug."""
    return uuid.uuid5(CONTENT_NAMESPACE, f"scenario:{content_id}")


def content_vocabulary_card_id(user_id: UUID, content_id: str) -> UUID:
    """Deterministic per-user card PK for a content-pack vocab id."""
    return uuid.uuid5(CONTENT_NAMESPACE, f"vocab:{user_id}:{content_id}")


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


def load_scenario_seeds() -> list[ScenarioSeed]:
    """Read and validate the SN-008 scenario pack."""
    settings = get_settings()
    path = _resolve(settings.content_scenarios_path)
    with path.open(encoding="utf-8") as handle:
        raw: list[dict[str, Any]] = json.load(handle)
    seeds: list[ScenarioSeed] = []
    for entry in raw:
        level = str(entry["level"])
        seeds.append(
            ScenarioSeed(
                id=content_scenario_id(str(entry["id"])),
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
    """Read and validate the SN-009 vocabulary pack."""
    settings = get_settings()
    path = _resolve(settings.content_vocabulary_path)
    with path.open(encoding="utf-8") as handle:
        raw: list[dict[str, Any]] = json.load(handle)
    seeds: list[VocabularySeed] = []
    for entry in raw:
        params = entry["fsrs_params"]
        seeds.append(
            VocabularySeed(
                content_id=str(entry["id"]),
                word=str(entry["word"]),
                translations={
                    code: str(translation)
                    for code, translation in entry["translations"].items()
                },
                # Pack difficulty is 0-1; FSRS difficulty runs 1-10.
                difficulty=round(1.0 + 9.0 * float(params["difficulty"]), 4),
                stability=float(params["stability"]),
            )
        )
    return seeds


async def seed_scenarios(db: AsyncSession) -> int:
    """Idempotently upsert all scenarios from the SN-008 pack."""
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


async def ensure_user_vocabulary(db: AsyncSession, user_id: UUID) -> int:
    """Lazily materialize the SN-009 pack for a user with no cards.

    Existing cards are never touched; re-runs are no-ops thanks to
    deterministic per-user card ids.
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

    seeds = load_vocabulary_seeds()[:VOCABULARY_PACK_LIMIT]
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
