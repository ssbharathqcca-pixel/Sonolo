# SONOLO MASTER CONTEXT v1 (canonical handoff — law + corrected state)

Source of truth = the repo. This document orients; when doc and code differ, code wins and the doc gets patched.

§1 IDENTITY \& LAW

* Brand: Sonolo. Tagline: "Sound like you belong."
* Prohibited legacy name: VoxPath. Never use it as a product name.
* Market: Canadian immigrants (PR readiness) + casual learners. MVP English-first; French = Phase 2.
* Legal: NEVER claim affiliation with IELTS, CELPIP, TEF, TCF, or IRCC. Use "CanadaReady™" and "CLB-inspired".
* Git commits ALWAYS multi-line: git commit -m "feat(scope): title (SN-XXX)" -m "- bullet"
* No placeholders. No TODOs. No pseudo-code. Production-grade only.
* All timestamps timezone-aware UTC. Never datetime.utcnow(). Use datetime.now(timezone.utc).
* User-local date logic via zoneinfo, default America/Toronto.

§2 SPRINT STATE

* Implemented \& release-proofed: SN-001..SN-013, SN-014, SN-014A, SN-014B, SN-015.
* Deferred: SN-004 (web landing, Phase 2). Absorbed: SN-005. Paywall renumbered: SN-026.
* Next: SN-016 (real AI pipeline) → SN-017 (mobile polish) → SN-026 (paywall) → Phase 2 French.
* Gates (current truth): backend pytest 121/121; mobile tsc 0 errors; Jest 9/9; Metro bundle exit 0; live PostgreSQL 16 bootstrap proof artifacts saved.

§3 REPO MAP (key paths)
backend/app/api/: health, auth, review, sessions, scenarios, quests, gamification, ws
backend/app/core/: config.py, security.py, time.py, logging.py
backend/app/models/: user, session, scenario, vocabulary, gamification, analytics
backend/app/learning/: evaluator.py (SN-011 six-dimension SessionEvaluator)
backend/app/services/: fsrs.py, session\_service.py, gamification\_service.py, quest\_service.py, content\_service.py, analytics.py
backend/app/services/ai/: (TO BUILD in SN-016) stt.py, llm.py, tts.py, providers
backend/alembic/versions/0001\_initial\_schema.py
backend/scripts/: seed\_content.py, verify\_schema.py
backend/tests/: incl. test\_release\_smoke.py, test\_migrations.py, test\_ws.py, test\_api\_\*.py
content/scenarios/canadian-life-v1.json (20 scenarios); content/vocabulary/core-v1.json (100 cards, Pa/Hi/Zh/Es)
docs/POSTGRES\_BOOTSTRAP.md; docs/SONOLO\_MASTER\_CONTEXT\_v1.md (this file)
apps/mobile/app/: (auth)/login|register, (tabs)/index|learn|progress, session/\[id].tsx, feedback/\[id].tsx
apps/mobile/src/: api/client.ts, stores/(authStore, scenarioStore, sessionResultStore), services/voiceSocket.ts, hooks/useVoiceSession.ts, components/(GlassCard, VoiceButton), theme/colors.ts, **tests**/

§4 SCHEMA (PostgreSQL 16, uuid7 PKs, JSONB, TIMESTAMPTZ)
users: email UNIQUE; name; native\_language; target\_language; subscription\_tier default 'free'; timezone default 'America/Toronto'; total\_xp; xp\_today; xp\_today\_date DATE; streak\_count; streak\_last\_date DATE; longest\_streak; last\_activity\_at; onboarding\_completed.
user\_skills: ONE row per user (user\_id UNIQUE) with fluency/pronunciation/grammar/vocabulary/coherence/task\_completion scores + composite.
sessions: user\_id FK; scenario\_id FK NULL; client\_session\_id UUID NOT NULL; UNIQUE(user\_id, client\_session\_id); started\_at/ended\_at TIMESTAMPTZ; duration\_seconds; transcript JSONB; evaluation\_json JSONB; overall\_score FLOAT; session\_xp/quest\_xp/total\_xp INT; is\_xp\_eligible BOOL.
scenarios: title; description; category; level; difficulty INT; system\_prompt; opening\_line; is\_premium; is\_published.
vocabulary\_cards: USER-SCOPED (user\_id NOT NULL) — content+scheduling merged (debt D-010); FSRS fields stability/difficulty/elapsed\_days/scheduled\_days/reps/lapses/state(0..3)/due\_date/last\_reviewed; partial index idx\_vocab\_due(user\_id, due\_date) WHERE state < 3.
daily\_quests: user\_id; quest\_date DATE; code; title; description; target\_count; progress\_count; reward\_xp; completed\_at; UNIQUE(user\_id, quest\_date, code).
user\_badges: user\_id; code; title; description; awarded\_at; UNIQUE(user\_id, code).
analytics\_events: user\_id NULL; event\_name; event\_properties JSONB; index on (event\_name, created\_at).

§5 CONTRACTS
REST (all authed via Bearer JWT unless noted):

* POST /api/auth/register | POST /api/auth/login (60-min HS256 JWT, sub=user.id) | GET /api/users/me
* GET /api/scenarios (published only, title-ordered, limit 1-100)
* POST /api/sessions/complete (idempotent by client\_session\_id)
* GET /api/quests/today | GET /api/gamification/me
* GET /api/review/due (limit default 20; lazily materializes 100 cards for card-less users AND COMMITS) | POST /api/review/answer
* POST /api/sessions/{id}/feedback (auth + ownership; other users get 404)
WS (path per app/api/ws.py; mobile builds URL via voiceSocketUrl()):
* Auth: JWT via ?token= validated BEFORE accept; failure → close 4401; mobile must logout on 4401.
* States: idle → listening → processing → speaking. 2s silence watchdog auto end\_turn.
* Client frames: audio\_chunk, end\_turn, text\_input, cancel.
* Server frames: state\_change, ai\_text\_chunk, ai\_audio\_chunk, turn\_complete, session\_summary{evaluation, transcript}, hint, error. (SN-016 may add audio\_payload base64 frame.)
IDEMPOTENCY: duplicate (user\_id, client\_session\_id) → catch IntegrityError, rollback, re-query, return idempotent\_replayed=true, NO mutation. Conflicting scenario/timestamps → 409.

§6 BUSINESS RULES
XP: session\_xp = min(20 + duration\_xp + proficiency\_xp + difficulty\_bonus + streak\_bonus, 100); duration\_xp=min(floor(sec/60),10); proficiency\_xp=floor(overall/10); difficulty\_bonus=min(difficulty*5,25); streak\_bonus=5 if streak>=3. Eligibility: duration>=15s, >=1 user turn, valid evaluation.
xp\_today resets when user-local date changes. Level = floor(total\_xp/100)+1; progress = total\_xp%100.
Streaks: first=1; same local date unchanged; consecutive +1; gap resets to 1; longest=max().
Skills EMA: new = round(0.7*old + 0.3\*session, 2), clamp \[0,100].
Daily quests (exactly three): session\_1 (target 1, 20 XP) | session\_2 (target 2, 30 XP) | vocab\_10 (target 10 reviews, 20 XP). Quest XP awarded once; completion sets completed\_at.
Badges: first\_session, streak\_3, streak\_7, xp\_500, quest\_day\_complete (all 3 quests). Idempotent.

§7 DEBT \& DECISIONS
D-009: SN-014A executed after SN-014 (ordering deviation, disclosed).
D-010: vocabulary\_cards user-scoped (no separate user\_vocabulary\_states); normalize post-MVP.
D-011: WS trusts verified JWT without per-socket DB hit; revocation latency = token lifetime (60 min).
OPEN: completion payload carries deterministic 75-score placeholder evaluation until SN-016; transcript roles alternate from ai\_text\_chunk order until SN-016 tags roles.

§8 STYLE \& GATES
Pydantic v2 ConfigDict(extra="forbid"); AwareDatetime; SQLAlchemy 2.0 async (async\_sessionmaker, async with session.begin(), flush/refresh); snake\_case DB, PascalCase classes, camelCase JS; RN: Expo SDK 52, TS strict, Zustand, Reanimated, expo-secure-store, expo-av; no external UI kits; no refresh tokens (MVP).
Gates: cd backend \&\& pytest | cd apps/mobile \&\& npm run typecheck \&\& npm test \&\& CI=1 npx expo export --platform android. Artifacts: dated .txt under backend/tests/results/ and apps/mobile/tests/results/.

§9 CURRENT TASK: SN-016
Scope: provider abstractions (STT faster-whisper, LLM OpenAI-compatible httpx, TTS edge-tts) + Mock providers; WS pipeline accumulates audio → STT → LLM (scenario system\_prompt) → TTS → stream back; SN-011 evaluator wired to real transcript; session\_summary carries real EvaluationPayload; mobile plays audio + renders user/assistant chat transcript; completion POST sends real evaluation.
DoD: all gates green with Mock providers in CI; no placeholders; brand/legal intact.
BOOT PROTOCOL for new model: (1) read this file; (2) restate §1 redlines + §5 idempotency + §7 debt; (3) pass SN-016-CAL probe; (4) then full SN-016; (5) every diff reviewed by GLM 5.3 before commit.

