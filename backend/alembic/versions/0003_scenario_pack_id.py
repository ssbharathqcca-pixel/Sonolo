"""Add scenarios.pack_id for pack-level catalog mapping (SN-035).

Nullable string holding the manifest pack id ("canadian-life-v1",
"workplace-english-v1", ...), indexed for the Learn tab's per-pack
counts. Existing rows keep NULL until the next idempotent re-seed
fills the value in.

Revision ID: 0003_scenario_pack_id
Revises: 0002_preferred_language
Create Date: 2026-08-26

Targets PostgreSQL 16; also runs on SQLite for tests.
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0003_scenario_pack_id"
down_revision: Union[str, None] = "0002_preferred_language"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "scenarios",
        sa.Column("pack_id", sa.String(length=64), nullable=True),
    )
    op.create_index(
        op.f("ix_scenarios_pack_id"), "scenarios", ["pack_id"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_scenarios_pack_id"), table_name="scenarios")
    op.drop_column("scenarios", "pack_id")
