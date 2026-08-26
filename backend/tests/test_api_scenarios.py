"""Integration tests for the scenario catalog endpoint (SN-015, SN-026)."""

from collections.abc import AsyncIterator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select, update as sa_update
from sqlalchemy.ext.asyncio import AsyncSession

import app.models  # noqa: F401
from app.core.config import Settings
from app.db.session import get_db
from app.main import create_app
from app.models.scenario import Scenario
from app.services.content_service import seed_scenarios

pytestmark = pytest.mark.asyncio


@pytest_asyncio.fixture
async def scenarios_client(
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


async def auth_headers(client: AsyncClient) -> dict[str, str]:
    register = await client.post(
        "/api/auth/register",
        json={
            "email": "pavan@example.com",
            "name": "Pavan",
            "password": "maple-syrup-99",
            "native_language": "hi",
            "target_language": "en-CA",
        },
    )
    assert register.status_code == 201
    login = await client.post(
        "/api/auth/login",
        json={"email": "pavan@example.com", "password": "maple-syrup-99"},
    )
    assert login.status_code == 200
    return {"Authorization": f"Bearer {login.json()['access_token']}"}


async def test_scenarios_requires_authentication(
    scenarios_client: AsyncClient,
) -> None:
    response = await scenarios_client.get("/api/scenarios")
    assert response.status_code == 401


async def test_scenarios_returns_the_seeded_catalog(
    scenarios_client: AsyncClient, db_session: AsyncSession
) -> None:
    seeded = await seed_scenarios(db_session)
    assert seeded == 55

    response = await scenarios_client.get(
        "/api/scenarios", headers=await auth_headers(scenarios_client)
    )

    assert response.status_code == 200
    body = response.json()
    assert len(body["scenarios"]) == 50
    titles = [scenario["title"] for scenario in body["scenarios"]]
    assert titles == sorted(titles)  # Stable, title-ordered list.
    first = body["scenarios"][0]
    assert set(first.keys()) == {
        "id",
        "title",
        "description",
        "category",
        "target_language",
        "difficulty",
        "is_locked",
    }
    assert isinstance(first["id"], str)
    assert first["difficulty"] is None or 1 <= first["difficulty"] <= 5


async def test_free_user_sees_premium_scenarios_locked(
    scenarios_client: AsyncClient, db_session: AsyncSession
) -> None:
    await seed_scenarios(db_session)
    response = await scenarios_client.get(
        "/api/scenarios", headers=await auth_headers(scenarios_client)
    )

    assert response.status_code == 200
    scenarios = response.json()["scenarios"]
    locked_titles = {
        scenario["title"] for scenario in scenarios if scenario["is_locked"]
    }
    premium_titles = set(
        (
            await db_session.execute(
                select(Scenario.title).where(Scenario.is_premium.is_(True))
            )
        ).scalars().all()
    )
    # Premium scenarios are exactly the locked entries for a free-tier
    # caller — 8 from canadian-life-v1 plus the 5 from canadian-life-v2.
    assert len(premium_titles) == 16
    assert locked_titles == premium_titles


async def test_premium_user_sees_nothing_locked(
    scenarios_client: AsyncClient, db_session: AsyncSession
) -> None:
    await seed_scenarios(db_session)
    headers = await auth_headers(scenarios_client)
    upgrade = await scenarios_client.post("/api/users/me/upgrade", headers=headers)
    assert upgrade.status_code == 200

    response = await scenarios_client.get("/api/scenarios", headers=headers)

    assert response.status_code == 200
    scenarios = response.json()["scenarios"]
    assert len(scenarios) == 50
    assert all(scenario["is_locked"] is False for scenario in scenarios)


async def test_language_param_returns_only_french_scenarios(
    scenarios_client: AsyncClient, db_session: AsyncSession
) -> None:
    await seed_scenarios(db_session)
    headers = await auth_headers(scenarios_client)

    response = await scenarios_client.get(
        "/api/scenarios",
        params={"language": "fr"},
        headers=headers,
    )

    assert response.status_code == 200
    scenarios = response.json()["scenarios"]
    french_titles = set(
        (
            await db_session.execute(
                select(Scenario.title).where(
                    Scenario.target_language == "fr"
                )
            )
        ).scalars().all()
    )
    assert len(french_titles) == 5
    assert {scenario["title"] for scenario in scenarios} == french_titles


async def test_default_catalog_follows_preferred_language(
    scenarios_client: AsyncClient, db_session: AsyncSession
) -> None:
    await seed_scenarios(db_session)
    headers = await auth_headers(scenarios_client)

    english = await scenarios_client.get("/api/scenarios", headers=headers)
    assert english.status_code == 200
    # Default preference is English: the 40 en-CA packs, no French rows.
    assert len(english.json()["scenarios"]) == 50

    switched = await scenarios_client.post(
        "/api/users/me/language", json={"language": "fr"}, headers=headers
    )
    assert switched.status_code == 200

    french = await scenarios_client.get("/api/scenarios", headers=headers)
    assert french.status_code == 200
    titles = [scenario["title"] for scenario in french.json()["scenarios"]]
    french_titles = set(
        (
            await db_session.execute(
                select(Scenario.title).where(Scenario.target_language == "fr")
            )
        ).scalars().all()
    )
    assert set(titles) == french_titles

    back = await scenarios_client.post(
        "/api/users/me/language", json={"language": "en"}, headers=headers
    )
    assert back.status_code == 200
    restored = await scenarios_client.get("/api/scenarios", headers=headers)
    assert len(restored.json()["scenarios"]) == 50


async def test_language_rejects_unknown_values(
    scenarios_client: AsyncClient,
) -> None:
    headers = await auth_headers(scenarios_client)
    response = await scenarios_client.get(
        "/api/scenarios", params={"language": "es"}, headers=headers
    )
    assert response.status_code == 422


async def test_premium_gating_still_applies_to_french_scenarios(
    scenarios_client: AsyncClient, db_session: AsyncSession
) -> None:
    await seed_scenarios(db_session)
    # A future premium French pack must gate exactly like English ones.
    premium_french_title = (
        await db_session.execute(
            select(Scenario.title).where(Scenario.target_language == "fr")
        )
    ).scalars().first()
    await db_session.execute(
        sa_update(Scenario)
        .where(Scenario.title == premium_french_title)
        .values(is_premium=True)
    )
    await db_session.commit()
    headers = await auth_headers(scenarios_client)

    free_view = await scenarios_client.get(
        "/api/scenarios", params={"language": "fr"}, headers=headers
    )
    assert free_view.status_code == 200
    locked = {
        scenario["title"]
        for scenario in free_view.json()["scenarios"]
        if scenario["is_locked"]
    }
    assert locked == {premium_french_title}

    upgrade = await scenarios_client.post(
        "/api/users/me/upgrade", headers=headers
    )
    assert upgrade.status_code == 200
    premium_view = await scenarios_client.get(
        "/api/scenarios", params={"language": "fr"}, headers=headers
    )
    assert all(
        scenario["is_locked"] is False
        for scenario in premium_view.json()["scenarios"]
    )
