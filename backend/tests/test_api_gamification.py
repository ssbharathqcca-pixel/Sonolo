"""Integration tests for SN-014 endpoints: /sessions/complete, /quests/today,
/gamification/me — including idempotency, validation, streaks, and auth."""

import asyncio
import uuid
from collections.abc import AsyncIterator
from datetime import UTC, date, datetime, timedelta

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

import app.models  # noqa: F401
from app.core.config import Settings
from app.db.base import Base
from app.db.session import get_db
from app.main import create_app
from app.models.gamification import DailyQuest
from app.models.scenario import Scenario
from app.models.session import SpeakingSession
from app.models.user import User, UserSkill

pytestmark = pytest.mark.asyncio

FIXED_NOW = datetime(2026, 8, 22, 20, 0, tzinfo=UTC)  # Toronto date 2026-08-22
NEXT_DAY = FIXED_NOW + timedelta(days=1)


@pytest_asyncio.fixture
async def db_engine(tmp_path):
    """File-backed engine so concurrent requests get separate sessions."""
    engine = create_async_engine(
        f"sqlite+aiosqlite:///{tmp_path.as_posix()}/sn014.db"
    )
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(db_engine) -> AsyncIterator[AsyncSession]:
    factory = async_sessionmaker(db_engine, expire_on_commit=False)
    session = factory()
    yield session
    await session.close()


@pytest_asyncio.fixture
async def api_client(
    db_engine, db_session: AsyncSession, monkeypatch: pytest.MonkeyPatch
) -> AsyncIterator[AsyncClient]:
    app = create_app(Settings(_env_file=None))
    clock = {"now": FIXED_NOW}
    request_factory = async_sessionmaker(db_engine, expire_on_commit=False)

    async def override_session() -> AsyncIterator[AsyncSession]:
        # One fresh session per request, like production.
        async with request_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_session
    for module in ("app.api.sessions", "app.api.quests"):
        monkeypatch.setattr(module + ".utc_now", lambda: clock["now"])
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        client.clock = clock  # type: ignore[attr-defined]
        yield client


async def register_and_login(
    api_client: AsyncClient, email: str = "pavan@example.com"
) -> dict[str, str]:
    await api_client.post(
        "/api/auth/register",
        json={
            "email": email,
            "name": "Pavan",
            "password": "maple-syrup-99",
            "native_language": "hi",
            "target_language": "en-CA",
        },
    )
    login = await api_client.post(
        "/api/auth/login",
        json={"email": email, "password": "maple-syrup-99"},
    )
    token = login.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


async def seed_scenario(db_session: AsyncSession, difficulty: int = 3) -> Scenario:
    scenario = Scenario(
        title="Order at the coffee shop",
        category="shopping",
        mode="casual",
        level="seed",
        difficulty=difficulty,
        expected_turns=6,
    )
    db_session.add(scenario)
    await db_session.commit()
    return scenario


def make_payload(
    scenario_id: str,
    client_session_id: str | None = None,
    *,
    duration: int = 300,
    overall: float = 82.0,
    with_user_turn: bool = True,
) -> dict:
    started = FIXED_NOW - timedelta(seconds=duration)
    transcript = []
    if with_user_turn:
        transcript.append({"role": "user", "text": "Could I get a medium double-double?"})
    transcript.append({"role": "assistant", "text": "Great choice!"})
    return {
        "client_session_id": client_session_id or str(uuid.uuid4()),
        "scenario_id": scenario_id,
        "started_at": started.isoformat(),
        "ended_at": FIXED_NOW.isoformat(),
        "duration_seconds": duration,
        "transcript": transcript,
        "evaluation": {
            "scores": {
                "fluency": overall,
                "pronunciation": overall,
                "grammar": overall,
                "vocabulary": overall,
                "coherence": overall,
                "task_completion": overall,
            },
            "overall_score": overall,
            "insights": [],
        },
    }


async def complete(
    api_client: AsyncClient, headers: dict[str, str], payload: dict
):
    return await api_client.post(
        "/api/sessions/complete", json=payload, headers=headers
    )


async def current_user(db_session: AsyncSession, email: str) -> User:
    db_session.expire_all()  # Drop cached rows mutated by requests.
    return (
        await db_session.execute(select(User).where(User.email == email))
    ).scalar_one()


async def test_complete_session_persists_and_responds(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)
    scenario = await seed_scenario(db_session)

    response = await complete(
        api_client, headers, make_payload(str(scenario.id))
    )

    assert response.status_code == 200
    body = response.json()
    assert body["idempotent_replayed"] is False
    assert body["xp_eligible"] is True
    assert body["xp"]["session_xp"] == 48  # 20 + 5 + 8 + 15 (difficulty 3)
    stored = (
        await db_session.execute(select(SpeakingSession))
    ).scalar_one()
    assert stored.client_session_id is not None
    assert stored.overall_score == 82.0


async def test_complete_creates_user_skills_and_xp(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)
    scenario = await seed_scenario(db_session)

    await complete(api_client, headers, make_payload(str(scenario.id)))

    skill = (
        await db_session.execute(select(UserSkill))
    ).scalar_one()
    assert skill.fluency_score == pytest.approx(82.0)
    user = await current_user(db_session, "pavan@example.com")
    assert user.total_xp == 68  # 48 session XP + 20 quest XP (session_1)
    assert user.xp_today == 68


async def test_complete_generates_and_progresses_quests(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)
    scenario = await seed_scenario(db_session)

    body = (await complete(api_client, headers, make_payload(str(scenario.id)))).json()
    quests = {q["code"]: q for q in body["quests"]}
    assert set(quests) == {"session_1", "session_2", "vocab_10"}
    assert quests["session_1"]["completed"] is True
    assert quests["session_2"]["completed"] is False
    assert quests["session_2"]["progress_count"] == 1
    assert body["xp"]["quest_xp"] == 20

    rows = (
        await db_session.execute(select(DailyQuest))
    ).scalars().all()
    assert len(rows) == 3


async def test_complete_returns_first_session_badge(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)
    scenario = await seed_scenario(db_session)

    body = (await complete(api_client, headers, make_payload(str(scenario.id)))).json()
    assert [b["code"] for b in body["newly_awarded_badges"]] == ["first_session"]


async def test_duplicate_completion_replays_without_mutation(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)
    scenario = await seed_scenario(db_session)
    payload = make_payload(str(scenario.id))

    first = await complete(api_client, headers, payload)
    second = await complete(api_client, headers, payload)

    assert second.status_code == 200
    assert second.json()["idempotent_replayed"] is True
    user = await current_user(db_session, "pavan@example.com")
    assert user.total_xp == first.json()["xp"]["xp_total"]
    sessions = (
        await db_session.execute(select(SpeakingSession))
    ).scalars().all()
    assert len(sessions) == 1


async def test_duplicate_completion_conflicting_scenario_returns_409(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)
    first_scenario = await seed_scenario(db_session, difficulty=2)
    second_scenario = await seed_scenario(db_session, difficulty=4)
    payload = make_payload(str(first_scenario.id))

    await complete(api_client, headers, payload)
    conflicting = make_payload(str(second_scenario.id))
    conflicting["client_session_id"] = payload["client_session_id"]

    response = await complete(api_client, headers, conflicting)
    assert response.status_code == 409


async def test_quests_today_generates_lazily(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)

    first = await api_client.get("/api/quests/today", headers=headers)
    second = await api_client.get("/api/quests/today", headers=headers)

    assert first.status_code == 200
    body = second.json()
    assert body["quest_date"] == date(2026, 8, 22).isoformat()
    assert body["timezone"] == "America/Toronto"
    assert len(body["quests"]) == 3
    rows = (
        await db_session.execute(select(DailyQuest))
    ).scalars().all()
    assert len(rows) == 3  # Second call reused, did not duplicate.


async def test_gamification_me_summary(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)
    scenario = await seed_scenario(db_session)
    await complete(api_client, headers, make_payload(str(scenario.id)))

    response = await api_client.get("/api/gamification/me", headers=headers)

    assert response.status_code == 200
    body = response.json()
    assert body["xp_total"] == 68  # 48 session + 20 quest
    assert body["level"] == 1
    assert body["progress_to_next_level"] == 68
    assert body["current_streak"] == 1
    assert [b["code"] for b in body["badges"]] == ["first_session"]


async def test_unauthenticated_requests_return_401(api_client: AsyncClient) -> None:
    response = await api_client.post(
        "/api/sessions/complete", json=make_payload(str(uuid.uuid4()))
    )
    assert response.status_code == 401
    assert (await api_client.get("/api/quests/today")).status_code == 401
    assert (await api_client.get("/api/gamification/me")).status_code == 401


async def test_invalid_evaluation_score_returns_422(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)
    scenario = await seed_scenario(db_session)
    payload = make_payload(str(scenario.id))
    payload["evaluation"]["scores"]["fluency"] = 150.0

    response = await complete(api_client, headers, payload)
    assert response.status_code == 422


async def test_ended_before_started_returns_422(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)
    scenario = await seed_scenario(db_session)
    payload = make_payload(str(scenario.id))
    payload["started_at"] = FIXED_NOW.isoformat()
    payload["ended_at"] = (FIXED_NOW - timedelta(seconds=10)).isoformat()

    response = await complete(api_client, headers, payload)
    assert response.status_code == 422


async def test_duration_mismatch_returns_422(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)
    scenario = await seed_scenario(db_session)
    payload = make_payload(str(scenario.id), duration=300)
    payload["duration_seconds"] = 900  # 600s off from the timestamps.

    response = await complete(api_client, headers, payload)
    assert response.status_code == 422


async def test_short_session_is_ineligible_for_xp(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)
    scenario = await seed_scenario(db_session)

    body = (
        await complete(
            api_client, headers, make_payload(str(scenario.id), duration=10)
        )
    ).json()

    assert body["xp_eligible"] is False
    assert body["xp"]["total_xp"] == 0
    user = await current_user(db_session, "pavan@example.com")
    assert user.total_xp == 0
    assert user.streak_count == 0


async def test_two_sessions_same_local_date_keep_streak(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)
    scenario = await seed_scenario(db_session)

    await complete(api_client, headers, make_payload(str(scenario.id)))
    api_client.clock["now"] = FIXED_NOW + timedelta(hours=2)
    body = (
        await complete(api_client, headers, make_payload(str(scenario.id)))
    ).json()

    assert body["streak_current"] == 1
    quests = {q["code"]: q for q in body["quests"]}
    assert quests["session_2"]["completed"] is True


async def test_consecutive_local_dates_increment_streak(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)
    scenario = await seed_scenario(db_session)

    await complete(api_client, headers, make_payload(str(scenario.id)))
    api_client.clock["now"] = NEXT_DAY
    body = (
        await complete(api_client, headers, make_payload(str(scenario.id)))
    ).json()

    assert body["streak_current"] == 2


async def test_concurrent_duplicates_do_not_double_award(
    api_client: AsyncClient, db_session: AsyncSession
) -> None:
    headers = await register_and_login(api_client)
    scenario = await seed_scenario(db_session)
    payload = make_payload(str(scenario.id))

    responses = await asyncio.gather(
        complete(api_client, headers, payload),
        complete(api_client, headers, payload),
    )

    replays = [r.json()["idempotent_replayed"] for r in responses]
    assert sorted(replays) == [False, True]
    user = await current_user(db_session, "pavan@example.com")
    single_award = 48 + 20  # session xp + session_1 quest
    assert user.total_xp == single_award
