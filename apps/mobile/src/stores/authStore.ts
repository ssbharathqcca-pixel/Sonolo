/**
 * Zustand store for authentication state.
 *
 * `login`/`register` call the API client, persist the token to the
 * device keychain via secureStorage, and mirror it into the client for
 * request interception. `hydrate` runs once at app start to restore the
 * session; the root layout holds a splash until it finishes. A 401 from
 * any endpoint logs the user out through the handler registered below.
 *
 * Onboarding state (SN-017) is tracked device-side: the backend has no
 * profile-write endpoint yet, so completion and the chosen goal are
 * stored in SecureStore. Server truth (`user.onboarding_completed`)
 * wins when it reports complete. Logout clears the local flags so the
 * next account on this device gets its own onboarding journey.
 */

import { create } from "zustand";

import {
  fetchCurrentUser,
  getApiErrorMessage,
  loginRequest,
  registerRequest,
  setAuthToken,
  setUnauthorizedHandler,
  upgradeAccountRequest,
  type RegisterPayload,
  type User,
} from "../api/client";
import { TOKEN_KEY, getItem, removeItem, setItem } from "../services/secureStorage";

/** Keychain key marking onboarding as finished (SN-017). */
export const ONBOARDING_KEY = "sonolo.onboarding_completed";
/** Keychain key holding the CLB-inspired goal id chosen during onboarding. */
export const TARGET_LEVEL_KEY = "sonolo.target_level";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  /** True once the SecureStore hydration pass has finished. */
  isHydrated: boolean;
  isAuthenticated: boolean;
  /** True when the onboarding flow has been completed (local or server). */
  onboardingCompleted: boolean;
  /** CLB-inspired goal id selected during onboarding, if any. */
  targetLevel: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  /** Flip the account to premium via the mock upgrade endpoint (SN-026). */
  upgradeAccount: () => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  /** Persist onboarding completion and the chosen goal device-side. */
  completeOnboarding: (targetLevel: string) => Promise<void>;
}

/** Merge local flags with server truth into one onboarding snapshot. */
async function resolveOnboarding(user: User): Promise<{
  completed: boolean;
  level: string | null;
}> {
  const [completedRaw, storedLevel] = await Promise.all([
    getItem(ONBOARDING_KEY),
    getItem(TARGET_LEVEL_KEY),
  ]);
  return {
    completed: completedRaw === "true" || user.onboarding_completed === true,
    level: storedLevel,
  };
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isHydrated: false,
  isAuthenticated: false,
  onboardingCompleted: false,
  targetLevel: null,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { access_token } = await loginRequest(email, password);
      await setItem(TOKEN_KEY, access_token);
      setAuthToken(access_token);
      const user = await fetchCurrentUser();
      const onboarding = await resolveOnboarding(user);
      set({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
        ...onboarding,
      });
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
      const user = await fetchCurrentUser();
      const onboarding = await resolveOnboarding(user);
      set({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
        ...onboarding,
      });
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

  logout: async () => {
    setAuthToken(null);
    await removeItem(TOKEN_KEY);
    // Onboarding is per-account; drop local flags with the session.
    await removeItem(ONBOARDING_KEY);
    await removeItem(TARGET_LEVEL_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      onboardingCompleted: false,
      targetLevel: null,
    });
  },

  hydrate: async () => {
    if (get().isHydrated) {
      return;
    }
    const [token, completedRaw, storedLevel] = await Promise.all([
      getItem(TOKEN_KEY),
      getItem(ONBOARDING_KEY),
      getItem(TARGET_LEVEL_KEY),
    ]);
    if (token === null) {
      set({
        isHydrated: true,
        onboardingCompleted: completedRaw === "true",
        targetLevel: storedLevel,
      });
      return;
    }
    setAuthToken(token);
    set({ isLoading: true });
    try {
      const user = await fetchCurrentUser();
      set({
        user,
        token,
        isAuthenticated: true,
        isHydrated: true,
        isLoading: false,
        onboardingCompleted: completedRaw === "true" || user.onboarding_completed === true,
        targetLevel: storedLevel,
      });
    } catch {
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
        targetLevel: storedLevel,
      });
    }
  },

  completeOnboarding: async (targetLevel) => {
    await setItem(ONBOARDING_KEY, "true");
    await setItem(TARGET_LEVEL_KEY, targetLevel);
    set({ onboardingCompleted: true, targetLevel });
  },
}));

setUnauthorizedHandler(() => {
  void useAuthStore.getState().logout();
});
