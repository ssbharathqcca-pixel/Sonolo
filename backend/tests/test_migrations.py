"""Migration consistency tests (SN-014A Track 1).

Two layers of verification without a live PostgreSQL in this
environment:
1. Offline Alembic SQL generation (`upgrade head --sql`) succeeds and
   contains the full expected schema — proves the chain is runnable
   and complete.
2. Metadata inspection on SQLite — proves the MODELS carry every
   SN-010 / SN-012 / SN-014 field the migration must match.
"""

import subprocess
import sys

import pytest
from sqlalchemy import create_engine, inspect

import app.models  # noqa: F401
from app.db.base import Base

REQUIRED_TABLES = {
    "users",
    "user_skills",
    "sessions",
    "scenarios",
    "vocabulary_cards",
    "user_badges",
    "daily_quests",
    "analytics_events",
}

REQUIRED_COLUMNS: dict[str, set[str]] = {
    "users": {
        "hashed_password",  # SN-010
        "timezone",  # SN-014
        "xp_today",
        "xp_today_date",
        "longest_streak",
        "last_activity_at",
        "preferred_language",  # SN-020
    },
    "vocabulary_cards": {
        "translations",  # SN-012
        "stability",
        "difficulty",
        "reps",
        "lapses",
        "state",
        "due_date",
        "user_id",  # FSRS state is user-scoped by design (SN-006).
    },
    "sessions": {
        "client_session_id",  # SN-014
        "started_at",
        "ended_at",
        "evaluation_json",
        "overall_score",
        "session_xp",
        "quest_xp",
        "total_xp",
    },
    "daily_quests": {"code", "title", "target_count", "progress_count", "completed_at"},
    "user_badges": {"badge_id", "title", "description", "earned_at"},
    "scenarios": {"pack_id"},  # SN-035
}


def test_models_contain_all_required_tables_and_columns() -> None:
    engine = create_engine("sqlite://")
    Base.metadata.create_all(engine)
    inspector = inspect(engine)
    tables = set(inspector.get_table_names())
    assert REQUIRED_TABLES <= tables
    for table, columns in REQUIRED_COLUMNS.items():
        actual = {column["name"] for column in inspector.get_columns(table)}
        missing = columns - actual
        assert not missing, f"{table} missing columns: {missing}"


def test_alembic_offline_upgrade_generates_full_schema() -> None:
    result = subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "head", "--sql"],
        capture_output=True,
        text=True,
        timeout=120,
    )
    assert result.returncode == 0, result.stderr
    sql = result.stdout
    for table in REQUIRED_TABLES:
        assert f'CREATE TABLE {table}' in sql, f"missing CREATE TABLE {table}"
    for marker in (
        "hashed_password",
        "client_session_id",
        "uq_sessions_user_client_session",
        "uq_daily_quests_user_date_code",
        "uq_user_badges_user_badge",
        "idx_vocab_due",
        "preferred_language",
        "ix_scenarios_pack_id",  # SN-035
    ):
        assert marker in sql, f"migration SQL missing: {marker}"
    assert "user_vocabulary_states" not in sql  # See SN-014A decision note.


@pytest.mark.parametrize(
    "statement_count_minimum",
    [8],
)
def test_migration_downgrade_also_renders(
    statement_count_minimum: int,
) -> None:
    result = subprocess.run(
        [sys.executable, "-m", "alembic", "downgrade", "--sql", "head:base"],
        capture_output=True,
        text=True,
        timeout=120,
    )
    assert result.returncode == 0, result.stderr
    drops = result.stdout.count("DROP TABLE")
    assert drops >= statement_count_minimum
