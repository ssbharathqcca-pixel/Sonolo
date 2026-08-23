# Decision Log

Append-only; newer decisions at the bottom. Never edit or delete past rows — supersede a decision with a new row that references the old one.

| # | Date | Decision | Rationale | Alternatives considered | Owner |
|---|---|---|---|---|---|
| D-001 | 2026-08-22 | GLM implements; humans and Qwen review all output | Maximizes implementation throughput while keeping human judgment on every change | Human-only coding; Qwen as implementer with GLM as reviewer | Sonolo team |
| D-002 | 2026-08-22 | Monorepo: `apps/`, `backend/`, `content/`, `docs/`, `scripts/`, `tests/` | One repo keeps control docs next to code and simplifies the task board | Separate repositories per app | Sonolo team |
| D-003 | 2026-08-22 | Mobile: React Native + Expo + TypeScript | Single TypeScript codebase across mobile and web; Expo speeds up audio/voice iteration | Flutter; separate native iOS and Android apps | Sonolo team |
| D-004 | 2026-08-22 | Web: Next.js landing page | Fast marketing site that shares TypeScript conventions with the mobile app | Plain static HTML; Astro | Sonolo team |
| D-005 | 2026-08-22 | Backend: FastAPI + Python 3.12, PostgreSQL, Redis, WebSockets | Native async and WebSocket support; Python ecosystem for open-source AI models | Node.js/NestJS; Django | Sonolo team |
| D-006 | 2026-08-22 | RevenueCat for payments, PostHog for analytics, Sentry for errors | Buy-not-build for non-core services | Custom billing; self-hosted analytics | Sonolo team |
| D-007 | 2026-06-22 | MVP is English-first; Canadian French is waitlist/Phase 2 | Maximizes launch speed, reduces content/TTS/scoring scope, and validates French demand via waitlist | Bilingual English + French MVP | Founder |
| D-008 | 2026-08-22 | Use uuid6 library for uuid7 PKs | Python 3.12 stdlib lacks uuid7; uuid6 is maintained and lightweight | Custom uuid generation, waiting for Python 3.14 stdlib | Founder |
| D-009 | 2026-08-22 | SN-014 was implemented just before its SN-014A prerequisite arrived; both were stabilized in place rather than reverting | Both cards' requirements verified together (117→119 passing tests); reverting verified work added risk without adding safety | Revert SN-014 and re-apply after SN-014A | GLM 5.3 + Sonolo team |
| D-010 | 2026-08-22 | `vocabulary_cards` stays user-scoped; the SN-009 pack is shared content lazily materialized per user on first `/api/review/due` (deterministic per-user UUIDs, FSRS priors from the pack); `user_vocabulary_states` table not created | SN-006 schema and SN-012 endpoints were already user-scoped; a separate state table would duplicate FSRS scheduling state | SN-014A option of a `user_vocabulary_states` table; globally shared scheduling | GLM 5.3 + Sonolo team |
| D-011 | 2026-08-22 | WebSocket auth trusts the verified JWT `sub` claim without a per-socket DB lookup; revocation latency equals token lifetime (60 min default) | Avoids holding a DB session per socket and event-loop binding issues; tokens are issued only at login | Per-connection user lookup; short-lived WS-only tokens; server-side revocation list | GLM 5.3 + Sonolo team |
