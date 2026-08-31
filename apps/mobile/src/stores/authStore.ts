/**
 * Zustand store for authentication state.
 *
 * `login`/`register` call the API client, persist the token to the
 * device keychain via secureStorage, and mirror it into the client for
 * request interception. `hydrate` runs once at app start to restore the
 * session; the root layout holds a splash until it finishes. A 401 from
 * any endpoint logs the user out through the handler registered below.
 *
 * Onboarding state (SN-017, reworked SN-040) is tracked device-side:
 * the backend has no profile-write endpoint yet, so completion and the
 * chosen goal are stored in SecureStore. Server truth
 * (`user.onboarding_completed`) wins when it reports complete. Logout
 * clears the local flags so the next account on this device gets its
 * own onboarding journey.
 */

import { create } from "zustand";

import {
  fetchCurrentUser,
  fetchEntitlements,
  getApiErrorMessage,
  loginRequest,
  registerRequest,
  setAuthToken,
  setUnauthorizedHandler,
  updatePreferredLanguage,
  upgradeAccountRequest,
  type Entitlements,
  type PreferredLanguage,
  type RegisterPayload,
  type User,
} from "../api/client";
import { TOKEN_KEY, getItem, removeItem, setItem } from "../services/secureStorage";

/** Keychain key marking onboarding as finished (SN-017). */
export const ONBOARDING_KEY = "sonolo.onboarding_completed";
/** Keychain key holding the onboarding goal id chosen during onboarding (SN-040). */
export const ONBOARDING_GOAL_KEY = "sonolo.onboarding_goal";
/** Keychain key holding language chosen before authentication (SN-049.5). */
export const PENDING_PREFERRED_LANGUAGE_KEY = "sonolo.pending_preferred_language";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  /** True once the SecureStore hydration pass has finished. */
  isHydrated: boolean;
  isAuthenticated: boolean;
  /** True when the onboarding flow has been completed (local or server). */
  onboardingCompleted: boolean;
  /** Onboarding goal id (career/health/housing/settlement) chosen during onboarding. */
  onboardingGoal: string | null;
  /** Pending preferred language chosen before logging in or registering. */
  pendingPreferredLanguage: PreferredLanguage | null;
  /** Server-side premium entitlements (SN-041); null until first fetch. */
  entitlements: Entitlements | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  /** Flip the account to premium via the mock upgrade endpoint (SN-026). */
  upgradeAccount: () => Promise<void>;
  /**
   * Persist the content language on the backend (SN-020) and mirror it
   * into the local user. Throws (with a user-facing message) on failure
   * so callers can surface an error without losing the old preference.
   */
  setPreferredLanguage: (language: PreferredLanguage) => Promise<void>;
  /** Persist the chosen language locally before authentication. */
  setPendingPreferredLanguage: (language: PreferredLanguage) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  /** Persist the chosen onboarding goal device-side without completing onboarding. */
  setOnboardingGoal: (goal: string) => Promise<void>;
  /** Persist onboarding completion (and any pending goal) device-side. */
  completeOnboarding: () => Promise<void>;
  /** Refresh premium entitlements from the backend (best-effort). */
  refreshEntitlements: () => Promise<void>;
}

/** Merge local flags with server truth into one onboarding snapshot. */
async function resolveOnboarding(user: User): Promise<{
  completed: boolean;
  goal: string | null;
}> {
  const [completedRaw, storedGoal] = await Promise.all([
    getItem(ONBOARDING_KEY),
    getItem(ONBOARDING_GOAL_KEY),
  ]);
  return {
    completed: completedRaw === "true" || user.onboarding_completed === true,
    goal: storedGoal,
  };
}

/**
 * If the user selected a preferred language before authenticating,
 * sync it to the backend once authenticated and delete the pending key (SN-049.5).
 */
async function applyPendingLanguage(user: User): Promise<User> {
  const pending = await getItem(PENDING_PREFERRED_LANGUAGE_KEY);
  if (pending === "en" || pending === "fr") {
    if (pending !== user.preferred_language) {
      try {
        const updatedUser = await updatePreferredLanguage(pending);
        await removeItem(PENDING_PREFERRED_LANGUAGE_KEY);
        return updatedUser;
      } catch {
        // Non-fatal: keep local choice, no error UI.
        await removeItem(PENDING_PREFERRED_LANGUAGE_KEY);
        return { ...user, preferred_language: pending };
      }
    } else {
      await removeItem(PENDING_PREFERRED_LANGUAGE_KEY);
    }
  }
  return user;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isHydrated: false,
  isAuthenticated: false,
  onboardingCompleted: false,
  onboardingGoal: null,
  pendingPreferredLanguage: null,
  entitlements: null,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { access_token } = await loginRequest(email, password);
      await setItem(TOKEN_KEY, access_token);
      setAuthToken(access_token);
      let user = await fetchCurrentUser();
      user = await applyPendingLanguage(user);
      const onboarding = await resolveOnboarding(user);
      set({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
        pendingPreferredLanguage: null,
        ...onboarding,
      });
      void get().refreshEntitlements();
    } catch (error) {
      set({ isLoading: false });
      throw new Error(getApiErrorMessage(error));
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      await registerRequest(payload);
      const { access_token } = await loginRequest(
        payload.email,
        payload.password,
      );
      await setItem(TOKEN_KEY, access_token);
      setAuthToken(access_token);
      let user = await fetchCurrentUser();
      user = await applyPendingLanguage(user);
      const onboarding = await resolveOnboarding(user);
      set({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
        pendingPreferredLanguage: null,
        ...onboarding,
      });
      void get().refreshEntitlements();
    } catch (error) {
      set({ isLoading: false });
      throw new Error(getApiErrorMessage(error));
    }
  },

  upgradeAccount: async () => {
    set({ isLoading: true });
    try {
      const user = await upgradeAccountRequest();
      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw new Error(getApiErrorMessage(error));
    }
  },

  setPreferredLanguage: async (language) => {
    const previousUser = get().user;
    set({ isLoading: true });
    try {
      const user = await updatePreferredLanguage(language);
      set({ user, isLoading: false });
    } catch (error) {
      // Keep the previous profile so the UI stays on the old language.
      set({ user: previousUser, isLoading: false });
      throw new Error(getApiErrorMessage(error));
    }
  },

  setPendingPreferredLanguage: async (language) => {
    await setItem(PENDING_PREFERRED_LANGUAGE_KEY, language);
    set({ pendingPreferredLanguage: language });
  },

  logout: async () => {
    setAuthToken(null);
    await removeItem(TOKEN_KEY);
    // Onboarding is per-account; drop local flags with the session.
    await removeItem(ONBOARDING_KEY);
    await removeItem(ONBOARDING_GOAL_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      onboardingCompleted: false,
      onboardingGoal: null,
      entitlements: null,
    });
  },

  hydrate: async () => {
    if (get().isHydrated) {
      return;
    }
    const [token, completedRaw, storedGoal, storedPendingLang] = await Promise.all([
      getItem(TOKEN_KEY),
      getItem(ONBOARDING_KEY),
      getItem(ONBOARDING_GOAL_KEY),
      getItem(PENDING_PREFERRED_LANGUAGE_KEY),
    ]);
    const pendingPreferredLanguage =
      storedPendingLang === "en" || storedPendingLang === "fr"
        ? storedPendingLang
        : null;

    if (token === null) {
      set({
        isHydrated: true,
        onboardingCompleted: completedRaw === "true",
        onboardingGoal: storedGoal,
        pendingPreferredLanguage,
      });
      return;
    }
    setAuthToken(token);
    set({ isLoading: true });
    try {
      let user = await fetchCurrentUser();
      user = await applyPendingLanguage(user);
      set({
        user,
        token,
        isAuthenticated: true,
        isHydrated: true,
        isLoading: false,
        onboardingCompleted: completedRaw === "true" || user.onboarding_completed === true,
        onboardingGoal: storedGoal,
        pendingPreferredLanguage: null,
      });
      void get().refreshEntitlements();
    } catch (error) {
      const is401 =
        (error as { response?: { status?: number } })?.response?.status === 401;

      if (is401) {
        // Token expired or revoked — clear it and require a fresh login.
        setAuthToken(null);
        await removeItem(TOKEN_KEY);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isHydrated: true,
          isLoading: false,
          onboardingCompleted: completedRaw === "true",
          onboardingGoal: storedGoal,
          pendingPreferredLanguage,
        });
      } else {
        // Non-401 error (network failure, 5xx):
        // KEEP the token in SecureStore. Never destroy credentials due to a momentary outage.
        set({
          user: null,
          token,
          isAuthenticated: false,
          isHydrated: true,
          isLoading: false,
          onboardingCompleted: completedRaw === "true",
          onboardingGoal: storedGoal,
          pendingPreferredLanguage,
        });
      }
    }
  },

  setOnboardingGoal: async (goal) => {
    await setItem(ONBOARDING_GOAL_KEY, goal);
    set({ onboardingGoal: goal });
  },

  refreshEntitlements: async () => {
    try {
      const entitlements = await fetchEntitlements();
      set({ entitlements });
    } catch {
      // Entitlements are supplementary; a failed refresh keeps the
      // last known state so access never hard-fails offline.
    }
  },

  completeOnboarding: async () => {
    // The goal is usually persisted already by setOnboardingGoal; write
    // it again if the user jumped straight to the final step.
    const goal = get().onboardingGoal;
    await setItem(ONBOARDING_KEY, "true");
    if (goal !== null) {
      await setItem(ONBOARDING_GOAL_KEY, goal);
    }
    set({ onboardingCompleted: true });
  },
}));

setUnauthorizedHandler(() => {
  const { token, isAuthenticated } = useAuthStore.getState();
  if (token !== null || isAuthenticated) {
    void useAuthStore.getState().logout();
  }
});
