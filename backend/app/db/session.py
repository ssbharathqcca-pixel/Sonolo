"""Async engine and session factory bound to the configured database URL."""

from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import get_settings

engine = create_async_engine(get_settings().database_url, pool_pre_ping=True)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncIterator[AsyncSession]:
    """Yield an async database session (FastAPI dependency style)."""
    async with AsyncSessionLocal() as session:
        yield session


def dialect_name(session: AsyncSession) -> str:
    """Dialect the session is bound to ('postgresql', 'sqlite', ...)."""
    bind = session.bind
    return bind.dialect.name if bind is not None else ""
