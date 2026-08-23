"""Declarative base, naming conventions, and shared column types."""

from sqlalchemy import JSON, MetaData
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm import DeclarativeBase

#: Alembic-friendly constraint naming so migrations are deterministic.
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    """Base for all Sonolo models; applies the shared naming convention."""

    metadata = MetaData(naming_convention=NAMING_CONVENTION)


#: JSON type that renders as JSONB on PostgreSQL and plain JSON elsewhere
#: (tests run on SQLite). Use for every structured-payload column.
JSONB = JSON().with_variant(postgresql.JSONB(), "postgresql")
