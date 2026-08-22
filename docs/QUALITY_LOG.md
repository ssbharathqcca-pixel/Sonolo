# Quality Log

Every finding from Review, Fix Required, or QA lands here. A row is closed when its status is `fixed` or `won't fix` (with justification).

| Task ID | Issue | Severity | Fix | Status |
|---|---|---|---|---|
| *SN-000* | *Example: public function missing a return type annotation* | *Minor* | *Added `-> None`; covered by review checklist* | *fixed* |

*The row above is an example — delete it after the first real entry.*

## Severity rubric

| Severity | Meaning |
|---|---|
| Blocker | Broken build, spec violation, data loss, or security risk |
| Major | Incorrect behavior, missing acceptance criterion, meaningful performance problem |
| Minor | Style, docs, naming, non-blocking test gaps |

## Status values

`open` · `fix in progress` · `fixed` · `won't fix`
