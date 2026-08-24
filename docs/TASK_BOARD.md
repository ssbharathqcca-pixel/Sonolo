# Sonolo Task Board

Cards move left to right through the columns defined in [GLM_WORKFLOW.md](GLM_WORKFLOW.md). One card per task; IDs are `SN-XXX`. Move a card in the same commit as the work it describes.

**Numbering note (2026-08-24):** Implemented cards used the IDs on the issued task cards. The former Backlog card "SN-014 Paywall" was renumbered to **SN-026**. The v0.16.0 Integrated MVP has been tagged and released.

## Active Board

| Backlog | Spec Ready | Prompt Ready | GLM Running | Review | Fix Required | QA | Done |
|---|---|---|---|---|---|---|---|
| SN-004 — Web landing scaffold (Next.js) *(deferred)* | | | | | | | |
| SN-020 — French Phase 2 / Pronunciation drills content | | | | | | | |
| SN-022 — Marketing content batch (TikTok scripts) | | | | | | | |
| SN-023 — SEO blog content batch | | | | | | | |
| SN-024 — App Store metadata + screenshots | | | | | | | |
| SN-025 — Beta test suite (50 edge cases) | | | | | | | |
| SN-026 — Paywall + RevenueCat integration *(renumbered from SN-014)* | | | | | | | |

## Completed

| ID | Title | Completed | Notes |
|---|---|---|---|
| SN-001 | Monorepo structure and control docs | 2026-08-22 | 16 files, clean scaffold |
| SN-002 | Backend scaffold (FastAPI) | 2026-08-22 | Health endpoint, settings, CORS, JSON logging, tests pass |
| SN-003 | Mobile scaffold (Expo) + glassmorphic UI | 2026-08-22 | 3 core screens + design system; skill-dimension fix applied; tsc + Metro bundle pass |
| SN-005 | Content model and scenario schema | 2026-08-22 | Absorbed: schema delivered inside SN-006 models; content shape by SN-008/SN-009 packs; superseded by SN-014B content bootstrap |
| SN-006 | Database schema and SQLAlchemy models | 2026-08-22 | 8 tables, async engine, Alembic env; DDL + alembic offline evidence |
| SN-007 | Voice WebSocket protocol | 2026-08-22 | Protocol, session manager, mock pipeline; 9→14 WS tests after SN-014A auth gate |
| SN-008 | Scenario content batch (20 Canadian immigration scenarios) | 2026-08-22 | `content/scenarios/canadian-life-v1.json`; seeded into PG by SN-014B |
| SN-009 | Vocabulary content batch (100 items) | 2026-08-22 | `content/vocabulary/core-v1.json`; lazily materialized per user (D-010); ~400 more items planned |
| SN-010 | JWT authentication + user profiles | 2026-08-22 | bcrypt + jose, get_current_user dependency (10 auth tests) |
| SN-011 | Feedback/scoring engine (6 dimensions) | 2026-08-22 | Deterministic evaluator, wins/growth insights, API endpoint |
| SN-012 | FSRS review engine | 2026-08-22 | Native FSRS-5 math, /Done, user-scoped after SN-014A |
| SN-013 | Mobile auth flow, secure storage & API client | 2026-08-22 | Login/register screens, Zustand + SecureStore, Axios interceptors; tsc + bundle pass |
| SN-014 | Gamification, session persistence & daily quests | 2026-08-22 | Done; release proof closed by SN-014B (live PG 119/119) |
| SN-014A | Schema reconciliation, auth hardening, user-scoped state | 2026-08-22 | Done; release proof closed by SN-014B |
| SN-014B | Release closure: PostgreSQL proof + content bootstrap | 2026-08-22 | Done; fresh-user smoke 10/10 |
| SN-015 | Mobile Voice Session Integration | 2026-08-23 | Authenticated WebSocket, 4401 handling, scenario loading |
| SN-016 | Real AI Voice Pipeline | 2026-08-23 | STT/LLM/TTS provider abstractions, WebSocket audio streaming, Evaluator wiring |
| SN-017 | Mobile Polish | 2026-08-23 | Error boundaries, offline caching, 3-screen onboarding, live Learn/Progress tabs |
| SN-018 | Content Expansion | 2026-08-23 | 40 total scenarios (5 premium), 200 total vocab cards, dual-pack idempotent seeder |
| SN-019 | Prod Readiness | 2026-08-23 | Multi-stage Dockerfile, docker-compose with PG16, GitHub Actions CI, RUNBOOK |
| SN-021 | Real Mic Capture | 2026-08-24 | expo-av 16kHz capture, LISTENING state, cleanup on 4401/unmount, Jest coverage |

## Card format

Cards are written using the implementation pattern in [PROMPT_LIBRARY.md](PROMPT_LIBRARY.md): task ID, title, type, priority, objective, files, constraints, acceptance criteria, and do-not list.

## Priority Queue (Post v0.16.0 Release)

The v0.16.0 Integrated MVP is now tagged and released. Recommended order for the next sprint:

1. **SN-026** — Paywall + RevenueCat integration (gate the 5 premium scenarios, backend tier filtering, mobile UI locks).
2. **SN-020** — French Phase 2 / Pronunciation drills content expansion.
3. **SN-022 / SN-023** — Marketing and SEO content batches.
4. **SN-024 / SN-025** — App Store metadata, screenshots, and beta test suite.
5. **SN-004** — Web landing scaffold (Next.js) *(deferred)*.
