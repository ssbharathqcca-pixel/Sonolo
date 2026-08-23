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

const API_BASE_URL: string =
  processEnv?.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

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
