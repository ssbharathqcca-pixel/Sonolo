"""Tests for the SQLAlchemy models: schema creation, CRUD, relationships."""

import uuid
from datetime import UTC, date, datetime

import pytest
from sqlalchemy import inspect, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession

from app.models import Scenario, SpeakingSession, User, UserBadge, UserSkill

pytestmark = pytest.mark.asyncio

EXPECTED_TABLES = {
    "users",
    "user_skills",
    "sessions",
    "scenarios",
    "vocabulary_cards",
    "user_badges",
    "daily_quests",
    "analytics_events",
}


def make_user() -> User:
    return User(
        name="Pavan",
        native_language="hi",
        target_language="en-CA",
        learning_goal="casual",
        current_level="sprout",
    )


def make_session(user_id: uuid.UUID) -> SpeakingSession:
    return SpeakingSession(
        user_id=user_id,
        client_session_id=uuid.uuid4(),
        session_type="quick_speak",
        started_at=datetime(2026, 8, 22, 12, 0, tzinfo=UTC),
        ended_at=datetime(2026, 8, 22, 12, 5, tzinfo=UTC),
        duration_seconds=300,
        turns_count=8,
        fluency_score=78.0,
        pronunciation_score=82.0,
        grammar_score=64.0,
        vocabulary_score=71.0,
        coherence_score=74.0,
        task_completion_score=88.0,
        composite_score=76.2,
        xp_earned=50,
    )


async def test_all_tables_created(db_engine: AsyncEngine) -> None:
    async with db_engine.connect() as connection:
        table_names = await connection.run_sync(
            lambda sync_connection: set(inspect(sync_connection).get_table_names())
        )
    assert EXPECTED_TABLES <= table_names


async def test_user_crud(db_session: AsyncSession) -> None:
    user = make_user()
    db_session.add(user)
    await db_session.commit()

    fetched = await db_session.scalar(select(User).where(User.id == user.id))
    assert fetched is not None
    assert fetched.id is not None
    assert fetched.name == "Pavan"
    assert fetched.subscription_tier == "free"
    assert fetched.total_xp == 0
    assert fetched.onboarding_completed is False
    assert fetched.created_at is not None

    fetched.total_xp = 150
    fetched.streak_last_date = date(2026, 8, 22)
    await db_session.commit()

    refetched = await db_session.scalar(select(User).where(User.id == user.id))
    assert refetched is not None
    assert refetched.total_xp == 150
    assert refetched.streak_last_date == date(2026, 8, 22)

    await db_session.delete(refetched)
    await db_session.commit()

    deleted = await db_session.scalar(select(User).where(User.id == user.id))
    assert deleted is None


async def test_user_sessions_relationship(db_session: AsyncSession) -> None:
    scenario = Scenario(
        title="Order at the coffee shop",
        category="shopping",
        mode="casual",
        level="seed",
        expected_turns=6,
    )
    user = make_user()
    db_session.add_all([scenario, user])
    await db_session.flush()

    first = make_session(user.id)
    first.scenario_id = scenario.id
    second = make_session(user.id)
    second.scenario_id = scenario.id
    db_session.add_all([first, second])
    await db_session.commit()

    loaded = await db_session.scalar(select(User).where(User.id == user.id))
    assert loaded is not None
    assert len(loaded.sessions) == 2
    assert loaded.sessions[0].user is loaded
    assert {record.composite_score for record in loaded.sessions} == {76.2}

    loaded_scenario = await db_session.scalar(
        select(Scenario).where(Scenario.id == scenario.id)
    )
    assert loaded_scenario is not None
    assert len(loaded_scenario.sessions) == 2


async def test_user_skill_one_to_one(db_session: AsyncSession) -> None:
    user = make_user()
    user.skills = UserSkill(
        user=user,
        fluency_score=78.0,
        pronunciation_score=82.0,
        grammar_score=64.0,
        vocabulary_score=71.0,
        coherence_score=74.0,
        task_completion_score=88.0,
        composite_score=76.2,
        canada_ready_score=62.0,
        confidence_score=60.0,
    )
    db_session.add(user)
    await db_session.commit()

    loaded = await db_session.scalar(select(User).where(User.id == user.id))
    assert loaded is not None
    assert loaded.skills is not None
    assert loaded.skills.canada_ready_score == 62.0
    assert loaded.skills.user is loaded


async def test_user_badge_unique_constraint(db_session: AsyncSession) -> None:
    user = make_user()
    db_session.add(user)
    await db_session.flush()
    user_id = user.id

    db_session.add_all(
        [
            UserBadge(user_id=user_id, badge_id="first_session"),
            UserBadge(user_id=user_id, badge_id="first_session"),
        ]
    )
    with pytest.raises(IntegrityError):
        await db_session.flush()
    await db_session.rollback()

    badges = (
        await db_session.scalars(
            select(UserBadge).where(UserBadge.user_id == user_id)
        )
    ).all()
    assert len(badges) == 0
