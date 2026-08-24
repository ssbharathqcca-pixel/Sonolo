"""French Phase 2 content pack checks (SN-020).

Validates the raw JSON packs against the exact schema shape of the
existing English editions, the flattened seeds the loader produces,
deterministic uuid5 IDs, and duplicate detection across packs.
"""

import json
import uuid
from pathlib import Path

import pytest

from app.services import content_service
from app.services.content_service import (
    CONTENT_NAMESPACE,
    LEVEL_DIFFICULTY,
    load_scenario_seeds,
    load_vocabulary_seeds,
)

CONTENT_DIR = Path(content_service.__file__).resolve().parents[3] / "content"

SCENARIO_SCHEMA_KEYS = {
    "id",
    "title",
    "description",
    "category",
    "mode",
    "level",
    "target_language",
    "system_prompt",
    "opening_line",
    "expected_turns",
    "success_criteria",
    "vocabulary_targets",
    "grammar_targets",
    "cultural_notes",
    "is_premium",
}

VOCABULARY_SCHEMA_KEYS = {
    "id",
    "word",
    "phonetic",
    "translations",
    "level",
    "category",
    "example_sentences",
    "confusion_pairs",
    "fsrs_params",
}


def _raw_pack(relative: str) -> list[dict]:
    with (CONTENT_DIR / relative).open(encoding="utf-8") as handle:
        return json.load(handle)


def _french_scenario_seeds():
    return [
        seed
        for seed in load_scenario_seeds()
        if seed.target_language == "fr"
    ]


def _french_vocabulary_seeds():
    return [
        seed
        for seed in load_vocabulary_seeds()
        if int(seed.content_id.split("-")[-1]) > 200
    ]


def test_french_scenario_pack_loads_five_free_scenarios() -> None:
    seeds = _french_scenario_seeds()
    assert len(seeds) == 5
    assert all(seed.is_premium is False for seed in seeds)
    assert {seed.level for seed in seeds} <= set(LEVEL_DIFFICULTY)


def test_french_scenarios_match_english_schema_shape() -> None:
    english = _raw_pack("scenarios/canadian-life-v1.json")
    french = _raw_pack("scenarios/quebec-life-v1.json")
    english_keys = set(english[0].keys())
    for entry in french:
        # Same fields as the English packs; is_published is optional.
        assert SCENARIO_SCHEMA_KEYS <= set(entry.keys())
        assert set(entry.keys()) - {"is_published"} == english_keys - {
            "is_published"
        }
        assert entry["is_premium"] is False
        assert isinstance(entry["expected_turns"], int)
        assert len(entry["success_criteria"]) >= 3


def test_french_vocabulary_pack_has_twenty_schema_complete_cards() -> None:
    seeds = _french_vocabulary_seeds()
    assert len(seeds) == 20
    for entry in _raw_pack("vocabulary/core-fr-v1.json"):
        assert VOCABULARY_SCHEMA_KEYS <= set(entry.keys())
        assert set(entry["translations"]) == {"pa", "hi", "zh", "es"}
        assert len(entry["example_sentences"]) == 2
        difficulty = entry["fsrs_params"]["difficulty"]
        assert 0.0 <= difficulty <= 1.0  # Pack scale; loader maps to 1-10.


def test_french_vocab_fsrs_priors_survive_the_loader() -> None:
    for seed in _french_vocabulary_seeds():
        assert 1.0 <= seed.difficulty <= 10.0
        assert seed.stability > 0
        assert set(seed.translations) == {"pa", "hi", "zh", "es"}


def test_french_content_ids_are_deterministic_uuid5() -> None:
    scenario_ids = {seed.title: str(seed.id) for seed in _french_scenario_seeds()}
    expected = str(
        uuid.uuid5(
            CONTENT_NAMESPACE, "scenario:ramq-carte-sante-rendez-vous"
        )
    )
    assert expected in scenario_ids.values()
    # Reloading yields byte-identical IDs — no randomness across restarts.
    assert scenario_ids == {
        seed.title: str(seed.id) for seed in _french_scenario_seeds()
    }


def test_duplicate_scenario_ids_across_packs_raise(monkeypatch) -> None:
    monkeypatch.setattr(
        content_service,
        "SCENARIO_PACK_EDITIONS",
        content_service.SCENARIO_PACK_EDITIONS
        + (content_service.SCENARIO_PACK_EDITIONS[0],),
    )
    with pytest.raises(ValueError, match="Duplicate scenario id"):
        load_scenario_seeds()


def test_duplicate_vocabulary_ids_across_packs_raise(monkeypatch) -> None:
    monkeypatch.setattr(
        content_service,
        "VOCABULARY_PACK_EDITIONS",
        content_service.VOCABULARY_PACK_EDITIONS
        + (content_service.VOCABULARY_PACK_EDITIONS[-1],),
    )
    with pytest.raises(ValueError, match="Duplicate vocabulary id"):
        load_vocabulary_seeds()


def test_combined_seed_counts() -> None:
    seeds = load_scenario_seeds()
    vocab = load_vocabulary_seeds()
    assert len(seeds) == 45
    assert sum(1 for s in seeds if s.target_language.startswith("en")) == 40
    assert len(vocab) == 220
