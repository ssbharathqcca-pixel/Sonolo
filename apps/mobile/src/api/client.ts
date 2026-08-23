/**
 * Axios API client for the Sonolo backend.
 *
 * - Base URL from EXPO_PUBLIC_API_URL (set in .env for each environment),
 *   defaulting to the local FastAPI dev server.
 * - Request interceptor attaches `Authorization: Bearer <token>` from the
 *   in-memory token set by the auth store.
 * - Response interceptor catches 401s, clears the token, and invokes the
 *   unauthorized handler registered by the auth store (which logs out and
 *   triggers the redirect to login via state-driven routing).
 *
 * The handler-injection pattern keeps this module free of store imports,
 * avoiding a circular dependency (authStore -> client -> authStore).
 */

import axios, { AxiosError, type AxiosInstance } from "axios";

const processEnv: Record<string, string | undefined> | undefined = (
  globalThis as { process?: { env?: Record<string, string | undefined> } }
).process?.env;

export const API_BASE_URL: string =
  processEnv?.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

/** Authenticated voice WebSocket URL (backend mounts /ws outside /api). */
export function voiceSocketUrl(sessionId: string, token: string): string {
  const wsBase = API_BASE_URL.replace(/^http/, "ws");
  return `${wsBase}/ws/voice/${sessionId}?token=${encodeURIComponent(token)}`;
}

let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

/** Set (or clear) the token attached to outgoing requests. */
export function setAuthToken(token: string | null): void {
  authToken = token;
}

/** Register the callback fired when any request comes back 401. */
export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

export const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (authToken !== null) {
    config.headers.set("Authorization", `Bearer ${authToken}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      authToken = null;
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);

// ---------------------------------------------------------------------
// Backend payload types (mirrors of the FastAPI schemas)
// ---------------------------------------------------------------------

export interface UserSkill {
  fluency_score: number;
  pronunciation_score: number;
  grammar_score: number;
  vocabulary_score: number;
  coherence_score: number;
  task_completion_score: number;
  composite_score: number;
  canada_ready_score: number;
  confidence_score: number;
  updated_at: string;
}

export interface User {
  id: string;
  email: string | null;
  name: string;
  native_language: string;
  target_language: string;
  learning_goal: string;
  current_level: string;
  subscription_tier: string;
  streak_count: number;
  streak_last_date: string | null;
  total_xp: number;
  total_speaking_seconds: number;
  onboarding_completed: boolean;
  created_at: string;
  skills: UserSkill | null;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  native_language: string;
  target_language: string;
}

export interface TokenPayload {
  access_token: string;
  token_type: string;
}

// ---------------------------------------------------------------------
// Endpoint helpers
// ---------------------------------------------------------------------

export async function loginRequest(
  email: string,
  password: string,
): Promise<TokenPayload> {
  const { data } = await api.post<TokenPayload>("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function registerRequest(
  payload: RegisterPayload,
): Promise<User> {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

/** Map any thrown error to a calm, user-facing message. */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const detail: unknown = error.response.data?.detail;
      if (typeof detail === "string") {
        return detail;
      }
      if (Array.isArray(detail) && detail.length > 0) {
        const first = detail[0] as { msg?: string } | undefined;
        if (typeof first?.msg === "string") {
          return first.msg;
        }
      }
      if (error.response.status === 401) {
        return "Incorrect email or password.";
      }
      return `Request failed (${error.response.status}).`;
    }
    return "Can't reach Sonolo — check your connection and the server.";
  }
  return "Something went wrong. Please try again.";
}

// ---------------------------------------------------------------------
// Scenarios (SN-015)
// ---------------------------------------------------------------------

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number | null;
}

export async function fetchScenarios(): Promise<Scenario[]> {
  const { data } = await api.get<{ scenarios: Scenario[] }>("/scenarios");
  return data.scenarios;
}

// ---------------------------------------------------------------------
// Session completion (SN-015 -> SN-014 contract)
// ---------------------------------------------------------------------

export interface TranscriptTurnInput {
  role: "user" | "assistant" | "system";
  text: string;
}

export interface EvaluationScoresInput {
  fluency: number;
  pronunciation: number;
  grammar: number;
  vocabulary: number;
  coherence: number;
  task_completion: number;
}

export interface EvaluationInput {
  scores: EvaluationScoresInput;
  overall_score: number;
  insights: string[];
  engine_version: string;
}

export interface SessionCompletePayload {
  client_session_id: string;
  scenario_id: string;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  transcript: TranscriptTurnInput[];
  evaluation: EvaluationInput;
  client_info?: Record<string, string>;
}

export interface SkillUpdate {
  dimension: string;
  previous_score: number | null;
  session_score: number;
  new_score: number;
}

export interface QuestResult {
  code: string;
  title: string;
  description: string;
  target_count: number;
  progress_count: number;
  reward_xp: number;
  completed: boolean;
}

export interface BadgeResult {
  code: string;
  title: string;
  description: string;
  awarded_at: string;
}

export interface SessionCompleteResponse {
  session_id: string;
  idempotent_replayed: boolean;
  xp_eligible: boolean;
  xp: {
    session_xp: number;
    quest_xp: number;
    total_xp: number;
    xp_total: number;
    xp_today: number;
    level: number;
    progress_to_next_level: number;
  };
  skills: SkillUpdate[];
  streak_current: number;
  streak_longest: number;
  quests: QuestResult[];
  newly_awarded_badges: BadgeResult[];
  completed_at: string;
}

/**
 * Deterministic placeholder evaluation until the real evaluator feeds
 * the completion call — valid per the backend's Pydantic contract, so
 * sessions persist and gamification is awarded.
 */
export function buildMockEvaluation(): EvaluationInput {
  return {
    scores: {
      fluency: 75,
      pronunciation: 75,
      grammar: 75,
      vocabulary: 75,
      coherence: 75,
      task_completion: 75,
    },
    overall_score: 75,
    insights: [],
    engine_version: "sn011-deterministic-v1",
  };
}

export async function completeSession(
  payload: SessionCompletePayload,
): Promise<SessionCompleteResponse> {
  const { data } = await api.post<SessionCompleteResponse>(
    "/sessions/complete",
    payload,
  );
  return data;
}
