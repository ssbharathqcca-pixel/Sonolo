# Sonolo Master Spec — MVP

Status: living document. Scope changes go through [DECISION\_LOG.md](DECISION_LOG.md) first, then this file is updated to match.

## Vision

Sonolo is an AI voice-first language learning app for speaking readiness in Canadian English and French. Learners practice by talking — short, casual voice sessions with an AI tutor, not worksheets or flashcards.

## Target users

* Adults in Canada learning English or French for daily life: work conversations, small talk, services, errands.
* Casual learners who want low-friction practice in short sessions, not a classroom curriculum.

## MVP scope

1. Voice-first conversation practice with an AI tutor.
2. Canadian English only for MVP. Canadian French is Phase 2/waitlist.
3. Speaking-readiness feedback after each session.
4. Casual learning loop: short sessions, low commitment, steady habits.
5. Subscription monetization via RevenueCat.
6. Product instrumentation: PostHog analytics, Sentry error tracking.

## Proposed non-goals for MVP (confirm before building against them)

* Full structured curriculum, grammar drills, certifications.
* Social features (leaderboards, friends).
* Offline mode.
* Canadian French learning content, French TTS, and French readiness scoring.

## Architecture summary

|Layer|Choice|
|-|-|
|Mobile app|React Native + Expo + TypeScript|
|Web|Next.js landing page|
|Backend|FastAPI + Python 3.12|
|Primary datastore|PostgreSQL|
|Cache / sessions|Redis|
|Realtime|WebSockets|
|AI|Open-source models (specific models TBD — see [DECISION\_LOG.md](DECISION_LOG.md))|
|Payments|RevenueCat|
|Analytics|PostHog|
|Error tracking|Sentry|

## Open questions

Each resolves through a DECISION\_LOG entry before related tasks go to Spec Ready.

1. Which open-source models for speech recognition, tutoring, and feedback — self-hosted or via API.
2. Definition of "speaking readiness" and how sessions are scored.
3. Bilingual UX: one app with a language picker, or distinct modes.

