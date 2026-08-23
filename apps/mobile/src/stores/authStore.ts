/**
 * Zustand store for authentication state.
 *
 * `login`/`register` call the API client, persist the token to the
 * device keychain via secureStorage, and mirror it into the client for
 * request interception. `hydrate` runs once at app start to restore the
 * session; the root layout holds a splash until it finishes. A 401 from
 * any endpoint logs the user out through the handler registered below.
 */

import { create } from "zustand";

import {
  fetchCurrentUser,
  getApiErrorMessage,
  loginRequest,
  registerRequest,
  setAuthToken,
  setUnauthorizedHandler,
  type RegisterPayload,
  type User,
} from "../api/client";
import { TOKEN_KEY, getItem, removeItem, setItem } from "../services/secureStorage";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  /** True once the SecureStore hydration pass has finished. */
  isHydrated: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isHydrated: false,
  isAuthenticated: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { access_token } = await loginRequest(email, password);
      await setItem(TOKEN_KEY, access_token);
      setAuthToken(access_token);
      const user = await fetchCurrentUser();
      set({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
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
      set({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw new Error(getApiErrorMessage(error));
    }
  },

  logout: async () => {
    setAuthToken(null);
    await removeItem(TOKEN_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: async () => {
    if (get().isHydrated) {
      return;
    }
    const token = await getItem(TOKEN_KEY);
    if (token === null) {
      set({ isHydrated: true });
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
      });
    }
  },
}));

setUnauthorizedHandler(() => {
  void useAuthStore.getState().logout();
});
