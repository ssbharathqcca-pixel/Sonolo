"""Seed Sonolo content packs into the configured database.

Usage (from backend/, with DATABASE_URL pointing at the target DB):

    .venv/Scripts/python -m scripts.seed_content

Loads every pack declared in content/manifest.json (SN-027):

    scenarios  : canadian-life-v1 + v2, quebec-life-v1,
                 workplace-english-v1, healthcare-english-v1,
                 quebec-healthcare-v1, quebec-workplace-v1,
                 housing-english-v1, finance-english-v1,
                 quebec-housing-v1, quebec-finance-v1,
                 smalltalk-english-v1                       (135)
    vocabulary : core-v1 + v2, core-fr-v1, workplace + healthcare,
                 quebec-healthcare + quebec-workplace,
                 housing + finance, quebec-housing + quebec-finance,
                 smalltalk                                  (670)

Scenarios are shared rows upserted idempotently under deterministic
uuid5 PKs derived in the SAME namespace as
app.services.content_service — the script delegates to the service
loader so both seeding paths stay byte-identical, including the
per-scenario pack_id mapping (SN-035). Vocabulary stays user-scoped
by design (D-008): this script validates and counts the combined
packs; cards materialize lazily per user via GET /api/review/due.
Re-running is a no-op: counts stay stable at 135 scenarios / 670
vocabulary pack items.
"""

import asyncio
import json
import sys
from typing import Any

from sqlalchemy import func, select

from app.db.session import AsyncSessionLocal, dialect_name
from app.models.scenario import Scenario
from app.services.content_service import (
    _resolve_pack_path,
    load_manifest_packs,
    load_scenario_seeds,
)
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert

REQUIRED_VOCAB_FIELDS = {"id", "word", "translations", "fsrs_params"}
REQUIRED_TRANSLATIONS = {"pa", "en", "hi", "zh", "es"}
# English-target packs carry the four L1 translations; French-target
# packs additionally carry "en" (SN-020/SN-036). Both sets are valid.
ALLOWED_TRANSLATION_SETS = {
    frozenset({"pa", "hi", "zh", "es"}),
    frozenset(REQUIRED_TRANSLATIONS),
}


def load_all_scenario_seeds():
    """Load every manifest scenario pack through the service loader."""
    return load_scenario_seeds()


def validate_vocabulary_packs() -> dict[str, int]:
    """Parse every manifest vocabulary pack and verify the shared schema."""
    counts: dict[str, int] = {}
    total = 0
    packs = [
        pack for pack in load_manifest_packs() if pack.type == "vocabulary"
    ]
    for pack in packs:
        path = _resolve_pack_path(pack.path)
        with path.open(encoding="utf-8") as handle:
            raw: list[dict[str, Any]] = json.load(handle)
        # Word overlaps ACROSS packs are by design (e.g. "interview");
        # only duplicates inside one pack indicate a curation mistake.
        seen_words: set[str] = set()
        for entry in raw:
            missing = REQUIRED_VOCAB_FIELDS - entry.keys()
            if missing:
                raise ValueError(
                    f"{pack.id}: item {entry.get('id')!r} missing {sorted(missing)}"
                )
            codes = frozenset(entry["translations"])
            if codes not in ALLOWED_TRANSLATION_SETS:
                raise ValueError(
                    f"{pack.id}: item {entry['id']!r} translations {sorted(codes)}"
                    f" not one of {[sorted(s) for s in ALLOWED_TRANSLATION_SETS]}"
                )
            params = entry["fsrs_params"]
            if not 0.0 <= float(params["difficulty"]) <= 1.0:
                raise ValueError(
                    f"{pack.id}: item {entry['id']!r} difficulty out of range"
                )
            word = str(entry["word"]).casefold()
            if word in seen_words:
                raise ValueError(f"{pack.id}: duplicate word {word!r}")
            seen_words.add(word)
        counts[pack.id] = len(raw)
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
            "pack_id": seed.pack_id,
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