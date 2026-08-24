/**
 * On-device cache for the published scenario catalog (SN-017).
 *
 * The catalog changes rarely, so the last successful GET /api/scenarios
 * payload is persisted to a JSON file in the app's documents directory.
 * When the backend is unreachable, Home and Learn hydrate from this
 * file instead of showing an empty state. Every failure degrades
 * silently to "no cache" — caching must never break the happy path.
 */

import * as FileSystem from "expo-file-system";

import type { Scenario } from "../api/client";

const CACHE_FILE = "sonolo-scenarios-cache.json";

function cacheUri(): string {
  return `${FileSystem.documentDirectory ?? ""}${CACHE_FILE}`;
}

function isValidCatalog(value: unknown): value is Scenario[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Scenario).id === "string" &&
        typeof (item as Scenario).title === "string",
    )
  );
}

/** Persist the catalog; resolves false when storage fails (never throws). */
export async function saveScenarioCache(scenarios: Scenario[]): Promise<boolean> {
  try {
    await FileSystem.writeAsStringAsync(cacheUri(), JSON.stringify(scenarios), {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return true;
  } catch (error) {
    console.warn("[scenarioCache] Failed to persist scenarios:", error);
    return false;
  }
}

/**
 * Load the cached catalog; resolves null when absent or corrupt
 * (never throws).
 */
export async function loadScenarioCache(): Promise<Scenario[] | null> {
  try {
    const info = await FileSystem.getInfoAsync(cacheUri());
    if (!info.exists) {
      return null;
    }
    const raw = await FileSystem.readAsStringAsync(cacheUri(), {
      encoding: FileSystem.EncodingType.UTF8,
    });
    const parsed: unknown = JSON.parse(raw);
    return isValidCatalog(parsed) ? parsed : null;
  } catch (error) {
    console.warn("[scenarioCache] Failed to load scenarios:", error);
    return null;
  }
}
