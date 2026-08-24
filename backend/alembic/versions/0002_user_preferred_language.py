"""Add users.preferred_language for the French Phase 2 catalog (SN-020).

Every existing learner keeps practicing English, so the column is
NOT NULL with an 'en' server default; the application layer restricts
values to 'en' | 'fr' (see app.models.user.PreferredLanguage).

Revision ID: 0002_preferred_language
Revises: 0001_initial
Create Date: 2026-08-24

Targets PostgreSQL 16; also runs on SQLite for tests.
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0002_preferred_language"
down_revision: Union[str, None] = "0001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "preferred_language",
            sa.String(length=10),
            nullable=False,
            server_default=sa.text("'en'"),
        ),
    )


def downgrade() -> None:
    op.drop_column("users", "preferred_language")
