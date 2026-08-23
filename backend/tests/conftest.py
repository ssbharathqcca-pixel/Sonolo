"""Shared pytest fixtures for the backend test suite."""

from collections.abc import AsyncIterator, Iterator

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401  — registers all tables on Base.metadata
from app.core.config import Settings
from app.db.base import Base
from app.main import create_app


@pytest.fixture
def test_settings() -> Settings:
    """Deterministic settings that ignore any local `.env` file."""
    return Settings(_env_file=None)


@pytest.fixture
def client(test_settings: Settings) -> Iterator[TestClient]:
    """HTTP client bound to an app built from `test_settings`."""
    with TestClient(create_app(settings=test_settings)) as test_client:
        yield test_client


@pytest_asyncio.fixture
async def db_engine() -> AsyncIterator[AsyncEngine]:
    """Ephemeral async engine over in-memory SQLite with the full schema."""
    engine = create_async_engine(
        "sqlite+aiosqlite://",
        poolclass=StaticPool,
    )
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(db_engine: AsyncEngine) -> AsyncIterator[AsyncSession]:
    """Session bound to the ephemeral test engine."""
    factory = async_sessionmaker(db_engine, expire_on_commit=False)
    async with factory() as session:
        yield session
