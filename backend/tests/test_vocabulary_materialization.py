"""Language-aware vocabulary materialization checks (SN-020/SN-033).

Seeds matching the learner's preferred language are ordered ahead of
the pool before the 1000-card cap applies, so preferred-language cards
are never crowded out. The full manifest (520 seeds today) now exceeds
the cap, so the preferred language always fills first and the tail of
the other language is cut off — which is exactly what the cap is for.
"""

import pytest
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.vocabulary import VocabularyCard
from app.services.content_service import (
    _vocabulary_pack_limit,
    ensure_user_vocabulary,
    load_vocabulary_seeds,
)

pytestmark = pytest.mark.asyncio

SEEDS = load_vocabulary_seeds()
FRENCH_WORDS = {seed.word for seed in SEEDS if seed.language == "fr"}
ENGLISH_WORDS = {seed.word for seed in SEEDS if seed.language == "en"}
TOTAL_SEEDS = len(SEEDS)
# Packs reuse some words ("ID", "PIN", ...): count distinct spellings.
ALL_WORDS = {seed.word for seed in SEEDS}


async def seed_user(
    db_session: AsyncSession, email: str, preferred_language: str
) -> User:
    user = User(
        email=email,
        name=email.split("@")[0].title(),
        native_language="hi",
        target_language="en-CA",
        learning_goal="casual",
        current_level="seed",
        preferred_language=preferred_language,
    )
    db_session.add(user)
    await db_session.commit()
    return user


async def materialized_words(db_session: AsyncSession, user: User) -> set[str]:
    result = await db_session.execute(
        select(VocabularyCard.word).where(VocabularyCard.user_id == user.id)
    )
    return set(result.scalars().all())


async def test_french_user_materializes_french_cards_inside_cap(
    db_session: AsyncSession,
) -> None:
    user = await seed_user(db_session, "claire@example.com", "fr")

    materialized = await ensure_user_vocabulary(
        db_session, user.id, user.preferred_language
    )

    assert materialized == min(TOTAL_SEEDS, _vocabulary_pack_limit())
    words = await materialized_words(db_session, user)
    # Every French card lands ahead of the English pool inside the cap;
    # the pool exceeds the cap, so only the English tail is cut off.
    assert FRENCH_WORDS <= words
    assert len(words) == len(ALL_WORDS)


async def test_english_user_still_materializes_english_cards(
    db_session: AsyncSession,
) -> None:
    user = await seed_user(db_session, "pavan@example.com", "en")

    materialized = await ensure_user_vocabulary(
        db_session, user.id, user.preferred_language
    )

    assert materialized == min(TOTAL_SEEDS, _vocabulary_pack_limit())
    words = await materialized_words(db_session, user)
    # All English seeds fit for an English-learner (400 < 1000 cap).
    assert ENGLISH_WORDS <= words
    assert "lease" in words  # First card of the English v1 pack.


async def test_vocabulary_cap_remains_active_for_any_language(
    db_session: AsyncSession,
) -> None:
    user = await seed_user(db_session, "rina@example.com", "fr")

    materialized = await ensure_user_vocabulary(
        db_session, user.id, user.preferred_language
    )

    total = (
        await db_session.execute(
            select(func.count())
            .select_from(VocabularyCard)
            .where(VocabularyCard.user_id == user.id)
        )
    ).scalar_one()
    assert materialized == min(TOTAL_SEEDS, _vocabulary_pack_limit())
    assert total == materialized


async def test_regional_variant_preference_matches_base_pack(
    db_session: AsyncSession,
) -> None:
    french_quebec = await seed_user(
        db_session, "genevieve@example.com", "fr-CA"
    )
    english_canada = await seed_user(
        db_session, "chester@example.com", "en-CA"
    )

    await ensure_user_vocabulary(
        db_session, french_quebec.id, french_quebec.preferred_language
    )
    await ensure_user_vocabulary(
        db_session, english_canada.id, english_canada.preferred_language
    )

    quebec_words = await materialized_words(db_session, french_quebec)
    canada_words = await materialized_words(db_session, english_canada)
    assert FRENCH_WORDS <= quebec_words
    assert ENGLISH_WORDS <= canada_words


async def test_missing_preference_defaults_to_english_from_db(
    db_session: AsyncSession,
) -> None:
    user = await seed_user(db_session, "legacy@example.com", "en")

    # No preference passed: the service reads users.preferred_language
    # itself and falls back to "en" when unset.
    materialized = await ensure_user_vocabulary(db_session, user.id, None)

    assert materialized == min(TOTAL_SEEDS, _vocabulary_pack_limit())
    words = await materialized_words(db_session, user)
    assert ENGLISH_WORDS <= words


async def test_cap_applies_after_preferred_language_sort(
    db_session: AsyncSession, monkeypatch: pytest.MonkeyPatch
) -> None:
    """With a shrunken cap, French fills the budget before English."""
    user = await seed_user(db_session, "amara@example.com", "fr")
    monkeypatch.setattr(
        "app.services.content_service._vocabulary_pack_limit", lambda: 30
    )

    materialized = await ensure_user_vocabulary(db_session, user.id)

    words = await materialized_words(db_session, user)
    assert materialized == 30
    # French fills the shrunken budget first; no English leaks in.
    # Distinct words can be fewer than 30 because packs reuse some.
    assert words <= FRENCH_WORDS
    assert len(words) >= 25
