/**
 * Tests for the auth store's entitlement tracking (SN-041): login
 * fetches server-side entitlements, refreshEntitlements stores the
 * backend response (and degrades silently offline), and logout clears
 * them with the rest of the session.
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
    loginRequest: jest.fn(),
    registerRequest: jest.fn(),
    fetchCurrentUser: jest.fn(),
    fetchEntitlements: jest.fn(),
  };
});

import {
  fetchCurrentUser,
  fetchEntitlements,
  loginRequest,
  type User,
} from "../api/client";
import { useAuthStore } from "../stores/authStore";

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

const FREE_ENTITLEMENTS = {
  tier: "free",
  premium_scenario_ids: [],
  expires_at: null,
};

const PREMIUM_ENTITLEMENTS = {
  tier: "premium",
  premium_scenario_ids: ["tenant-insurance-quote-call"],
  expires_at: null,
};

/** Flush the fire-and-forget entitlement fetch kicked off by login. */
function flush(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

describe("authStore entitlements (SN-041)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      isHydrated: true,
      isAuthenticated: false,
      onboardingCompleted: false,
      onboardingGoal: null,
      entitlements: null,
    });
  });

  it("fetches entitlements after a successful login", async () => {
    (loginRequest as jest.Mock).mockResolvedValue({
      access_token: "tok",
      token_type: "bearer",
    });
    (fetchCurrentUser as jest.Mock).mockResolvedValue(baseUser("en"));
    (fetchEntitlements as jest.Mock).mockResolvedValue(FREE_ENTITLEMENTS);

    await useAuthStore.getState().login("pavan@example.com", "maple-syrup-99");
    await flush();

    expect(fetchEntitlements).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().entitlements).toEqual(FREE_ENTITLEMENTS);
  });

  it("refreshEntitlements stores the backend response", async () => {
    (fetchEntitlements as jest.Mock).mockResolvedValue(PREMIUM_ENTITLEMENTS);

    await useAuthStore.getState().refreshEntitlements();

    expect(useAuthStore.getState().entitlements).toEqual(PREMIUM_ENTITLEMENTS);
  });

  it("keeps the last known entitlements when a refresh fails offline", async () => {
    (fetchEntitlements as jest.Mock).mockResolvedValueOnce(PREMIUM_ENTITLEMENTS);
    await useAuthStore.getState().refreshEntitlements();

    (fetchEntitlements as jest.Mock).mockRejectedValueOnce(
      new Error("network down"),
    );
    await useAuthStore.getState().refreshEntitlements();

    expect(useAuthStore.getState().entitlements).toEqual(PREMIUM_ENTITLEMENTS);
  });

  it("clears entitlements on logout", async () => {
    (fetchEntitlements as jest.Mock).mockResolvedValue(PREMIUM_ENTITLEMENTS);
    await useAuthStore.getState().refreshEntitlements();
    expect(useAuthStore.getState().entitlements).toEqual(PREMIUM_ENTITLEMENTS);

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().entitlements).toBeNull();
  });
});
