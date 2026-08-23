"""Seed the SN-008 scenario pack into the configured database.

Usage (from backend/, with DATABASE_URL pointing at the target DB):

    .venv/Scripts/python -m scripts.seed_content

Idempotent: deterministic scenario ids mean re-runs update the same
rows instead of duplicating them. The SN-009 vocabulary pack is NOT
seeded here — vocabulary cards are user-scoped and materialized
lazily per user by /api/review/due (see app/services/content_service.py).
"""

import asyncio
import sys

from sqlalchemy import func, select

from app.db.session import AsyncSessionLocal
from app.models.scenario import Scenario
from app.services.content_service import seed_scenarios


async def main() -> int:
    async with AsyncSessionLocal() as session:
        before = int(
            (
                await session.execute(
                    select(func.count()).select_from(Scenario)
                )
            ).scalar_one()
        )
        seeded = await seed_scenarios(session)
        after = int(
            (
                await session.execute(
                    select(func.count()).select_from(Scenario)
                )
            ).scalar_one()
        )
    print(f"scenarios_before={before}")
    print(f"pack_upserts={seeded}")
    print(f"scenarios_after={after}")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
