"""Language-aware vocabulary materialization checks (SN-020).

The 200-card cap must not crowd out non-English packs: seeds matching
the learner's preferred language are ordered ahead of the pool so
French users materialize French cards inside the same cap.
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

FRENCH_WORDS = {
    seed.word for seed in load_vocabulary_seeds() if seed.language == "fr"
}
ENGLISH_WORDS = {
    seed.word for seed in load_vocabulary_seeds() if seed.language == "en"
}


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

    assert materialized == 200
    words = await materialized_words(db_session, user)
    # All 20 French cards fit inside the cap ahead of the English pack.
    assert FRENCH_WORDS <= words
    assert len(words) == 200


async def test_english_user_still_materializes_english_cards(
    db_session: AsyncSession,
) -> None:
    user = await seed_user(db_session, "pavan@example.com", "en")

    materialized = await ensure_user_vocabulary(
        db_session, user.id, user.preferred_language
    )

    assert materialized == 200
    words = await materialized_words(db_session, user)
    assert words <= ENGLISH_WORDS
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
    assert materialized == min(220, _vocabulary_pack_limit())
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
    assert canada_words <= ENGLISH_WORDS


async def test_missing_preference_keeps_english_first(
    db_session: AsyncSession,
) -> None:
    user = await seed_user(db_session, "legacy@example.com", "en")

    materialized = await ensure_user_vocabulary(db_session, user.id, None)

    assert materialized == 200
    words = await materialized_words(db_session, user)
    assert words <= ENGLISH_WORDS
