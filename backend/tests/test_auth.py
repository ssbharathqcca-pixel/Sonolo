"""Integration tests for registration, login, and the protected profile."""

from collections.abc import AsyncIterator
from datetime import timedelta

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

import app.models  # noqa: F401  — registers all tables on Base.metadata
from app.core.config import Settings
from app.core.security import create_access_token
from app.db.session import get_db
from app.main import create_app
from app.models.user import User, UserSkill

pytestmark = pytest.mark.asyncio

REGISTER_BODY = {
    "email": "pavan@example.com",
    "name": "Pavan",
    "password": "maple-syrup-99",
    "native_language": "hi",
    "target_language": "en-CA",
}


@pytest_asyncio.fixture
async def auth_client(
    db_engine, db_session: AsyncSession
) -> AsyncIterator[AsyncClient]:
    """HTTP client with the DB session dependency overridden."""
    app = create_app(Settings(_env_file=None))

    async def override_session() -> AsyncIterator[AsyncSession]:
        yield db_session

    app.dependency_overrides[get_db] = override_session
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        yield client


async def register_and_login(
    auth_client: AsyncClient,
) -> str:
    """Register the default user and return an access token."""
    register_response = await auth_client.post(
        "/api/auth/register", json=REGISTER_BODY
    )
    assert register_response.status_code == 201
    login_response = await auth_client.post(
        "/api/auth/login",
        json={
            "email": REGISTER_BODY["email"],
            "password": REGISTER_BODY["password"],
        },
    )
    assert login_response.status_code == 200
    return login_response.json()["access_token"]


async def test_register_returns_profile_without_password(
    auth_client: AsyncClient,
) -> None:
    response = await auth_client.post(
        "/api/auth/register", json=REGISTER_BODY
    )

    assert response.status_code == 201
    body = response.json()
    assert body["email"] == "pavan@example.com"
    assert body["name"] == "Pavan"
    assert body["learning_goal"] == "casual"
    assert body["current_level"] == "seed"
    assert body["subscription_tier"] == "free"
    assert "password" not in body
    assert "hashed_password" not in body


async def test_register_rejects_duplicate_email(
    auth_client: AsyncClient,
) -> None:
    first = await auth_client.post("/api/auth/register", json=REGISTER_BODY)
    assert first.status_code == 201

    duplicate = await auth_client.post("/api/auth/register", json=REGISTER_BODY)
    assert duplicate.status_code == 400
    assert "already exists" in duplicate.json()["detail"]


async def test_register_rejects_invalid_email_and_short_password(
    auth_client: AsyncClient,
) -> None:
    bad_email = await auth_client.post(
        "/api/auth/register",
        json={**REGISTER_BODY, "email": "not-an-email"},
    )
    assert bad_email.status_code == 422

    short_password = await auth_client.post(
        "/api/auth/register",
        json={**REGISTER_BODY, "password": "short"},
    )
    assert short_password.status_code == 422


async def test_login_returns_bearer_token(
    auth_client: AsyncClient,
) -> None:
    await auth_client.post("/api/auth/register", json=REGISTER_BODY)

    response = await auth_client.post(
        "/api/auth/login",
        json={
            "email": "pavan@example.com",
            "password": "maple-syrup-99",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert len(body["access_token"]) > 20


async def test_login_rejects_wrong_password_and_unknown_email(
    auth_client: AsyncClient,
) -> None:
    await auth_client.post("/api/auth/register", json=REGISTER_BODY)

    wrong_password = await auth_client.post(
        "/api/auth/login",
        json={"email": "pavan@example.com", "password": "wrong-pass-1"},
    )
    assert wrong_password.status_code == 401

    unknown_email = await auth_client.post(
        "/api/auth/login",
        json={"email": "ghost@example.com", "password": "maple-syrup-99"},
    )
    assert unknown_email.status_code == 401


async def test_me_returns_profile_with_token(
    auth_client: AsyncClient,
) -> None:
    token = await register_and_login(auth_client)

    response = await auth_client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["email"] == "pavan@example.com"
    assert body["skills"] is None
    assert "password" not in body
    assert "hashed_password" not in body


async def test_me_includes_skill_scores(
    auth_client: AsyncClient, db_session: AsyncSession
) -> None:
    token = await register_and_login(auth_client)

    user = (
        await db_session.execute(
            select(User).where(User.email == REGISTER_BODY["email"])
        )
    ).scalar_one()
    skill = UserSkill(user=user, canada_ready_score=62.0)
    db_session.add(skill)
    await db_session.commit()

    response = await auth_client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    skills = response.json()["skills"]
    assert skills is not None
    assert skills["canada_ready_score"] == 62.0
    assert skills["composite_score"] == 0.0


async def test_me_without_token_returns_401(
    auth_client: AsyncClient,
) -> None:
    response = await auth_client.get("/api/users/me")
    assert response.status_code == 401


async def test_me_with_garbage_token_returns_401(
    auth_client: AsyncClient,
) -> None:
    response = await auth_client.get(
        "/api/users/me",
        headers={"Authorization": "Bearer not-a-real-token"},
    )
    assert response.status_code == 401


async def test_me_with_expired_token_returns_401(
    auth_client: AsyncClient,
) -> None:
    token = await register_and_login(auth_client)
    expired = create_access_token(
        {"sub": "00000000-0000-4000-8000-000000000001"},
        expires_delta=timedelta(minutes=-1),
    )

    for bad_token in (expired, f"{token}tampered"):
        response = await auth_client.get(
            "/api/users/me",
            headers={"Authorization": f"Bearer {bad_token}"},
        )
        assert response.status_code == 401
