"""Integration tests for user profile endpoints (SN-026 upgrade)."""

from collections.abc import AsyncIterator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

import app.models  # noqa: F401
from app.core.config import Settings
from app.db.session import get_db
from app.main import create_app

pytestmark = pytest.mark.asyncio


@pytest_asyncio.fixture
async def users_client(
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


async def test_upgrade_requires_authentication(users_client: AsyncClient) -> None:
    response = await users_client.post("/api/users/me/upgrade")
    assert response.status_code == 401


async def test_new_users_start_on_the_free_tier(
    users_client: AsyncClient,
) -> None:
    response = await users_client.get(
        "/api/users/me", headers=await auth_headers(users_client)
    )

    assert response.status_code == 200
    assert response.json()["subscription_tier"] == "free"


async def test_upgrade_flips_tier_and_persists(users_client: AsyncClient) -> None:
    headers = await auth_headers(users_client)

    upgraded = await users_client.post("/api/users/me/upgrade", headers=headers)

    assert upgraded.status_code == 200
    body = upgraded.json()
    assert body["subscription_tier"] == "premium"
    # The mock upgrade returns the full profile payload.
    assert body["name"] == "Pavan"
    assert "skills" in body

    reread = await users_client.get("/api/users/me", headers=headers)
    assert reread.status_code == 200
    assert reread.json()["subscription_tier"] == "premium"


async def test_upgrade_is_idempotent(users_client: AsyncClient) -> None:
    headers = await auth_headers(users_client)
    first = await users_client.post("/api/users/me/upgrade", headers=headers)
    second = await users_client.post("/api/users/me/upgrade", headers=headers)

    assert first.status_code == 200
    assert second.status_code == 200
    assert second.json()["subscription_tier"] == "premium"
