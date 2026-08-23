# Sonolo Production Runbook (SN-019)

Operating guide for the Dockerized Sonolo stack: PostgreSQL 16 (`db`) plus the FastAPI API (`api`). All runtime configuration flows through environment variables — no secrets are stored in code, images, or this repository.

## 1. Prerequisites

- Docker Engine 24+ with the Compose v2 plugin (`docker compose version` must succeed).
- Bash (macOS/Linux, or Git Bash on Windows) for `scripts/run_prod.sh`.
- Roughly 2 GB free disk for images and the database volume.

## 2. Configuration

The stack reads a root `.env` file (gitignored) or host environment variables.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `POSTGRES_PASSWORD` | yes | — | Database password. Use URL-safe characters (hex recommended) — it is embedded into `DATABASE_URL` verbatim. |
| `SECRET_KEY` | yes | — | JWT signing secret. Generate with `openssl rand -hex 32`. |
| `POSTGRES_USER` | no | `sonolo` | Database user. |
| `POSTGRES_DB` | no | `sonolo` | Database name. |
| `API_PORT` | no | `8000` | Host port mapped to the API container's 8000. |
| `ENVIRONMENT` | no | `production` | Deployment name reported by `/api/health`. |
| `LOG_LEVEL` | no | `INFO` | Root log level (`DEBUG`, `INFO`, `WARNING`, `ERROR`). |
| `CORS_ORIGINS` | no | `["http://localhost:3000", "http://localhost:8081"]` | JSON array of allowed origins. Must be valid JSON. |
| `AI_MOCK_ENABLED` | no | `true` | Force deterministic Mock AI providers (no external calls). |

`scripts/run_prod.sh` generates `.env` automatically on first run. To rotate secrets: edit `.env`, then redeploy. Rotating `SECRET_KEY` invalidates all issued JWTs (users sign in again). Rotating `POSTGRES_PASSWORD` requires updating the password inside PostgreSQL first (or recreating the volume), because the existing data directory keeps its old credentials.

Content packs (`content/scenarios/canadian-life-v1.json`, `content/vocabulary/core-v1.json`) are mounted read-only into the api container at `/content` and wired through `CONTENT_SCENARIOS_PATH` / `CONTENT_VOCABULARY_PATH`.

## 3. Quickstart (one command)

```bash
./scripts/run_prod.sh
```

The script builds the images, starts the stack, waits for `db` to be healthy, applies migrations (`alembic upgrade head`), seeds the scenario pack (idempotent), and polls `GET /api/health` until the API responds. Verify:

```bash
curl http://localhost:8000/api/health
```

## 4. Manual deployment (step by step)

```bash
# 4.1 Configure (or export the variables in your shell)
printf 'POSTGRES_PASSWORD=%s\nSECRET_KEY=%s\n' "$(openssl rand -hex 16)" "$(openssl rand -hex 32)" > .env
chmod 600 .env

# 4.2 Build and start
docker compose up -d --build

# 4.3 Apply schema migrations
docker compose run --rm --no-deps api alembic upgrade head

# 4.4 Seed the content pack (safe to re-run; deterministic upserts)
docker compose run --rm --no-deps api python -m scripts.seed_content

# 4.5 Smoke test
curl http://localhost:8000/api/health
```

## 5. Migrations

Run Alembic inside a one-off api container (the image ships `alembic.ini` and `alembic/`; the URL comes from `DATABASE_URL`):

```bash
docker compose run --rm --no-deps api alembic upgrade head    # apply all pending
docker compose run --rm --no-deps api alembic current         # show applied revision
docker compose run --rm --no-deps api alembic history         # list revision chain
```

Rollback is **destructive** — take a backup first, then:

```bash
docker compose run --rm --no-deps api alembic downgrade -1    # one revision back
```

## 6. Logs

```bash
docker compose logs -f api            # follow API logs
docker compose logs -f db             # follow PostgreSQL logs
docker compose logs --tail 100 api    # last 100 lines
```

To raise verbosity set `LOG_LEVEL=DEBUG` in `.env` and run `docker compose up -d api`.

## 7. Backup & restore

Backup (hot, logical):

```bash
mkdir -p backups
docker compose exec -T db pg_dump -U sonolo -d sonolo > "backups/sonolo_$(date +%Y%m%d_%H%M%S).sql"
```

Keep the `-T` flag so a TTY cannot corrupt the dump. Schedule nightly dumps via cron / Task Scheduler; physical or point-in-time backups are out of scope for MVP.

Restore (stop writers first):

```bash
docker compose stop api
cat backups/<dump>.sql | docker compose exec -T db psql -U sonolo -d sonolo
docker compose start api
```

Clean-slate restore (wipes current data — destructive):

```bash
docker compose down -v        # deletes the pgdata volume
docker compose up -d
cat backups/<dump>.sql | docker compose exec -T db psql -U sonolo -d sonolo
```

## 8. Health checks & troubleshooting

`GET /api/health` returns `{"status": "ok", ...}` — it reports liveness only and does not touch the database. Container healthchecks use the same endpoint for `api` and `pg_isready` for `db`.

| Symptom | Diagnosis |
| --- | --- |
| `api` restart-looping | `docker compose logs api`; most common cause is an unreachable `db` or malformed `DATABASE_URL`. |
| `db` unhealthy | `docker compose logs db`; confirm `POSTGRES_PASSWORD` is set and the `pgdata` volume is writable. |
| Port 8000 already in use | Set `API_PORT=8080` in `.env` and rerun. |
| 401 responses after rotating `SECRET_KEY` | Expected — issued JWTs are invalid; users sign in again. |
| Scenarios list empty | Run step 4.4; verify the content mount via `docker compose exec api ls /content/scenarios`. |
| Compose refuses to start citing missing variables | `POSTGRES_PASSWORD` / `SECRET_KEY` not set — create `.env` per §2. |

## 9. Teardown

```bash
docker compose down      # stop and remove containers, keep the data volume
docker compose down -v   # also delete the database volume (DESTRUCTIVE)
```

## 10. CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push and pull request targeting `main`: the `backend` job installs `requirements.txt`, applies migrations against a `postgres:16` service container, and runs `pytest` under Python 3.12; the `mobile` job runs `npm ci`, typecheck, and Jest under Node 20.
