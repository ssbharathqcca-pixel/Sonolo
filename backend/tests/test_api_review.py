"""Integration tests for the FSRS review API (SN-012 + SN-014A auth).

All endpoints are user-scoped: due lists only the caller's cards, and
answers never touch another user's scheduling state.
"""

import uuid
from collections.abc import AsyncIterator
from datetime import UTC, datetime, timedelta

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

import app.models  # noqa: F401  — registers all tables on Base.metadata
from app.core.config import Settings
from app.db.session import get_db
from app.main import create_app
from app.models.user import User
from app.models.vocabulary import VocabularyCard
from app.services.content_service import load_vocabulary_seeds

pytestmark = pytest.mark.asyncio

TRANSLATIONS = {"pa": "ਸ਼ਬਦ", "hi": "शब्द", "zh": "词", "es": "palabra"}

FRENCH_WORDS = {
    seed.word for seed in load_vocabulary_seeds() if seed.language == "fr"
}

ENGLISH_WORDS = {
    seed.word for seed in load_vocabulary_seeds() if seed.language == "en"
}

# Some words are spelled identically in both languages (thermostat,
# inspection, transaction, triage) and are legitimately taught in each
# pack; only French-only words must stay out of an English learner's
# queue (SN-040 pack additions introduced the shared spellings).
FRENCH_ONLY_WORDS = FRENCH_WORDS - ENGLISH_WORDS


@pytest_asyncio.fixture
async def review_client(
    db_engine, db_session: AsyncSession
) -> AsyncIterator[AsyncClient]:
    """HTTP client wired to the app with the DB session overridden."""
    app = create_app(Settings(_env_file=None))

    async def override_session() -> AsyncIterator[AsyncSession]:
        yield db_session

    app.dependency_overrides[get_db] = override_session
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        yield client


async def register_and_login(
    review_client: AsyncClient, email: str
) -> dict[str, str]:
    register = await review_client.post(
        "/api/auth/register",
        json={
            "email": email,
            "name": email.split("@")[0].title(),
            "password": "maple-syrup-99",
            "native_language": "hi",
            "target_language": "en-CA",
        },
    )
    assert register.status_code == 201
    login = await review_client.post(
        "/api/auth/login",
        json={"email": email, "password": "maple-syrup-99"},
    )
    assert login.status_code == 200
    return {"Authorization": f"Bearer {login.json()['access_token']}"}


async def seed_user(db_session: AsyncSession, email: str) -> User:
    user = User(
        email=email,
        name=email.split("@")[0].title(),
        native_language="hi",
        target_language="en-CA",
        learning_goal="casual",
        current_level="seed",
    )
    db_session.add(user)
    await db_session.commit()
    return user


async def seed_card(
    db_session: AsyncSession,
    user: User,
    *,
    word: str,
    state: int = 0,
    stability: float = 0.0,
    difficulty: float = 0.0,
    due_offset_days: float = -1.0,
    last_review: datetime | None = None,
    lapses: int = 0,
) -> VocabularyCard:
    card = VocabularyCard(
        user_id=user.id,
        word=word,
        translations=TRANSLATIONS,
        state=state,
        stability=stability,
        difficulty=difficulty,
        due_date=datetime.now(UTC) + timedelta(days=due_offset_days),
        last_review=last_review,
        lapses=lapses,
    )
    db_session.add(card)
    await db_session.commit()
    return card


async def test_due_returns_only_own_due_cards(
    review_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(review_client, "pavan@example.com")
    user = (
        await db_session.execute(
            select(User).where(User.email == "pavan@example.com")
        )
    ).scalar_one()
    due_review = await seed_card(
        db_session, user, word="lease", state=2, stability=5.0,
        difficulty=5.0, due_offset_days=-3.0,
        last_review=datetime.now(UTC) - timedelta(days=7),
    )
    await seed_card(db_session, user, word="mortgage", due_offset_days=2.0)
    await seed_card(
        db_session, user, word="overdraft", state=3, stability=1.0,
        due_offset_days=-2.0,
    )
    other = await seed_user(db_session, "rina@example.com")
    await seed_card(db_session, other, word="hydro")

    response = await review_client.get("/api/review/due", headers=headers)

    assert response.status_code == 200
    cards = response.json()
    assert len(cards) == 1
    assert cards[0]["id"] == str(due_review.id)
    assert cards[0]["word"] == "lease"
    assert cards[0]["translations"] == TRANSLATIONS


async def test_due_respects_limit(
    review_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(review_client, "pavan@example.com")
    user = (
        await db_session.execute(
            select(User).where(User.email == "pavan@example.com")
        )
    ).scalar_one()
    for index in range(4):
        await seed_card(db_session, user, word=f"word-{index}")

    response = await review_client.get(
        "/api/review/due", headers=headers, params={"limit": 2}
    )

    assert response.status_code == 200
    assert len(response.json()) == 2


async def test_answer_processes_new_card_and_persists(
    review_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(review_client, "pavan@example.com")
    user = (
        await db_session.execute(
            select(User).where(User.email == "pavan@example.com")
        )
    ).scalar_one()
    card = await seed_card(db_session, user, word="double-double")

    response = await review_client.post(
        "/api/review/answer",
        json={"card_id": str(card.id), "rating": "good"},
        headers=headers,
    )

    assert response.status_code == 200
    body = response.json()
    assert body["state"] == 2
    assert body["scheduled_days"] == 1
    assert body["reps"] == 1

    stored = await db_session.get(VocabularyCard, card.id)
    assert stored is not None
    assert stored.state == 2
    assert stored.scheduled_days == 1
    assert stored.last_review is not None


async def test_answer_again_on_review_card_increments_lapses(
    review_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(review_client, "pavan@example.com")
    user = (
        await db_session.execute(
            select(User).where(User.email == "pavan@example.com")
        )
    ).scalar_one()
    card = await seed_card(
        db_session, user, word="utilities", state=2, stability=10.0,
        difficulty=5.0, due_offset_days=-1.0,
        last_review=datetime.now(UTC) - timedelta(days=10),
    )

    response = await review_client.post(
        "/api/review/answer",
        json={"card_id": str(card.id), "rating": "again"},
        headers=headers,
    )

    assert response.status_code == 200
    body = response.json()
    assert body["state"] == 3
    assert body["lapses"] == 1
    assert body["stability"] < 10.0


async def test_endpoints_require_authentication(
    review_client: AsyncClient, db_session: AsyncSession
) -> None:
    no_token_due = await review_client.get("/api/review/due")
    assert no_token_due.status_code == 401

    no_token_answer = await review_client.post(
        "/api/review/answer",
        json={"card_id": str(uuid.uuid4()), "rating": "good"},
    )
    assert no_token_answer.status_code == 401


async def test_other_users_card_is_not_found(
    review_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(review_client, "pavan@example.com")
    other = await seed_user(db_session, "rina@example.com")
    other_card = await seed_card(db_session, other, word="hydro")

    response = await review_client.post(
        "/api/review/answer",
        json={"card_id": str(other_card.id), "rating": "good"},
        headers=headers,
    )

    assert response.status_code == 404
    stored = await db_session.get(VocabularyCard, other_card.id)
    assert stored is not None
    assert stored.state == 0  # Untouched.


async def test_users_schedule_same_word_independently(
    review_client: AsyncClient, db_session: AsyncSession
) -> None:
    pavan_headers = await register_and_login(review_client, "pavan@example.com")
    pavan = (
        await db_session.execute(
            select(User).where(User.email == "pavan@example.com")
        )
    ).scalar_one()
    rina = await seed_user(db_session, "rina@example.com")
    pavan_card = await seed_card(db_session, pavan, word="double-double")
    rina_card = await seed_card(db_session, rina, word="double-double")
    original_due = rina_card.due_date
    rina_card_id = rina_card.id

    response = await review_client.post(
        "/api/review/answer",
        json={"card_id": str(pavan_card.id), "rating": "easy"},
        headers=pavan_headers,
    )
    assert response.status_code == 200
    assert response.json()["scheduled_days"] == 7

    db_session.expire_all()
    rina_stored = await db_session.get(VocabularyCard, rina_card_id)
    assert rina_stored is not None
    assert rina_stored.state == 0  # Still new: Rina never reviewed it.
    assert rina_stored.reps == 0
    # SQLite returns naive datetimes; compare instant-wise.
    original = original_due.replace(tzinfo=None) if original_due.tzinfo else original_due
    stored_due = (
        rina_stored.due_date.replace(tzinfo=None)
        if rina_stored.due_date.tzinfo
        else rina_stored.due_date
    )
    assert stored_due == original


async def test_new_user_sees_new_cards_as_due(
    review_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(review_client, "pavan@example.com")
    user = (
        await db_session.execute(
            select(User).where(User.email == "pavan@example.com")
        )
    ).scalar_one()
    await seed_card(db_session, user, word="neighbour")  # state 0, due now

    response = await review_client.get("/api/review/due", headers=headers)

    assert response.status_code == 200
    cards = response.json()
    assert [card["word"] for card in cards] == ["neighbour"]
    assert cards[0]["state"] == 0


async def test_answer_unknown_card_returns_404(
    review_client: AsyncClient,
) -> None:
    headers = await register_and_login(review_client, "pavan@example.com")
    response = await review_client.post(
        "/api/review/answer",
        json={"card_id": str(uuid.uuid4()), "rating": "good"},
        headers=headers,
    )
    assert response.status_code == 404


async def test_answer_rejects_invalid_rating(
    review_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(review_client, "pavan@example.com")
    user = (
        await db_session.execute(
            select(User).where(User.email == "pavan@example.com")
        )
    ).scalar_one()
    card = await seed_card(db_session, user, word="hydro")

    response = await review_client.post(
        "/api/review/answer",
        json={"card_id": str(card.id), "rating": "perfect"},
        headers=headers,
    )
    assert response.status_code == 422


async def test_due_materializes_french_cards_for_french_users(
    review_client: AsyncClient,
) -> None:
    headers = await register_and_login(review_client, "pavan@example.com")
    switched = await review_client.post(
        "/api/users/me/language",
        json={"language": "fr"},
        headers=headers,
    )
    assert switched.status_code == 200

    response = await review_client.get(
        "/api/review/due", headers=headers, params={"limit": 100}
    )

    assert response.status_code == 200
    words = {card["word"] for card in response.json()}
    # Preferred-language cards materialize ahead of the English pool, so
    # the first page (capped at 100) is entirely French. Distinct words
    # can be fewer than 100 because packs reuse some words.
    assert words <= FRENCH_WORDS
    assert len(words) >= 90
    assert "ordonnance" in words


async def test_due_keeps_english_for_default_users(
    review_client: AsyncClient,
) -> None:
    headers = await register_and_login(review_client, "pavan@example.com")

    response = await review_client.get(
        "/api/review/due", headers=headers, params={"limit": 100}
    )

    assert response.status_code == 200
    words = {card["word"] for card in response.json()}
    assert words
    assert not words & FRENCH_ONLY_WORDS
