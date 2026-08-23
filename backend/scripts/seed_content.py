"""Seed Sonolo content packs into the configured database.

Usage (from backend/, with DATABASE_URL pointing at the target DB):

    .venv/Scripts/python -m scripts.seed_content

Loads BOTH editions of each pack:

    scenarios  : content/scenarios/canadian-life-v1.json + -v2.json  (40)
    vocabulary : content/vocabulary/core-v1.json + core-v2.json      (200)

Scenarios are shared rows upserted idempotently under deterministic
uuid5 PKs derived in the SAME namespace as
app.services.content_service, so seeded ids match what lazy
materialization and the API return regardless of which code path
seeded first. Vocabulary stays user-scoped by design (D-008): this
script validates and counts the combined pack; cards materialize
lazily per user via GET /api/review/due. Re-running is a no-op:
counts stay stable at 40 scenarios / 200 vocabulary pack items.
"""

import asyncio
import json
import sys
from pathlib import Path
from typing import Any

from sqlalchemy import func, select

from app.db.session import AsyncSessionLocal, dialect_name
from app.models.scenario import Scenario
from app.services.content_service import (
    LEVEL_DIFFICULTY,
    ScenarioSeed,
    content_scenario_id,
)
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert

BACKEND_DIR = Path(__file__).resolve().parents[1]

SCENARIO_PACKS = [
    "../content/scenarios/canadian-life-v1.json",
    "../content/scenarios/canadian-life-v2.json",
]

VOCABULARY_PACKS = [
    "../content/vocabulary/core-v1.json",
    "../content/vocabulary/core-v2.json",
]

REQUIRED_VOCAB_FIELDS = {"id", "word", "translations", "fsrs_params"}
REQUIRED_TRANSLATIONS = {"pa", "hi", "zh", "es"}


def _resolve(path_setting: str) -> Path:
    path = Path(path_setting)
    if path.is_absolute():
        return path
    return BACKEND_DIR / path


def _load_scenario_pack(rel_path: str) -> list[ScenarioSeed]:
    """Flatten one scenario pack exactly like the service loader."""
    with _resolve(rel_path).open(encoding="utf-8") as handle:
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


def load_all_scenario_seeds() -> list[ScenarioSeed]:
    """Load every scenario edition, newest last on conflict."""
    seeds: list[ScenarioSeed] = []
    for rel_path in SCENARIO_PACKS:
        seeds.extend(_load_scenario_pack(rel_path))
    if len({seed.id for seed in seeds}) != len(seeds):
        raise ValueError("Scenario packs contain duplicate content ids.")
    return seeds


def validate_vocabulary_packs() -> dict[str, int]:
    """Parse both vocabulary packs and verify the shared schema."""
    counts: dict[str, int] = {}
    seen_words: set[str] = set()
    total = 0
    for rel_path in VOCABULARY_PACKS:
        with _resolve(rel_path).open(encoding="utf-8") as handle:
            raw: list[dict[str, Any]] = json.load(handle)
        for entry in raw:
            missing = REQUIRED_VOCAB_FIELDS - entry.keys()
            if missing:
                raise ValueError(
                    f"{rel_path}: item {entry.get('id')!r} missing {sorted(missing)}"
                )
            codes = set(entry["translations"])
            if codes != REQUIRED_TRANSLATIONS:
                raise ValueError(
                    f"{rel_path}: item {entry['id']!r} translations {sorted(codes)}"
                    f" != {sorted(REQUIRED_TRANSLATIONS)}"
                )
            params = entry["fsrs_params"]
            if not 0.0 <= float(params["difficulty"]) <= 1.0:
                raise ValueError(
                    f"{rel_path}: item {entry['id']!r} difficulty out of range"
                )
            word = str(entry["word"]).casefold()
            if word in seen_words:
                raise ValueError(f"{rel_path}: duplicate word {word!r}")
            seen_words.add(word)
        name = Path(rel_path).stem
        counts[name] = len(raw)
        total += len(raw)
    counts["total"] = total
    return counts


async def seed_scenarios(db) -> int:
    """Idempotently upsert all scenarios from every loaded pack."""
    seeds = load_all_scenario_seeds()
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
    print(f"scenario_upserts={len(seeds)}")
    return len(seeds)


async def main() -> int:
    vocab_counts = validate_vocabulary_packs()
    async with AsyncSessionLocal() as session:
        before = int(
            (
                await session.execute(
                    select(func.count()).select_from(Scenario)
                )
            ).scalar_one()
        )
        upserts = await seed_scenarios(session)
        after = int(
            (
                await session.execute(
                    select(func.count()).select_from(Scenario)
                )
            ).scalar_one()
        )
    print(f"scenarios_before={before}")
    print(f"scenarios_after={after}")
    print(
        "vocabulary_pack_items="
        f"{vocab_counts.pop('total')}"
        f" ({', '.join(f'{k}={v}' for k, v in vocab_counts.items())})"
    )
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
