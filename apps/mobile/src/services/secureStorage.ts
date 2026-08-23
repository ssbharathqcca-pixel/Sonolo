/**
 * Thin, error-tolerant wrapper around expo-secure-store.
 *
 * Secrets (the JWT) live in the device keychain — never AsyncStorage.
 * Failures are logged and surfaced as return values instead of crashes:
 * a failed read is treated as "no token" (the user simply logs in again),
 * which is always a safe state.
 */

import * as SecureStore from "expo-secure-store";

/** Keychain key for the Sonolo access token. */
export const TOKEN_KEY = "sonolo.access_token";

export async function setItem(key: string, value: string): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch (error) {
    console.warn(`[secureStorage] Failed to save "${key}":`, error);
    return false;
  }
}

export async function getItem(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.warn(`[secureStorage] Failed to read "${key}":`, error);
    return null;
  }
}

export async function removeItem(key: string): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (error) {
    console.warn(`[secureStorage] Failed to delete "${key}":`, error);
    return false;
  }
}
