"""CanadaReady™ Scorecard API tests (SN-048).

Covers the JSON view (6 bands + disclaimer, null-safe first-steps shape
for a fresh user), the premium-gated PDF export (403 free / 200 premium
with a %PDF body), and the badge tier boundaries.
"""

from collections.abc import AsyncIterator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

import app.models  # noqa: F401  — registers all tables on Base.metadata
from app.core.config import Settings
from app.db.session import get_db
from app.main import create_app
from app.models.user import User, UserSkill
from app.schemas.scorecard import DISCLAIMER, BAND_DEFINITIONS, badge_for

pytestmark = pytest.mark.asyncio


@pytest_asyncio.fixture
async def scorecard_client(
    db_engine, db_session: AsyncSession
) -> AsyncIterator[AsyncClient]:
    app = create_app(Settings(_env_file=None))

    async def override_session() -> AsyncIterator[AsyncSession]:
        yield db_session

    app.dependency_overrides[get_db] = override_session
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        yield client


async def auth_headers(client: AsyncClient, email: str) -> dict[str, str]:
    register = await client.post(
        "/api/auth/register",
        json={
            "email": email,
            "name": "Scorecard",
            "password": "maple-syrup-99",
            "native_language": "hi",
            "target_language": "en-CA",
        },
    )
    assert register.status_code == 201
    login = await client.post(
        "/api/auth/login",
        json={"email": email, "password": "maple-syrup-99"},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def attach_skills(
    db_session: AsyncSession,
    user: User,
    *,
    canada_ready: float = 64.0,
    fluency: float = 62.0,
    pronunciation: float = 71.0,
    grammar: float = 55.0,
    vocabulary: float = 68.0,
    coherence: float = 60.0,
    task_completion: float = 74.0,
) -> UserSkill:
    skills = UserSkill(
        user_id=user.id,
        fluency_score=fluency,
        pronunciation_score=pronunciation,
        grammar_score=grammar,
        vocabulary_score=vocabulary,
        coherence_score=coherence,
        task_completion_score=task_completion,
        composite_score=65.0,
        canada_ready_score=canada_ready,
        confidence_score=66.0,
    )
    db_session.add(skills)
    # The session's identity map may have loaded the user before the
    # skills row existed; wire the relationship both ways so the
    # cached instance sees the new row (lazy="selectin" caches None).
    user.skills = skills
    db_session.flush()
    return skills


async def test_scorecard_requires_authentication(
    scorecard_client: AsyncClient,
) -> None:
    response = await scorecard_client.get("/api/users/me/scorecard")
    assert response.status_code == 401


async def test_scorecard_returns_six_bands_and_disclaimer(
    scorecard_client: AsyncClient,
    db_session: AsyncSession,
) -> None:
    headers = await auth_headers(scorecard_client, "bands@example.com")
    user = (
        await db_session.execute(
            select(User).where(User.email == "bands@example.com")
        )
    ).scalar_one()
    attach_skills(db_session, user)
    await db_session.commit()

    response = await scorecard_client.get(
        "/api/users/me/scorecard", headers=headers
    )

    assert response.status_code == 200
    body = response.json()
    assert body["badge"]["title"] == "Confident Colleague"
    assert body["canada_ready_score"] == 64
    assert len(body["bands"]) == 6
    assert [band["code"] for band in body["bands"]] == [
        code for code, _ in BAND_DEFINITIONS
    ]
    for band, (code, label) in zip(body["bands"], BAND_DEFINITIONS):
        assert band["label"] == label
        assert 0 <= band["score"] <= 100
        assert band["clb_hint"].startswith("CLB-inspired")
    assert body["stats"]["sessions_completed"] == 0
    assert body["stats"]["speaking_minutes"] == 0
    assert body["disclaimer"] == DISCLAIMER


async def test_scorecard_null_safe_first_steps_shape(
    scorecard_client: AsyncClient,
) -> None:
    headers = await auth_headers(scorecard_client, "fresh@example.com")

    response = await scorecard_client.get(
        "/api/users/me/scorecard", headers=headers
    )

    assert response.status_code == 200
    body = response.json()
    assert body["badge"]["code"] == "first-steps"
    assert body["badge"]["title"] == "First Steps"
    assert body["canada_ready_score"] == 0
    assert all(band["score"] == 0 for band in body["bands"])
    assert body["stats"] == {
        "sessions_completed": 0,
        "speaking_minutes": 0,
        "streak_current": 0,
        "total_xp": 0,
    }
    assert body["disclaimer"] == DISCLAIMER


async def test_scorecard_pdf_403_for_free_tier(
    scorecard_client: AsyncClient,
) -> None:
    headers = await auth_headers(scorecard_client, "free@example.com")

    response = await scorecard_client.get(
        "/api/users/me/scorecard/pdf", headers=headers
    )

    assert response.status_code == 403


async def test_scorecard_pdf_200_for_premium_with_pdf_body(
    scorecard_client: AsyncClient,
    db_session: AsyncSession,
) -> None:
    headers = await auth_headers(scorecard_client, "premium@example.com")
    user = (
        await db_session.execute(
            select(User).where(User.email == "premium@example.com")
        )
    ).scalar_one()
    attach_skills(db_session, user)
    await db_session.commit()

    upgrade = await scorecard_client.post("/api/users/me/upgrade", headers=headers)
    assert upgrade.status_code == 200

    response = await scorecard_client.get(
        "/api/users/me/scorecard/pdf", headers=headers
    )

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("application/pdf")
    assert response.content.startswith(b"%PDF")


def test_badge_tier_boundaries() -> None:
    assert badge_for(0).title == "Finding Your Feet"
    assert badge_for(39).title == "Finding Your Feet"
    assert badge_for(40).title == "Confident Colleague"
    assert badge_for(69).title == "Confident Colleague"
    assert badge_for(70).title == "CanadaReady™"
    assert badge_for(100).title == "CanadaReady™"
