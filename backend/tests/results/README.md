# Backend test result artifacts

Point-in-time verification runs saved for the GLM workflow review trail
(SN-001 → SN-011). CI will generate these automatically once it lands;
until then this folder is the record of "GLM ran it and here is the
evidence".

## Runs

| Task | Check | File | Result |
|---|---|---|---|
| SN-002 | Health endpoint + CORS (`tests/test_health.py`) | `2026-08-22_sn002_test_health.txt` | 3 passed |
| SN-006 | DB models: schema, CRUD, relationships (`tests/test_models.py`) | `2026-08-22_sn006_test_models.txt` | 5 passed |
| SN-006 | Alembic async env, offline SQL mode | `2026-08-22_sn006_alembic_offline.txt` | exit 0 |
| SN-006 | PostgreSQL-dialect DDL render (8 tables, 6× JSONB, 12× timestamptz, partial indexes) | `2026-08-22_sn006_pg_ddl_render.txt` | exit 0 |
| SN-007 | Voice WebSocket protocol + state machine (`tests/test_ws.py`) | `2026-08-22_sn007_test_ws.txt` | 9 passed |
| SN-011 | Evaluator unit + feedback API (`tests/test_evaluator.py`, `tests/test_api_sessions.py`) | `2026-08-22_sn011_test_evaluator_api.txt` | 14 passed |
| SN-012 | FSRS-5 engine math (`tests/test_fsrs.py`) | `2026-08-22_sn012_test_fsrs.txt` | 13 passed |
| SN-012 | Review API (`tests/test_api_review.py`) | `2026-08-22_sn012_test_api_review.txt` | 6 passed |
| SN-010 | JWT auth + profiles (`tests/test_auth.py`) | `2026-08-22_sn010_test_auth.txt` | 10 passed |
| SN-014 | Timezone helpers (`tests/test_time.py`) | `2026-08-22_sn014_test_test_time.txt` | 5 passed |
| SN-014 | Streak/XP/skill/quest/badge rules (`tests/test_gamification_unit.py`) | `2026-08-22_sn014_test_test_gamification_unit.txt` | 17 passed |
| SN-014 | /sessions/complete + quests + summary API (`tests/test_api_gamification.py`) | `2026-08-22_sn014_test_test_api_gamification.txt` | 15 passed |
| SN-014A | WebSocket auth gate + user binding (`tests/test_ws.py`) | `2026-08-22_sn014a_test_test_ws.txt` | 14 passed |
| SN-014A | User-scoped FSRS review API (`tests/test_api_review.py`) | `2026-08-22_sn014a_test_test_api_review.txt` | 10 passed |
| SN-014A | Migration consistency (offline SQL + model inspection) (`tests/test_migrations.py`) | `2026-08-22_sn014a_test_test_migrations.txt` | 3 passed |
| SN-014A | Alembic offline `upgrade head --sql` | `2026-08-22_sn014a_alembic_offline.txt` | exit 0, 8 tables |
| SN-014B | **Live PostgreSQL 16** `alembic upgrade head` (Docker, disposable container) | `2026-08-22_sn014b_alembic_upgrade.txt` | exit 0 |
| SN-014B | Live PG `alembic current` | `2026-08-22_sn014b_alembic_current.txt` | `0001_initial (head)` |
| SN-014B | Live PG table listing (`\dt`) | `2026-08-22_sn014b_pg_tables.txt` | 9 tables (8 models + alembic_version) |
| SN-014B | Live PG schema-vs-models check (`scripts/verify_schema`) | `2026-08-22_sn014b_verify_schema.txt` | exit 0, `schema_ok: 8 tables match` |
| SN-014B | SN-008 scenario seed into live PG (`scripts/seed_content`) | `2026-08-22_sn014b_seed_content.txt` | exit 0, 20 upserts |
| SN-014B | Release smoke + migration tests | `2026-08-22_sn014b_release_smoke.txt` | 5 passed |
| SN-015 | Scenario catalog API (`tests/test_api_scenarios.py`) | `2026-08-23_sn015_test_api_scenarios.txt` | 2 passed |
| SN-015 | Full backend suite (regenerated after SN-015) | `2026-08-23_full_suite.txt` | 121 passed |
| SN-018 | Overlap + schema validation, v1 vs v2 packs (titles/ids/words: zero overlap; 9/9 categories; 5 premium) | `2026-08-23_sn018_overlap_validation.txt` | exit 0 |
| SN-018 | Live PG (Docker postgres:16 :55432) `alembic upgrade head` + `verify_schema` | `2026-08-23_sn018_alembic_upgrade.txt`, `2026-08-23_sn018_verify_schema.txt` | exit 0, `schema_ok: 8 tables` |
| SN-018 | Dual-pack seed ×2 into live PG (`scripts.seed_content`, v1+v2) | `2026-08-23_sn018_seed_twice.txt` | stable 40 scenarios / 200 vocab items; re-run no-op |
| SN-018 | Owned tests targeted run (`test_api_scenarios`, `test_release_smoke`) | `2026-08-23_sn018_owned_tests.txt` | 1 passed; 3 count assertions red pending out-of-scope content_service change |
| SN-018 | Full backend suite (excl. `test_ws.py`, pre-broken at branch tip) | `2026-08-23_sn018_full_suite.txt` | 94 passed, 13 failed — see Notes |
| all | (historical) Full suite after SN-014B | `2026-08-22_full_suite.txt` | 119 passed |

## Environment

- Python 3.11.4 (`backend/.venv`, Windows / Git Bash) — target runtime is 3.12
- pytest 8.3.4, pytest-asyncio 0.25.3, SQLAlchemy 2.0.36, FastAPI 0.115.6
- DB tests run on in-memory SQLite (aiosqlite); PostgreSQL verified via DDL render only

## Notes

- SN-018 (2026-08-23): the 13 failures in `2026-08-23_sn018_full_suite.txt` are NOT
  content regressions. Three are the updated SN-018 count assertions (40 scenarios /
  200 cards) that cannot pass until `app/services/content_service.py` loads both pack
  editions and raises `VOCABULARY_PACK_LIMIT` to 200 (out of SN-018 scope). Ten more
  fail with `NameError: logger` in `session_service.py`, plus a `test_ws.py` collection
  ImportError (`MOCK_AI_RESPONSE`) — both pre-existing at this branch's fork point and
  already fixed on `main`.

- Raw outputs include the pytest-asyncio deprecation warning about the
  unset default fixture loop scope — known and harmless (documented in
  the SN-006 report).
- Re-run any suite with `cd backend && .venv/Scripts/python -m pytest <path> -v`
  and save over a dated file when re-verifying a task for review.
