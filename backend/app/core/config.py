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
    voice_silence_timeout: float = Field(
        default=2.0,
        description=(
            "Seconds without incoming audio before a listening turn is "
            "auto-ended by the voice session manager."
        ),
    )
    secret_key: str = Field(
        default="dev-only-secret-key-change-me",
        description=(
            "JWT signing secret. Safe local default only — must be "
            "overridden via the environment outside development."
        ),
    )
    algorithm: str = Field(
        default="HS256",
        description="JWT signing algorithm.",
    )
    access_token_expire_minutes: int = Field(
        default=60,
        description="Access token lifetime in minutes.",
    )
    content_scenarios_path: str = Field(
        default="../content/scenarios/canadian-life-v1.json",
        description=(
            "Path to the validated scenario content pack (SN-008), "
            "absolute or relative to the backend directory."
        ),
    )
    content_vocabulary_path: str = Field(
        default="../content/vocabulary/core-v1.json",
        description=(
            "Path to the validated vocabulary content pack (SN-009), "
            "absolute or relative to the backend directory."
        ),
    )
    content_vocabulary_pack_limit: int = Field(
        default=1000,
        description="Maximum vocabulary cards to materialize per user from all packs combined",
    )
    ai_mock_enabled: bool = Field(
        default=True,
        description=(
            "Force deterministic Mock AI providers (CI / key-less dev). "
            "Real providers also fall back to mocks when their library, "
            "key, or model is missing."
        ),
    )
    openai_api_key: str = Field(
        default="",
        description="API key for the OpenAI-compatible tutor endpoint.",
    )
    openai_base_url: str = Field(
        default="https://api.openai.com/v1",
        description="Base URL of any OpenAI-compatible chat API.",
    )
    openai_model: str = Field(
        default="gpt-4o-mini",
        description="Chat model name for the tutor LLM.",
    )
    whisper_model_size: str = Field(
        default="base",
        description="faster-whisper model size (tiny/base/small/...).",
    )
    edge_tts_voice: str = Field(
        default="en-CA-LiamNeural",
        description="edge-tts voice for tutor speech.",
    )
    ai_request_timeout_seconds: float = Field(
        default=30.0,
        description="Timeout for AI provider calls.",
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return the process-wide cached settings instance."""
    return Settings()