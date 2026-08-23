# Sonolo PostgreSQL Bootstrap (Release, SN-014B)

Exact steps to bootstrap a fresh PostgreSQL 16 database for the Sonolo
backend. All commands run from `backend/` with the project venv active.

## 1. Start PostgreSQL

Any PostgreSQL 16 instance works. With Docker:

```bash
docker run -d --name sonolo-pg \
  -e POSTGRES_USER=sonolo -e POSTGRES_PASSWORD=sonolo -e POSTGRES_DB=sonolo \
  -p 5432:5432 postgres:16
```

Without Docker, install PostgreSQL 16 natively and create the role and
database:

```sql
CREATE USER sonolo WITH PASSWORD 'sonolo';
CREATE DATABASE sonolo OWNER sonolo;
```

## 2. Configure the connection

```bash
export DATABASE_URL=postgresql+asyncpg://sonolo:sonolo@localhost:5432/sonolo
```

(Or copy `backend/.env.example` to `backend/.env` and edit.)

## 3. Apply migrations

```bash
python -m alembic upgrade head    # applies 0001_initial_schema
python -m alembic current         # expect: 0001_initial (head)
```

## 4. Verify the schema matches the models

```bash
python -m scripts.verify_schema   # prints schema_ok + table count
```

Expected tables after upgrade: `users`, `user_skills`, `sessions`,
`scenarios`, `vocabulary_cards`, `user_badges`, `daily_quests`,
`analytics_events`, plus `alembic_version`.

## 5. Seed content

```bash
python -m scripts.seed_content    # upserts all 20 SN-008 scenarios
```

The SN-009 vocabulary pack is NOT pre-seeded: vocabulary cards are
user-scoped instances by design (decision D-008 in DECISION_LOG.md) and
are materialized lazily the first time a new user calls
`GET /api/review/due`.

## 6. Run the release smoke suite

```bash
pytest tests/test_release_smoke.py tests/test_migrations.py -v
pytest   # full suite (SQLite-based; no PostgreSQL needed)
```

## 7. Save evidence artifacts (optional, release convention)

```bash
{ python -m alembic upgrade head 2>&1; echo "EXIT_CODE=$?"; } \
  > tests/results/$(date +%F)_sn014b_alembic_upgrade.txt
{ python -m alembic current 2>&1;  echo "EXIT_CODE=$?"; } \
  > tests/results/$(date +%F)_sn014b_alembic_current.txt
{ python -m scripts.verify_schema 2>&1; echo "EXIT_CODE=$?"; } \
  > tests/results/$(date +%F)_sn014b_verify_schema.txt
```
