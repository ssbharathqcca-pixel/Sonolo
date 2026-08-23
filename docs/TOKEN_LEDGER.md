# Token Ledger

One row per GLM run — including fix-loop runs (reference the parent task ID in Notes). Fill prompt and output tokens from the model's usage report; estimated total = prompt + output.

| Date | Task ID | Workstream | Prompt tokens | Output tokens | Estimated total | Result | Quality score | Notes |
|---|---|---|---|---|---|---|---|---|
| *2026-08-22* | *SN-000* | *WS-INFRA* | *4,000* | *12,000* | *16,000* | *Merged* | *5/5* | *Example row — delete after the first real entry* |
| D-008 | 2026-08-22 | Use uuid6 library for uuid7 PKs | Python 3.12 stdlib lacks uuid7; uuid6 is maintained and lightweight | Custom uuid generation, waiting for Python 3.14 stdlib | Founder |
| 2026-08-22 | SN-008 | WS-CONTENT | ~3,500 | ~8,500 | ~12,000 | Merged | 5/5 | 20 Canadian immigration scenarios, perfect distribution and cultural context |
| 2026-08-22 | SN-009 | WS-CONTENT | ~4,000 | ~18,000 | ~22,000 | Merged | 5/5 | 100 FSRS vocab items with Pa/Hi/Zh/Es translations and Canadian context |
| 2026-08-22 | SN-007 | WS-BACKEND | ~5,000 | ~25,000 | ~30,000 | Merged | 5/5 | WebSocket protocol, session manager, mock pipeline, 9 WS tests (17/17 pass) |
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
