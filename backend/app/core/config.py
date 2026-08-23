"""Application settings loaded from the environment via pydantic-settings."""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Sonolo backend configuration.

    Values are read from environment variables (case-insensitive) or a
    `.env` file in the working directory, falling back to safe local
    defaults suitable for development.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = Field(
        default="Sonolo API",
        description="Service name reported by /api/health.",
    )
    app_version: str = Field(
        default="0.1.0",
        description="Service version reported by /api/health.",
    )
    environment: str = Field(
        default="local",
        description="Deployment environment name, e.g. local, staging, production.",
    )
    log_level: str = Field(
        default="INFO",
        description="Root log level: DEBUG, INFO, WARNING, ERROR, or CRITICAL.",
    )
    api_prefix: str = Field(
        default="/api",
        description="Prefix applied to all API routes.",
    )
    cors_origins: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:8081"],
        description=(
            "Origins allowed by CORS. When set via environment variable, "
            "the value must be a JSON array."
        ),
    )
    database_url: str = Field(
        default="postgresql+asyncpg://sonolo:sonolo@localhost:5432/sonolo",
        description=(
            "Async SQLAlchemy database URL used by the app and Alembic. "
            "The default targets a local development PostgreSQL instance."
        ),
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return the process-wide cached settings instance."""
    return Settings()
