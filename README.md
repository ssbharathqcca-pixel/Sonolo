# Sonolo

Sonolo is an AI voice-first language learning app focused on **Canadian English and French speaking readiness**. Learners practice by talking — short, casual voice sessions with an AI tutor instead of worksheets and flashcards.

> **Status: MVP scaffold.** This repository currently contains structure and control documents only — no application code, dependencies, or CI yet. Track progress on the [task board](docs/TASK_BOARD.md).

## Repository layout

| Path | Purpose |
|---|---|
| `apps/mobile/` | React Native + Expo + TypeScript mobile app |
| `apps/web/` | Next.js landing page |
| `backend/` | FastAPI + Python 3.12 API (PostgreSQL, Redis, WebSockets) |
| `content/` | Learning content: scenarios, rubrics, tutor prompts |
| `docs/` | Control documents (spec, workflow, board, ledgers) |
| `scripts/` | Development and automation scripts |
| `tests/` | Cross-cutting integration and end-to-end tests |

## Tech stack

- **Mobile:** React Native + Expo + TypeScript
- **Web:** Next.js
- **Backend:** FastAPI (Python 3.12), PostgreSQL, Redis, WebSockets, open-source AI models
- **Services:** RevenueCat (payments), PostHog (analytics), Sentry (errors)

## How we build: GLM + human review

Implementation heavy lifting is delegated to GLM against small, well-specified task cards. Every GLM output is reviewed by humans and Qwen before it is accepted. The full process — roles, task lifecycle, and logging rules — is defined in [docs/GLM_WORKFLOW.md](docs/GLM_WORKFLOW.md).

## Control documents

| Document | Purpose |
|---|---|
| [docs/MASTER_SPEC.md](docs/MASTER_SPEC.md) | Current agreed MVP scope |
| [docs/TASK_BOARD.md](docs/TASK_BOARD.md) | Task pipeline and status |
| [docs/TOKEN_LEDGER.md](docs/TOKEN_LEDGER.md) | Token usage per GLM run |
| [docs/DECISION_LOG.md](docs/DECISION_LOG.md) | Architectural and product decisions |
| [docs/QUALITY_LOG.md](docs/QUALITY_LOG.md) | Review findings and fixes |
| [docs/PROMPT_LIBRARY.md](docs/PROMPT_LIBRARY.md) | Reusable GLM prompt patterns |

## Getting started

There is nothing to install or run yet. `make help` lists the placeholder targets (`setup`, `backend`, `mobile`, `web`, `test`); they become real as scaffolding tasks land on the board.
