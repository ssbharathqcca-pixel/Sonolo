# Quality Log

Every finding from Review, Fix Required, or QA lands here. A row is closed when its status is `fixed` or `won't fix` (with justification).

| Task ID | Issue | Severity | Fix | Status |
|---|---|---|---|---|
| SN-001 | MASTER_SPEC included French in MVP while execution strategy is English-first | Major | Added D-007 and updated MASTER_SPEC | fixed |
| SN-001 | Example rows in token ledger and quality log needed replacement | Minor | Replaced with real SN-001 entries | fixed |
| SN-002 | Backlog seed cards needed promotion into real task cards | Minor | Promoted SN-002 to Spec Ready | fixed |
| SN-003 | Skill dimensions used Listening/Confidence instead of spec-required Coherence/Task Completion | Major | Replaced SKILL_DIMENSIONS with the correct 6 dimensions; tsc strict passes | fixed |
| SN-014 | `AsyncSession.dialect` attribute errors; SQLite naive datetimes caused a false 409 on idempotent replay; autoflush double-counted the badge session count; expired-instance attribute access after rollback; concurrent duplicate completion double-inserted | Major | `dialect_name()` helper; UTC-normalizing replay comparison; explicit flush before counting; ids captured pre-transaction; IntegrityError rollback-and-replay path proven by an `asyncio.gather` race test | fixed |
| SN-014A | Review and feedback endpoints lacked authentication; the migration chain had never been applied to a live database | Major | `get_current_user` wired into all protected endpoints; WebSocket token gate (close 4401) with user binding; live PostgreSQL 16 upgrade + verify proof | fixed |
| SN-014B | `/review/due` vocabulary materialization was flushed but not committed (lost on session close); `verify_schema` ran sync inspection outside the greenlet context | Minor | Commit after materialization (idempotency test added); inspection via `connection.run_sync` | fixed |

## Severity rubric

| Severity | Meaning |
|---|---|
| Blocker | Broken build, spec violation, data loss, or security risk |
| Major | Incorrect behavior, missing acceptance criterion, meaningful performance problem |
| Minor | Style, docs, naming, non-blocking test gaps |

## Status values

`open` · `fix in progress` · `fixed` · `won't fix`
