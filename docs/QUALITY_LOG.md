# Quality Log

Every finding from Review, Fix Required, or QA lands here. A row is closed when its status is `fixed` or `won't fix` (with justification).

| Task ID | Issue | Severity | Fix | Status |
|---|---|---|---|---|
| SN-001 | MASTER_SPEC included French in MVP while execution strategy is English-first | Major | Added D-007 and updated MASTER_SPEC | fixed |
| SN-001 | Example rows in token ledger and quality log needed replacement | Minor | Replaced with real SN-001 entries | fixed |Done
| SN-001 | Proposed backlog cards needed conversion into real task cards | Minor | 
| SN-002 |promoted to Spec Ready | fixed |Done
| SN-003 | Skill dimensions used Listening/Confidence instead of spec-required Coherence/Task Completion | Major | Replaced SKILL_DIMENSIONS with correct 6 dimensions; tsc strict passes | fixed |
*The row above is an example — delete it after the first real entry.*

## Severity rubric

| Severity | Meaning |
|---|---|
| Blocker | Broken build, spec violation, data loss, or security risk |
| Major | Incorrect behavior, missing acceptance criterion, meaningful performance problem |
| Minor | Style, docs, naming, non-blocking test gaps |

## Status values

`open` · `fix in progress` · `fixed` · `won't fix`
