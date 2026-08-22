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
