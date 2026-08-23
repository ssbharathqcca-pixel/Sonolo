"""Verify a live database schema against the SQLAlchemy models.

Runs after `alembic upgrade head` and fails loudly on any missing
table or column. Requires a reachable PostgreSQL at DATABASE_URL.

Usage (from backend/):

    .venv/Scripts/python -m scripts.verify_schema
"""

import asyncio
import sys

from sqlalchemy import inspect
from sqlalchemy.ext.asyncio import AsyncEngine

import app.models  # noqa: F401  — registers all tables on Base.metadata
from app.core.config import get_settings
from app.db.base import Base
from app.db.session import engine


def _collect_problems(sync_engine: object) -> list[str]:
    """Compare the live schema (sync context) against the models."""
    inspector = inspect(sync_engine)  # type: ignore[arg-type]
    problems: list[str] = []

    live_tables = set(inspector.get_table_names()) - {"alembic_version"}
    model_tables = set(Base.metadata.tables.keys())
    for table in sorted(model_tables - live_tables):
        problems.append(f"missing table: {table}")
    for table in sorted(live_tables - model_tables):
        problems.append(f"unexpected table: {table}")

    for table in sorted(model_tables & live_tables):
        live_columns = {
            column["name"] for column in inspector.get_columns(table)
        }
        model_columns = set(Base.metadata.tables[table].columns.keys())
        for column in sorted(model_columns - live_columns):
            problems.append(f"missing column: {table}.{column}")
        for column in sorted(live_columns - model_columns):
            problems.append(f"unexpected column: {table}.{column}")
    return problems


async def check(async_engine: AsyncEngine) -> list[str]:
    """Run schema inspection inside a connection's greenlet context."""
    async with async_engine.connect() as connection:
        return await connection.run_sync(_collect_problems)


async def main() -> int:
    settings = get_settings()
    problems = await check(engine)
    print(f"database={settings.database_url.split('@')[-1]}")
    if problems:
        for problem in problems:
            print(f"DRIFT: {problem}")
        await engine.dispose()
        return 1
    print(
        "schema_ok: "
        f"{len(Base.metadata.tables)} tables match the SQLAlchemy models."
    )
    await engine.dispose()
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
