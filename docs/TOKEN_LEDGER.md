# Token Ledger

One row per GLM run — including fix-loop runs (reference the parent task ID in Notes). Fill prompt and output tokens from the model's usage report; estimated total = prompt + output.

| Date | Task ID | Workstream | Prompt tokens | Output tokens | Estimated total | Result | Quality score | Notes |
|---|---|---|---|---|---|---|---|---|
| 2026-08-22 | SN-008 | WS-CONTENT | ~3,500 | ~8,500 | ~12,000 | Merged | 5/5 | 20 Canadian immigration scenarios, perfect distribution and cultural context |
| 2026-08-22 | SN-009 | WS-CONTENT | ~4,000 | ~18,000 | ~22,000 | Merged | 5/5 | 100 FSRS vocab items with Pa/Hi/Zh/Es translations and Canadian context (400 more planned — see task board) |
| 2026-08-22 | SN-007 | WS-BACKEND | ~5,000 | ~25,000 | ~30,000 | Merged | 5/5 | WebSocket protocol, session manager, mock pipeline, 9 WS tests |
| 2026-08-22 | SN-011 | WS-BACKEND | ~4,500 | ~16,000 | ~20,500 | Merged | 5/5 | Deterministic 6-dimension evaluator, insights, API endpoint |
| 2026-08-22 | SN-012 | WS-BACKEND | ~5,500 | ~28,000 | ~33,500 | Merged | 5/5 | Native FSRS-5 engine, API endpoints, translations column |
| 2026-08-22 | SN-010 | WS-BACKEND | ~4,000 | ~14,000 | ~18,000 | Merged | 5/5 | JWT auth, bcrypt, user profiles, get_current_user dependency |
| 2026-08-22 | SN-014 | WS-BACKEND | ~14,000 | ~19,000 | ~33,000 | Merged | 4/5 | Gamification, session persistence, daily quests; ordering deviation covered by D-009 |
| 2026-08-22 | SN-014A | WS-BACKEND | ~9,000 | ~14,000 | ~23,000 | Merged | 4/5 | Schema reconciliation, auth hardening, user-scoped FSRS, WS identity |
| 2026-08-22 | SN-014B | WS-INFRA | ~8,000 | ~13,000 | ~21,000 | Pending QA | — | Live PG 16 bootstrap proof, content seeding, release smoke, governance artifacts |

## Result values

`Merged` · `Merged with fixes` · `Rejected` · `Superseded`

## Quality score rubric

| Score | Meaning |
|---|---|
| 5 | Accepted as-is |
| 4 | Accepted after minor fixes |
| 3 | Accepted after significant fixes |
| 2 | Partially usable; substantial rework |
| 1 | Rejected |
