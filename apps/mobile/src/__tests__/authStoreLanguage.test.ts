/**
 * Tests for the auth store's preferred-language action (SN-020):
 * success mirrors the backend profile into local state, failure keeps
 * the previous preference and surfaces a user-facing message.
 */

jest.mock("../services/secureStorage", () => ({
  TOKEN_KEY: "sonolo.access_token",
  setItem: jest.fn(async () => true),
  getItem: jest.fn(async () => null),
  removeItem: jest.fn(async () => true),
}));

jest.mock("../api/client", () => {
  const actual = jest.requireActual("../api/client");
  return {
    ...actual,
    updatePreferredLanguage: jest.fn(),
  };
});

import { updatePreferredLanguage, type User } from "../api/client";
import { useAuthStore } from "../stores/authStore";

const mockUpdate = updatePreferredLanguage as jest.Mock;

function baseUser(preferred_language: "en" | "fr"): User {
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

describe("authStore.setPreferredLanguage (SN-020)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: baseUser("en"),
      token: "test-token",
      isLoading: false,
      isHydrated: true,
      isAuthenticated: true,
      onboardingCompleted: true,
      onboardingGoal: null,
    });
  });

  it("exists on the store and calls the backend with the chosen language", async () => {
    expect(typeof useAuthStore.getState().setPreferredLanguage).toBe(
      "function",
    );

    const updated = baseUser("fr");
    mockUpdate.mockResolvedValueOnce(updated);

    await useAuthStore.getState().setPreferredLanguage("fr");

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith("fr");
  });

  it("updates local user state to French on success", async () => {
    mockUpdate.mockResolvedValueOnce(baseUser("fr"));

    await useAuthStore.getState().setPreferredLanguage("fr");

    const { user, isLoading } = useAuthStore.getState();
    expect(user?.preferred_language).toBe("fr");
    expect(isLoading).toBe(false);
  });

  it("keeps the previous preference and throws a friendly error on failure", async () => {
    mockUpdate.mockRejectedValueOnce(new Error("network down"));

    await expect(
      useAuthStore.getState().setPreferredLanguage("fr"),
    ).rejects.toThrow("Something went wrong");

    const { user, isLoading } = useAuthStore.getState();
    // The store stays on English until the backend confirms.
    expect(user?.preferred_language).toBe("en");
    expect(isLoading).toBe(false);
  });
});
