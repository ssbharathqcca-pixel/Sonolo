# Sonolo Task Board

Cards move left to right through the columns defined in [GLM_WORKFLOW.md](GLM_WORKFLOW.md). One card per task; IDs are `SN-XXX`. Move a card in the same commit as the work it describes. Cards marked *(proposed)* are seeds, not commitments.

## Active Board

| Backlog | Spec Ready | Prompt Ready | GLM Running | Review | Fix Required | QA | Done |
|---|---|---|---|---|---|---|---|
| SN-004 — Web landing scaffold (Next.js) | | SN-003 — Mobile scaffold (Expo) | | | | | SN-001 — Monorepo structure and control docs |
| SN-005 — Content model and scenario schema | | | | | | | SN-002 — Backend scaffold |
| SN-006 — Database schema and SQLAlchemy models | | | | | | | |
| SN-007 — Voice WebSocket protocol | | | | | | | |
| SN-008 — Scenario content batch (20 Canadian immigration) | | | | | | | |
| SN-009 — Vocabulary content batch (500 items) | | | | | | | |
| SN-010 — Voice pipeline integration (STT → LLM → TTS) | | | | | | | |
| SN-011 — Feedback/scoring engine (6 dimensions) | | | | | | | |
| SN-012 — FSRS review engine | | | | | | | |
| SN-013 — Gamification (streaks, XP, quests) | | | | | | | |
| SN-014 — Paywall + RevenueCat integration | | | | | | | |
| SN-015 — Analytics (PostHog) + Sentry setup | | | | | | | |
| SN-016 — Onboarding flow UI (5 screens) | | | | | | | |
| SN-017 — Voice session screen + waveform | | | | | | | |
| SN-018 — Feedback/report screen UI | | | | | | | |
| SN-019 — Daily home screen + quest cards | | | | | | | |
| SN-020 — Pronunciation drills content (minimal pairs) | | | | | | | |
| SN-021 — French waitlist landing page | | | | | | | |
| SN-022 — Marketing content batch (TikTok scripts) | | | | | | | |
| SN-023 — SEO blog content batch | | | | | | | |
| SN-024 — App Store metadata + screenshots | | | | | | | |
| SN-025 — Beta test suite (50 edge cases) | | | | | | | |

## Completed

| ID | Title | Completed | Notes |
|---|---|---|---|
| SN-001 | Monorepo structure and control docs | 2026-08-22 | 16 files, clean scaffold |
| SN-002 | Backend scaffold (FastAPI) | 2026-08-22 | Health endpoint, settings, tests pass |

## Card format

Cards are written using the implementation pattern in [PROMPT_LIBRARY.md](PROMPT_LIBRARY.md): task ID, title, type, priority, objective, files, constraints, acceptance criteria, and do-not list.

## Priority Queue (Next 24 Hours)

With tokens expiring 2026-08-23 21:00, execute in this order:

1. **SN-003** → Mobile scaffold (already prompted to GLM)
2. **SN-006** → Database schema (unlocks everything backend)
3. **SN-008** → Scenario content batch (20 scenarios, JSON burn)
4. **SN-009** → Vocabulary batch (500 items, massive JSON burn)
5. **SN-007** → Voice WebSocket protocol
6. **SN-010** → Voice pipeline integration
7. **SN-011** → Feedback/scoring engine
8. **SN-012** → FSRS review engine
9. **SN-013** → Gamification
10. **SN-016 → SN-019** → Frontend screens

Content batches (SN-008, SN-009, SN-020, SN-022, SN-023) are the highest token-burn items. Prioritize those between code tasks.
