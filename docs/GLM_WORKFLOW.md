# GLM Workflow

How Sonolo gets built: GLM does the implementation heavy lifting from small task cards; humans and Qwen review every output before it is accepted.

## Roles

| Role | Responsibility |
|---|---|
| Human — product owner | Writes specs and task cards, sets priorities, makes decisions, final acceptance |
| GLM — implementer | Produces code, tests, and docs from task cards; fixes findings from review |
| Qwen — reviewer model | Independent review of GLM output: spec compliance, correctness, security, scope creep |
| Human — reviewer | Triages Qwen findings, requests fixes, runs QA, accepts or rejects |

## Task lifecycle

The lifecycle maps one-to-one to the columns of [TASK_BOARD.md](TASK_BOARD.md):

| Column | Meaning | Owner |
|---|---|---|
| Backlog | Idea captured, not yet specified | Product owner |
| Spec Ready | Task card exists with objective, constraints, acceptance criteria | Product owner |
| Prompt Ready | Complete prompt assembled from a [PROMPT_LIBRARY.md](PROMPT_LIBRARY.md) pattern | Product owner |
| GLM Running | Prompt dispatched to GLM; affected files are frozen until it returns | GLM |
| Review | Output checked against acceptance criteria by Qwen and a human | Reviewers |
| Fix Required | Review found issues; a fix prompt (findings only) goes back to GLM | GLM |
| QA | Fixes verified; tests run; token ledger and quality log updated | Human reviewer |
| Done | Accepted; work is complete | — |

## Rules

1. One task card per GLM run. Cards are small and independently testable.
2. GLM implements only what the card requests. Architecture changes require a new card and a [DECISION_LOG.md](DECISION_LOG.md) entry.
3. Every GLM run is logged in [TOKEN_LEDGER.md](TOKEN_LEDGER.md): prompt tokens, output tokens, result, quality score.
4. Every review finding is logged in [QUALITY_LOG.md](QUALITY_LOG.md) and stays there until its status is `fixed` (or explicitly `won't fix`).
5. If GLM output is cut off by a limit, it must stop cleanly with `CONTINUE <TASK-ID> PART 2` and be resumed with the same context.
6. Decisions live in DECISION_LOG.md, not in code comments or chat history.

## Workstreams

Used for task cards and the token ledger.

| Code | Workstream |
|---|---|
| WS-MOBILE | React Native / Expo app |
| WS-WEB | Next.js landing page |
| WS-BACKEND | FastAPI API and data layer |
| WS-CONTENT | Learning content and tutor prompts |
| WS-INFRA | Repo, CI/CD, deployment |
| WS-DOCS | Specs and control documents |
| WS-QA | Testing and quality |

## Task ID convention

`SN-XXX`, assigned sequentially in the order cards are created. IDs are never reused.
