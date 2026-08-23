"""Integration tests for the scenario catalog endpoint (SN-015)."""

from collections.abc import AsyncIterator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

import app.models  # noqa: F401
from app.core.config import Settings
from app.db.session import get_db
from app.main import create_app
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
    assert seeded == 40

    response = await scenarios_client.get(
        "/api/scenarios", headers=await auth_headers(scenarios_client)
    )

    assert response.status_code == 200
    body = response.json()
    assert len(body["scenarios"]) == 40
    titles = [scenario["title"] for scenario in body["scenarios"]]
    assert titles == sorted(titles)  # Stable, title-ordered list.
    first = body["scenarios"][0]
    assert set(first.keys()) == {"id", "title", "description", "category", "difficulty"}
    assert isinstance(first["id"], str)
    assert first["difficulty"] is None or 1 <= first["difficulty"] <= 5
