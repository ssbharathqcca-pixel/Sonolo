"""
Content service for loading and materializing Sonolo learning packs.
Pack discovery is manifest-driven: content/manifest.json at the repo
root declares every scenario and vocabulary edition (SN-027), so new
packs ship without loader code changes. Vocabulary materialization
stays capped by `content_vocabulary_pack_limit` (default 500); seeds
tagged with the learner's preferred language are ordered ahead of the
pool so French users materialize French cards inside the same cap
instead of losing them to other-language cards.
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
from app.models.user import User
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

#: Repository root: backend/app/services/content_service.py -> parents[3].
REPO_ROOT = Path(__file__).resolve().parents[3]

#: Single source of truth for pack discovery (SN-027): every scenario and
#: vocabulary edition is declared in the manifest with language, tier, and
#: UI metadata instead of hardcoded loader tuples.
MANIFEST_PATH = REPO_ROOT / "content" / "manifest.json"


def _vocabulary_pack_limit() -> int:
    """Cap on cards materialized per user from the vocabulary packs.

    Settings-driven via the optional `content_vocabulary_pack_limit`
    field, defaulting to 1000 for the combined pack catalog.
    """
    return get_settings().content_vocabulary_pack_limit

def content_scenario_id(content_id: str) -> UUID:
    """Deterministic scenario PK for a content-pack slug."""
    return uuid.uuid5(CONTENT_NAMESPACE, f"scenario:{content_id}")


def content_vocabulary_card_id(user_id: UUID, content_id: str) -> UUID:
    """Deterministic per-user card PK for a content-pack vocab id."""
    return uuid.uuid5(CONTENT_NAMESPACE, f"vocab:{user_id}:{content_id}")


def _primary_language_tag(code: str) -> str:
    """Base subtag of a BCP-47-style code so "fr-CA" matches the "fr" pack."""
    return code.strip().lower().split("-", 1)[0]


@dataclass(frozen=True)
class ManifestPack:
    """One pack entry from content/manifest.json."""

    id: str
    type: str  # "scenarios" | "vocabulary"
    language: str
    path: str  # Repo-root relative, e.g. content/scenarios/canadian-life-v1.json.


def load_manifest() -> dict[str, Any]:
    """Read and return the parsed content manifest (SN-030)."""
    with MANIFEST_PATH.open(encoding="utf-8") as handle:
        manifest: dict[str, Any] = json.load(handle)
    return manifest


def load_manifest_packs() -> list[ManifestPack]:
    """Read the content manifest and validate its pack entries.

    Pack ids must be unique across the manifest; loaders filter the
    returned entries by `type` and resolve `path` against the repo root.
    """
    manifest = load_manifest()
    packs: list[ManifestPack] = []
    seen_ids: set[str] = set()
    for entry in manifest.get("packs", []):
        pack_id = str(entry["id"])
        if pack_id in seen_ids:
            raise ValueError(f"Duplicate pack id in content manifest: {pack_id!r}")
        seen_ids.add(pack_id)
        packs.append(
            ManifestPack(
                id=pack_id,
                type=str(entry["type"]),
                language=str(entry["language"]),
                path=str(entry["path"]),
            )
        )
    return packs


def _resolve_pack_path(manifest_path: str) -> Path:
    """Resolve a manifest pack path relative to the repository root."""
    path = Path(manifest_path)
    if path.is_absolute():
        return path
    return REPO_ROOT / path


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
    #: Manifest pack the scenario belongs to (SN-035); drives the Learn
    #: tab's per-pack filtering and counts.
    pack_id: str


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
    """Read and validate every scenario pack listed in the manifest."""
    # Manifest order governs pack precedence (English v1+v2, workplace,
    # healthcare, then Quebec): 65 total scenarios today; new packs
    # append without code changes. Each seed carries its manifest pack
    # id so seeded rows map back to their pack (SN-035).
    packs = [
        pack for pack in load_manifest_packs() if pack.type == "scenarios"
    ]
    seeds: list[ScenarioSeed] = []
    seen_ids: set[str] = set()
    for pack in packs:
        with _resolve_pack_path(pack.path).open(encoding="utf-8") as handle:
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
                    pack_id=pack.id,
                )
            )
    return seeds


def load_vocabulary_seeds() -> list[VocabularySeed]:
    """Read and validate every vocabulary pack listed in the manifest."""
    # Pack-level language comes from the manifest and orders seeds at
    # materialization time so a learner's preferred language fills the
    # pack limit before other languages.
    editions = [
        (_resolve_pack_path(pack.path), pack.language)
        for pack in load_manifest_packs()
        if pack.type == "vocabulary"
    ]
    seeds: list[VocabularySeed] = []
    seen_ids: set[str] = set()
    for path, pack_language in editions:
        with path.open(encoding="utf-8") as handle:
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
    logger.info("Seeded %d scenarios from the content pack.", len(seeds))
    return len(seeds)


async def ensure_user_vocabulary(
    db: AsyncSession,
    user_id: UUID,
    preferred_language: str | None = None,
) -> int:
    """Lazily materialize the vocabulary packs for a user with no cards.

    Loads every edition up to the settings-driven pack limit after
    ordering seeds whose language matches the learner's preference
    ahead of the pool, so preferred-language cards always fit inside
    the cap. The preference is read from the users table when the
    caller omits it, falling back to "en" when unset; regional tags
    such as "fr-CA" match their base pack ("fr"). Existing cards are
    never touched; re-runs are no-ops thanks to deterministic
    per-user card ids.
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

    preference = preferred_language
    if not preference:
        preference = (
            await db.execute(
                select(User.preferred_language).where(User.id == user_id)
            )
        ).scalar_one_or_none()
    preferred_tag = _primary_language_tag(preference or "en")

    seeds = load_vocabulary_seeds()
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
    # The cap applies after sorting so preferred-language cards are
    # never crowded out of materialization by other languages.
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