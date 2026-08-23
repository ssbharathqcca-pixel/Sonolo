# Sonolo Backend

FastAPI (Python 3.12) API powering voice conversation sessions.

**Status: skeleton + data layer — runnable and tested.** Includes an application factory, `GET /api/health` endpoint, environment-driven settings via pydantic-settings, CORS, structured JSON logging, a pytest suite, and the full PostgreSQL schema as SQLAlchemy 2.0 async models with Alembic migrations. Redis, WebSockets, auth, and AI integrations are deliberately not included yet (see [`../docs/TASK_BOARD.md`](../docs/TASK_BOARD.md)).

## Requirements

- Python 3.12
- pip

## Quickstart

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows Git Bash: source .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API serves on http://localhost:8000 — verify with http://localhost:8000/api/health. Interactive docs: http://localhost:8000/docs.

From the repository root, `make backend` starts the same server.

## Configuration

Settings load from environment variables (case-insensitive) and a `.env` file in the `backend/` directory, via pydantic-settings. Copy `.env.example` to `.env` to override defaults; never commit a real `.env`.

| Variable | Default | Purpose |
|---|---|---|
| `APP_NAME` | `Sonolo API` | Service name reported by `/api/health` |
| `APP_VERSION` | `0.1.0` | Service version reported by `/api/health` |
| `ENVIRONMENT` | `local` | Deployment environment name |
| `LOG_LEVEL` | `INFO` | Root log level (`DEBUG`…`CRITICAL`) |
| `API_PREFIX` | `/api` | Prefix applied to all routes |
| `CORS_ORIGINS` | `["http://localhost:3000","http://localhost:8081"]` | Allowed origins, as a JSON array |
| `DATABASE_URL` | `postgresql+asyncpg://sonolo:sonolo@localhost:5432/sonolo` | Async SQLAlchemy URL (app + Alembic) |

## Database

The schema lives in `app/models/` as SQLAlchemy 2.0 async models (users, user_skills, sessions, scenarios, vocabulary_cards, user_badges, daily_quests, analytics_events) with uuid7 primary keys, JSONB payloads, timestamptz columns, and query-pattern indexes. `app/db/` holds the declarative base and the async session factory.

Local development requires a PostgreSQL 16 instance matching `DATABASE_URL`. Migrations (run from `backend/`):

```bash
alembic revision --autogenerate -m "message"   # create a migration
alembic upgrade head                           # apply migrations
alembic downgrade -1                           # roll back one migration
```

Tests run against in-memory SQLite (aiosqlite) — no local PostgreSQL needed for `pytest`.

## Structure

```
backend/
├── alembic/              async migration environment (versions/ holds migrations)
├── app/
│   ├── main.py           application factory: middleware, routers, lifespan logging
│   ├── api/              HTTP routers (health)
│   ├── core/             config (pydantic-settings) and JSON logging
│   ├── db/               declarative base, JSONB variant type, async session factory
│   └── models/           SQLAlchemy 2.0 async models (8 tables)
└── tests/                pytest suite (run from backend/)
```

## Testing

```bash
cd backend
pytest
```

## Conventions

- All code is fully type-hinted; keep it that way.
- Unit tests live next to the code they cover; cross-service tests live in [`../tests/`](../tests/).
- Do not create ad-hoc folders; structure grows with tracked tasks.
