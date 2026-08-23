"""Initial Sonolo schema: SN-006 base plus additive SN-010/012/014 columns.

Revision ID: 0001_initial
Revises: -
Create Date: 2026-08-22

Targets PostgreSQL 16 (UUID, JSONB, TIMESTAMPTZ, partial indexes).
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

JSONB = postgresql.JSONB(astext_type=sa.Text())


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("hashed_password", sa.String(length=255), nullable=False, server_default=sa.text("''")),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("native_language", sa.String(length=10), nullable=False),
        sa.Column("target_language", sa.String(length=10), nullable=False),
        sa.Column("learning_goal", sa.String(length=50), nullable=False),
        sa.Column("current_level", sa.String(length=20), nullable=False),
        sa.Column("subscription_tier", sa.String(length=20), nullable=False, server_default=sa.text("'free'")),
        sa.Column("subscription_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("streak_count", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("streak_last_date", sa.Date(), nullable=True),
        sa.Column("total_xp", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("xp_today", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("xp_today_date", sa.Date(), nullable=True),
        sa.Column("longest_streak", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("last_activity_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("timezone", sa.String(length=64), nullable=False, server_default=sa.text("'America/Toronto'")),
        sa.Column("total_speaking_seconds", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("onboarding_completed", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id", name="pk_users"),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )

    op.create_table(
        "user_skills",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("fluency_score", sa.Float(), nullable=False, server_default=sa.text("0")),
        sa.Column("pronunciation_score", sa.Float(), nullable=False, server_default=sa.text("0")),
        sa.Column("grammar_score", sa.Float(), nullable=False, server_default=sa.text("0")),
        sa.Column("vocabulary_score", sa.Float(), nullable=False, server_default=sa.text("0")),
        sa.Column("coherence_score", sa.Float(), nullable=False, server_default=sa.text("0")),
        sa.Column("task_completion_score", sa.Float(), nullable=False, server_default=sa.text("0")),
        sa.Column("composite_score", sa.Float(), nullable=False, server_default=sa.text("0")),
        sa.Column("canada_ready_score", sa.Float(), nullable=False, server_default=sa.text("0")),
        sa.Column("confidence_score", sa.Float(), nullable=False, server_default=sa.text("0")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_user_skills_user_id_users"),
        sa.PrimaryKeyConstraint("id", name="pk_user_skills"),
        sa.UniqueConstraint("user_id", name="uq_user_skills_user_id"),
    )

    op.create_table(
        "scenarios",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=sa.text("''")),
        sa.Column("category", sa.String(length=50), nullable=False),
        sa.Column("mode", sa.String(length=20), nullable=False),
        sa.Column("level", sa.String(length=20), nullable=False),
        sa.Column("difficulty", sa.Integer(), nullable=True, server_default=sa.text("NULL")),
        sa.Column("target_language", sa.String(length=10), nullable=False, server_default=sa.text("'en-CA'")),
        sa.Column("system_prompt", sa.Text(), nullable=False, server_default=sa.text("''")),
        sa.Column("opening_line", sa.Text(), nullable=False, server_default=sa.text("''")),
        sa.Column("expected_turns", sa.Integer(), nullable=False),
        sa.Column("success_criteria", JSONB, nullable=False),
        sa.Column("vocabulary_targets", JSONB, nullable=False),
        sa.Column("grammar_targets", JSONB, nullable=False),
        sa.Column("cultural_notes", sa.Text(), nullable=False, server_default=sa.text("''")),
        sa.Column("is_premium", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id", name="pk_scenarios"),
    )
    op.create_index(
        "idx_scenarios_level_category",
        "scenarios",
        ["level", "category"],
        unique=False,
        postgresql_where=sa.text("is_published = TRUE"),
    )

    op.create_table(
        "sessions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("scenario_id", sa.Uuid(), nullable=True),
        sa.Column("client_session_id", sa.Uuid(), nullable=False),
        sa.Column("session_type", sa.String(), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("ended_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("duration_seconds", sa.Integer(), nullable=False),
        sa.Column("turns_count", sa.Integer(), nullable=False),
        sa.Column("fluency_score", sa.Float(), nullable=False),
        sa.Column("pronunciation_score", sa.Float(), nullable=False),
        sa.Column("grammar_score", sa.Float(), nullable=False),
        sa.Column("vocabulary_score", sa.Float(), nullable=False),
        sa.Column("coherence_score", sa.Float(), nullable=False),
        sa.Column("task_completion_score", sa.Float(), nullable=False),
        sa.Column("composite_score", sa.Float(), nullable=False),
        sa.Column("xp_earned", sa.Integer(), nullable=False),
        sa.Column("errors_detected", JSONB, nullable=False),
        sa.Column("transcript", JSONB, nullable=False),
        sa.Column("evaluation_json", JSONB, nullable=False),
        sa.Column("overall_score", sa.Float(), nullable=False, server_default=sa.text("0")),
        sa.Column("is_xp_eligible", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("session_xp", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("quest_xp", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("total_xp", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("audio_stored", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_sessions_user_id_users"),
        sa.ForeignKeyConstraint(["scenario_id"], ["scenarios.id"], name="fk_sessions_scenario_id_scenarios"),
        sa.PrimaryKeyConstraint("id", name="pk_sessions"),
        sa.UniqueConstraint("user_id", "client_session_id", name="uq_sessions_user_client_session"),
    )
    op.create_index("idx_sessions_user_date", "sessions", ["user_id", "created_at"], unique=False)

    op.create_table(
        "vocabulary_cards",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("word", sa.Text(), nullable=False),
        sa.Column("translations", JSONB, nullable=False),
        sa.Column("stability", sa.Float(), nullable=False, server_default=sa.text("0")),
        sa.Column("difficulty", sa.Float(), nullable=False, server_default=sa.text("0")),
        sa.Column("elapsed_days", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("scheduled_days", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("reps", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("lapses", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("state", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("due_date", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("last_review", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_vocabulary_cards_user_id_users"),
        sa.PrimaryKeyConstraint("id", name="pk_vocabulary_cards"),
    )
    op.create_index(
        "idx_vocab_due",
        "vocabulary_cards",
        ["user_id", "due_date"],
        unique=False,
        postgresql_where=sa.text("state < 3"),
    )

    op.create_table(
        "user_badges",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("badge_id", sa.String(length=50), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False, server_default=sa.text("''")),
        sa.Column("description", sa.Text(), nullable=False, server_default=sa.text("''")),
        sa.Column("earned_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_user_badges_user_id_users"),
        sa.PrimaryKeyConstraint("id", name="pk_user_badges"),
        sa.UniqueConstraint("user_id", "badge_id", name="uq_user_badges_user_badge"),
    )

    op.create_table(
        "daily_quests",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("quest_date", sa.Date(), nullable=False),
        sa.Column("quest_type", sa.String(length=30), nullable=False),
        sa.Column("code", sa.String(length=50), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False, server_default=sa.text("''")),
        sa.Column("description", sa.Text(), nullable=False, server_default=sa.text("''")),
        sa.Column("target_count", sa.Integer(), nullable=False, server_default=sa.text("1")),
        sa.Column("progress_count", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("scenario_id", sa.Uuid(), nullable=True),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("xp_reward", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_daily_quests_user_id_users"),
        sa.ForeignKeyConstraint(["scenario_id"], ["scenarios.id"], name="fk_daily_quests_scenario_id_scenarios"),
        sa.PrimaryKeyConstraint("id", name="pk_daily_quests"),
        sa.UniqueConstraint("user_id", "quest_date", "code", name="uq_daily_quests_user_date_code"),
    )
    op.create_index("idx_quests_user_date", "daily_quests", ["user_id", "quest_date"], unique=False)

    op.create_table(
        "analytics_events",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=True),
        sa.Column("event_name", sa.String(length=100), nullable=False),
        sa.Column("event_properties", JSONB, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id", name="pk_analytics_events"),
    )
    op.create_index("idx_analytics_event", "analytics_events", ["event_name", "created_at"], unique=False)


def downgrade() -> None:
    op.drop_table("analytics_events")
    op.drop_index("idx_quests_user_date", table_name="daily_quests")
    op.drop_table("daily_quests")
    op.drop_table("user_badges")
    op.drop_index("idx_vocab_due", table_name="vocabulary_cards")
    op.drop_table("vocabulary_cards")
    op.drop_index("idx_sessions_user_date", table_name="sessions")
    op.drop_table("sessions")
    op.drop_index("idx_scenarios_level_category", table_name="scenarios")
    op.drop_table("scenarios")
    op.drop_table("user_skills")
    op.drop_table("users")
