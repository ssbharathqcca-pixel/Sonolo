# Sonolo Task Board

Cards move left to right through the columns defined in [GLM_WORKFLOW.md](GLM_WORKFLOW.md). One card per task; IDs are `SN-XXX`. Move a card in the same commit as the work it describes. Cards marked *(proposed)* are seeds, not commitments.

| Backlog | Spec Ready | Prompt Ready | GLM Running | Review | Fix Required | QA | Done |
|---|---|---|---|---|---|---|---|
| SN-002 *(proposed)* — Backend scaffold | | | | SN-001 — Monorepo structure and control docs | | | |
| SN-003 *(proposed)* — Mobile scaffold (Expo) | | | | | | | |
| SN-004 *(proposed)* — Web landing scaffold (Next.js) | | | | | | | |
| SN-005 *(proposed)* — Content model and first scenarios | | | | | | | |

## Card format

Cards are written using the implementation pattern in [PROMPT_LIBRARY.md](PROMPT_LIBRARY.md): task ID, title, type, priority, objective, files, constraints, acceptance criteria, and do-not list.
