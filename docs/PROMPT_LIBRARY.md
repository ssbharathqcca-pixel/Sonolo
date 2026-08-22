# Prompt Library

Reusable prompt patterns for the GLM workflow. Never send GLM a free-form request — assemble prompts from these patterns and fill the `{{placeholders}}`.

## 1. Implementation (task card)

The house format for all code and docs tasks.

```text
PROJECT CONTEXT:
{{2–4 sentences: what Sonolo is and what this task touches}}

TECH STACK:
{{the slice of the stack relevant to this task}}

CODING RULES:
1. Implement only the requested task.
2. Do not redesign architecture unless explicitly asked.
3. Use existing file structure and conventions.
4. No placeholders, no TODOs, no fake functions.
5. Include all imports.
6. Include tests when relevant.
7. Use type hints.
8. Keep code production-ready.
9. If a dependency is required, justify it.
10. If output exceeds limit, stop cleanly and say: CONTINUE {{TASK-ID}} PART 2.

TASK CARD:
TASK ID: {{SN-XXX}}
TITLE: {{short title}}
TYPE: {{Repo scaffold | Feature | Fix | Refactor | Docs | Test}}
PRIORITY: {{P0 | P1 | P2}}
OBJECTIVE: {{one paragraph, outcome-focused}}
FILES TO CREATE/MODIFY: {{explicit list}}
CONSTRAINTS: {{boundaries}}
ACCEPTANCE CRITERIA: {{checkable list}}
DO NOT: {{explicit exclusions}}

OUTPUT FORMAT:
1. Assumptions
2. Files changed
3. Full content for each file
4. Run instructions
5. Known limitations
6. Self-check checklist
7. Suggested commit message
```

## 2. Review (Qwen or human)

```text
You are reviewing the output of task {{TASK-ID}} for Sonolo.
Inputs: the task card (with acceptance criteria) and the produced files or diff.
Check: acceptance-criteria coverage, correctness, missing imports/types/tests,
security, scope creep.
Output a findings table: severity (blocker | major | minor), file, issue,
suggested fix.
Do not rewrite the code. Do not approve while any blocker is unresolved.
```

## 3. Fix loop

```text
You are fixing review findings for task {{TASK-ID}}.
Inputs: the original task card and the findings table below.
Rules: fix ONLY the listed findings. No refactors, no new features, no renames.
Keep the original output format. Log resolved findings in QUALITY_LOG.md.
{{findings table}}
```

## 4. Spec to cards

```text
You are planning Sonolo work.
Input: the spec section below.
Break it into small, independently testable implementation task cards using the
house card format. Order by dependency. Flag anything that needs a DECISION_LOG
entry before it can be Spec Ready.
{{spec section}}
```

## Usage rules

- Always include the task card and the output format — never rely on GLM to invent structure.
- Keep the CODING RULES verbatim; they encode hard constraints.
- Store the assembled prompt next to the task (issue or PR) so every run is reproducible.
