/**
 * Tests for SN-049.5:
 * - hydrate(): network errors keep the token; 401 errors clear it.
 * - login() / register(): pending preferred language applied after auth and cleared.
 * - unauthorizedHandler: guarded against logout churn when logged out.
 */

const mockSecureStore: Record<string, string | null> = {};

jest.mock("../services/secureStorage", () => ({
  TOKEN_KEY: "sonolo.access_token",
  ONBOARDING_KEY: "sonolo.onboarding_completed",
  ONBOARDING_GOAL_KEY: "sonolo.onboarding_goal",
  PENDING_PREFERRED_LANGUAGE_KEY: "sonolo.pending_preferred_language",
  setItem: jest.fn(async (key: string, value: string) => {
    mockSecureStore[key] = value;
    return true;
  }),
  getItem: jest.fn(async (key: string) => {
    return mockSecureStore[key] ?? null;
  }),
  removeItem: jest.fn(async (key: string) => {
    delete mockSecureStore[key];
    return true;
  }),
}));

jest.mock("../api/client", () => {
  const actual = jest.requireActual("../api/client");
  let unauthCb: (() => void) | null = null;
  return {
    ...actual,
    loginRequest: jest.fn(async () => ({
      access_token: "jwt-token-xyz",
      token_type: "bearer",
    })),
    registerRequest: jest.fn(async () => ({
      id: "u-1",
      email: "test@example.com",
    })),
    fetchCurrentUser: jest.fn(),
    updatePreferredLanguage: jest.fn(),
    fetchEntitlements: jest.fn(async () => null),
    setAuthToken: jest.fn(),
    setUnauthorizedHandler: jest.fn((cb: () => void) => {
      unauthCb = cb;
    }),
    triggerMockUnauthorized: () => {
      unauthCb?.();
    },
  };
});

import {
  fetchCurrentUser,
  updatePreferredLanguage,
  type User,
} from "../api/client";
import {
  PENDING_PREFERRED_LANGUAGE_KEY,
  TOKEN_KEY,
  removeItem,
} from "../services/secureStorage";
import { useAuthStore } from "../stores/authStore";

const mockFetchCurrentUser = fetchCurrentUser as jest.Mock;
const mockUpdatePreferredLanguage = updatePreferredLanguage as jest.Mock;
const mockRemoveItem = removeItem as jest.Mock;

function makeUser(preferred_language: "en" | "fr" = "en"): User {
  return {
    id: "user-1",
    email: "pavan@example.com",
    name: "Pavan",
    native_language: "hi",
    target_language: "en-CA",
    learning_goal: "pr_readiness",
    current_level: "sprout",
    preferred_language,
    subscription_tier: "free",
    streak_count: 0,
    streak_last_date: null,
    total_xp: 0,
    total_speaking_seconds: 0,
    onboarding_completed: true,
    created_at: "2026-08-24T12:00:00Z",
    skills: null,
  };
}

describe("authStore hydrate & pending language (SN-049.5)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(mockSecureStore)) {
      delete mockSecureStore[key];
    }
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      isHydrated: false,
      isAuthenticated: false,
      onboardingCompleted: false,
      onboardingGoal: null,
      pendingPreferredLanguage: null,
      entitlements: null,
    });
  });

  describe("hydrate() error handling", () => {
    it("on network error: keeps the token in SecureStore, sets isHydrated=true and isAuthenticated=false", async () => {
      mockSecureStore[TOKEN_KEY] = "valid-stored-jwt";

      // Axios-style network error (request sent, no response received)
      const networkError = new Error("Network Error");
      (networkError as unknown as { request: object }).request = {};
      mockFetchCurrentUser.mockRejectedValueOnce(networkError);

      await useAuthStore.getState().hydrate();

      // Crucial: removeItem must NOT have been called for TOKEN_KEY
      expect(mockRemoveItem).not.toHaveBeenCalledWith(TOKEN_KEY);
      expect(mockSecureStore[TOKEN_KEY]).toBe("valid-stored-jwt");

      const state = useAuthStore.getState();
      expect(state.isHydrated).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBe("valid-stored-jwt");
      expect(state.user).toBeNull();
    });

    it("on 5xx server error: keeps the token in SecureStore", async () => {
      mockSecureStore[TOKEN_KEY] = "valid-stored-jwt";

      const serverError = new Error("Internal Server Error");
      (serverError as unknown as { response: { status: number } }).response = {
        status: 500,
      };
      mockFetchCurrentUser.mockRejectedValueOnce(serverError);

      await useAuthStore.getState().hydrate();

      expect(mockRemoveItem).not.toHaveBeenCalledWith(TOKEN_KEY);
      expect(useAuthStore.getState().isHydrated).toBe(true);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it("on 401 error: clears token from SecureStore and resets session", async () => {
      mockSecureStore[TOKEN_KEY] = "expired-stored-jwt";

      const unauthError = new Error("Not authenticated");
      (unauthError as unknown as { response: { status: number } }).response = {
        status: 401,
      };
      mockFetchCurrentUser.mockRejectedValueOnce(unauthError);

      await useAuthStore.getState().hydrate();

      expect(mockRemoveItem).toHaveBeenCalledWith(TOKEN_KEY);
      expect(mockSecureStore[TOKEN_KEY]).toBeUndefined();

      const state = useAuthStore.getState();
      expect(state.isHydrated).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
    });
  });

  describe("Pending preferred language sync", () => {
    it("applies pending language after login success and clears pending key", async () => {
      mockSecureStore[PENDING_PREFERRED_LANGUAGE_KEY] = "fr";
      mockFetchCurrentUser.mockResolvedValueOnce(makeUser("en"));
      mockUpdatePreferredLanguage.mockResolvedValueOnce(makeUser("fr"));

      await useAuthStore.getState().login("pavan@example.com", "password123");

      expect(mockUpdatePreferredLanguage).toHaveBeenCalledWith("fr");
      expect(mockRemoveItem).toHaveBeenCalledWith(PENDING_PREFERRED_LANGUAGE_KEY);
      expect(useAuthStore.getState().user?.preferred_language).toBe("fr");
    });

    it("applies pending language after register success and clears pending key", async () => {
      mockSecureStore[PENDING_PREFERRED_LANGUAGE_KEY] = "fr";
      mockFetchCurrentUser.mockResolvedValueOnce(makeUser("en"));
      mockUpdatePreferredLanguage.mockResolvedValueOnce(makeUser("fr"));

      await useAuthStore.getState().register({
        name: "Pavan",
        email: "pavan@example.com",
        password: "password123",
        native_language: "hi",
        target_language: "fr-CA",
      });

      expect(mockUpdatePreferredLanguage).toHaveBeenCalledWith("fr");
      expect(mockRemoveItem).toHaveBeenCalledWith(PENDING_PREFERRED_LANGUAGE_KEY);
      expect(useAuthStore.getState().user?.preferred_language).toBe("fr");
    });

    it("does not call updatePreferredLanguage if pending language matches current user language", async () => {
      mockSecureStore[PENDING_PREFERRED_LANGUAGE_KEY] = "en";
      mockFetchCurrentUser.mockResolvedValueOnce(makeUser("en"));

      await useAuthStore.getState().login("pavan@example.com", "password123");

      expect(mockUpdatePreferredLanguage).not.toHaveBeenCalled();
      expect(mockRemoveItem).toHaveBeenCalledWith(PENDING_PREFERRED_LANGUAGE_KEY);
      expect(useAuthStore.getState().user?.preferred_language).toBe("en");
    });
  });

  describe("Guarded 401 unauthorized handler", () => {
    it("does not trigger logout when already logged out (token is null)", async () => {
      const logoutSpy = jest.spyOn(useAuthStore.getState(), "logout");
      useAuthStore.setState({
        user: null,
        token: null,
        isAuthenticated: false,
      });

      const { triggerMockUnauthorized } = require("../api/client");
      triggerMockUnauthorized();

      expect(logoutSpy).not.toHaveBeenCalled();
    });
  });
});
