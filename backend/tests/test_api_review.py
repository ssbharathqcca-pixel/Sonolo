"""Integration tests for the FSRS review API endpoints."""

import uuid
from collections.abc import AsyncIterator
from datetime import UTC, datetime, timedelta

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

import app.models  # noqa: F401  — registers all tables on Base.metadata
from app.core.config import Settings
from app.db.session import get_db
from app.main import create_app
from app.models.user import User
from app.models.vocabulary import VocabularyCard

pytestmark = pytest.mark.asyncio

TRANSLATIONS = {"pa": "ਸ਼ਬਦ", "hi": "शब्द", "zh": "词", "es": "palabra"}


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


async def seed_user(db_session: AsyncSession) -> User:
    user = User(
        name="Pavan",
        native_language="hi",
        target_language="en-CA",
        learning_goal="casual",
        current_level="sprout",
    )
    db_session.add(user)
    await db_session.commit()
    return user


async def seed_card(
    db_session: AsyncSession,
    user_id: uuid.UUID,
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
        user_id=user_id,
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


async def test_due_returns_only_due_new_and_review_cards(
    review_client: AsyncClient, db_session: AsyncSession
) -> None:
    user = await seed_user(db_session)
    due_review = await seed_card(
        db_session,
        user.id,
        word="lease",
        state=2,
        stability=5.0,
        difficulty=5.0,
        due_offset_days=-3.0,
        last_review=datetime.now(UTC) - timedelta(days=7),
    )
    await seed_card(
        db_session, user.id, word="mortgage", due_offset_days=2.0
    )
    await seed_card(
        db_session,
        user.id,
        word="overdraft",
        state=3,
        stability=1.0,
        due_offset_days=-2.0,
    )
    other_user = await seed_user(db_session)
    await seed_card(db_session, other_user.id, word="hydro")

    response = await review_client.get(
        "/api/review/due", params={"user_id": str(user.id)}
    )

    assert response.status_code == 200
    cards = response.json()
    assert len(cards) == 1
    assert cards[0]["id"] == str(due_review.id)
    assert cards[0]["word"] == "lease"
    assert cards[0]["translations"] == TRANSLATIONS
    assert cards[0]["state"] == 2
    assert cards[0]["due_date"].endswith("Z") or "+" in cards[0]["due_date"]


async def test_due_respects_limit(
    review_client: AsyncClient, db_session: AsyncSession
) -> None:
    user = await seed_user(db_session)
    for index in range(4):
        await seed_card(db_session, user.id, word=f"word-{index}")

    response = await review_client.get(
        "/api/review/due",
        params={"user_id": str(user.id), "limit": 2},
    )

    assert response.status_code == 200
    assert len(response.json()) == 2


async def test_answer_processes_new_card_and_persists(
    review_client: AsyncClient, db_session: AsyncSession
) -> None:
    user = await seed_user(db_session)
    card = await seed_card(db_session, user.id, word="double-double")

    response = await review_client.post(
        "/api/review/answer",
        json={"card_id": str(card.id), "rating": "good"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["state"] == 2
    assert body["scheduled_days"] == 1
    assert body["stability"] > 0.0
    assert body["reps"] == 1

    stored = await db_session.get(VocabularyCard, card.id)
    assert stored is not None
    assert stored.state == 2
    assert stored.scheduled_days == 1
    assert stored.last_review is not None


async def test_answer_again_on_review_card_increments_lapses(
    review_client: AsyncClient, db_session: AsyncSession
) -> None:
    user = await seed_user(db_session)
    card = await seed_card(
        db_session,
        user.id,
        word="utilities",
        state=2,
        stability=10.0,
        difficulty=5.0,
        due_offset_days=-1.0,
        last_review=datetime.now(UTC) - timedelta(days=10),
        lapses=0,
    )

    response = await review_client.post(
        "/api/review/answer",
        json={"card_id": str(card.id), "rating": "again"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["state"] == 3
    assert body["lapses"] == 1
    assert body["stability"] < 10.0

    stored = await db_session.get(VocabularyCard, card.id)
    assert stored is not None
    assert stored.lapses == 1
    assert stored.state == 3


async def test_answer_unknown_card_returns_404(
    review_client: AsyncClient,
) -> None:
    response = await review_client.post(
        "/api/review/answer",
        json={"card_id": str(uuid.uuid4()), "rating": "good"},
    )
    assert response.status_code == 404


async def test_answer_rejects_invalid_rating(
    review_client: AsyncClient, db_session: AsyncSession
) -> None:
    user = await seed_user(db_session)
    card = await seed_card(db_session, user.id, word="hydro")

    response = await review_client.post(
        "/api/review/answer",
        json={"card_id": str(card.id), "rating": "perfect"},
    )
    assert response.status_code == 422
