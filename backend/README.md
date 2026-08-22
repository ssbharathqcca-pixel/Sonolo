# Sonolo Backend

FastAPI (Python 3.12) API powering voice conversation sessions.

**Status: scaffold only — no code yet.** The service, models, and tests will be created by tracked tasks (see [`../docs/TASK_BOARD.md`](../docs/TASK_BOARD.md)).

## Planned stack

- FastAPI + Python 3.12 (async, fully type-hinted)
- PostgreSQL as the primary datastore
- Redis for cache and session state
- WebSockets for real-time voice session streaming
- Open-source AI models for speech and tutoring (selection tracked in [`../docs/DECISION_LOG.md`](../docs/DECISION_LOG.md))

## Notes

- Do not create ad-hoc folders; structure arrives with its scaffolding task.
- Unit tests live next to the code they cover; cross-service tests live in [`../tests/`](../tests/).
