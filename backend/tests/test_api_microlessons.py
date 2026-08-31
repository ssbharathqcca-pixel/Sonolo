"""Culture Corner micro-lessons API tests (SN-047).

Covers the new content format end to end: the catalog endpoint returns
every lesson summary, the detail endpoint returns the full schema, an
unknown id is a 404, and the "microlessons" manifest type is excluded
from the scenario seeding, /api/scenarios, and /api/packs pipelines.
"""

from collections.abc import AsyncIterator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

import app.models  # noqa: F401  — registers all tables on Base.metadata
from app.core.config import Settings
from app.db.session import get_db
from app.main import create_app
from app.services.content_service import (
    load_microlesson_seeds,
    load_scenario_seeds,
    seed_scenarios,
)

pytestmark = pytest.mark.asyncio

SUMMARY_KEYS = {"id", "title", "hook", "read_minutes", "pack_id", "theme_color", "icon"}
DETAIL_KEYS = SUMMARY_KEYS | {"sections", "takeaway", "try_it"}


@pytest_asyncio.fixture
async def microlessons_client(
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
            "email": "culture@example.com",
            "name": "Culture",
            "password": "maple-syrup-99",
            "native_language": "hi",
            "target_language": "en-CA",
        },
    )
    assert register.status_code == 201
    login = await client.post(
        "/api/auth/login",
        json={"email": "culture@example.com", "password": "maple-syrup-99"},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


async def test_microlessons_requires_authentication(
    microlessons_client: AsyncClient,
) -> None:
    response = await microlessons_client.get("/api/microlessons")
    assert response.status_code == 401


async def test_microlessons_list_returns_all_twelve_summaries(
    microlessons_client: AsyncClient,
) -> None:
    response = await microlessons_client.get(
        "/api/microlessons", headers=await auth_headers(microlessons_client)
    )

    assert response.status_code == 200
    body = response.json()
    lessons = body["microlessons"]
    assert len(lessons) == 12
    for lesson in lessons:
        assert set(lesson.keys()) == SUMMARY_KEYS
        assert lesson["read_minutes"] == 1
        assert lesson["pack_id"] == "culture-english-v1"
        assert lesson["theme_color"]
        assert lesson["icon"] == "🍁"
    assert len({lesson["id"] for lesson in lessons}) == 12


async def test_microlesson_detail_returns_full_schema(
    microlessons_client: AsyncClient,
) -> None:
    headers = await auth_headers(microlessons_client)
    summary = (
        await microlessons_client.get("/api/microlessons", headers=headers)
    ).json()["microlessons"][0]

    response = await microlessons_client.get(
        f"/api/microlessons/{summary['id']}", headers=headers
    )

    assert response.status_code == 200
    lesson = response.json()
    assert set(lesson.keys()) == DETAIL_KEYS
    assert lesson["id"] == summary["id"]
    assert isinstance(lesson["sections"], list)
    assert 2 <= len(lesson["sections"]) <= 3
    for section in lesson["sections"]:
        assert set(section.keys()) == {"heading", "text"}
        assert section["heading"]
        assert section["text"]
    assert lesson["takeaway"]
    assert lesson["try_it"]


async def test_microlesson_detail_404_for_unknown_id(
    microlessons_client: AsyncClient,
) -> None:
    response = await microlessons_client.get(
        "/api/microlessons/micro-does-not-exist",
        headers=await auth_headers(microlessons_client),
    )
    assert response.status_code == 404


async def test_microlessons_excluded_from_scenario_seeds(
    db_session: AsyncSession,
) -> None:
    """The new format never enters scenario seeding (SN-047)."""
    seeds = load_scenario_seeds()
    micro_ids = {lesson.id for lesson in load_microlesson_seeds()}
    assert seeds  # The catalog is loaded.
    assert micro_ids.isdisjoint(seed.id for seed in seeds)
    assert all(seed.pack_id != "culture-english-v1" for seed in seeds)


async def test_microlessons_excluded_from_packs_and_scenarios_api(
    microlessons_client: AsyncClient,
    db_session: AsyncSession,
) -> None:
    await seed_scenarios(db_session)
    headers = await auth_headers(microlessons_client)

    packs = await microlessons_client.get("/api/packs")
    assert packs.status_code == 200
    pack_ids = {pack["id"] for pack in packs.json()["packs"]}
    assert "culture-english-v1" not in pack_ids
    assert all(pack["type"] == "scenarios" for pack in packs.json()["packs"])

    scenarios = await microlessons_client.get("/api/scenarios", headers=headers)
    assert scenarios.status_code == 200
    scenario_pack_ids = {
        scenario["pack_id"] for scenario in scenarios.json()["scenarios"]
    }
    assert "culture-english-v1" not in scenario_pack_ids
