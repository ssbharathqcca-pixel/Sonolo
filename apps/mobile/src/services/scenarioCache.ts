import * as SecureStore from 'expo-secure-store';
import type { PreferredLanguage, Scenario } from '../api/client';

type CachedPayload = {
  version: string;
  timestamp: number;
  /**
   * Language the catalog was fetched for (SN-020). Older caches predate
   * this field; those were English-only catalogs, so a missing value is
   * treated as "en".
   */
  language?: PreferredLanguage;
  data: Scenario[];
};

const CACHE_KEY = 'sonolo_scenarios_catalog';
const CATALOG_VERSION = '2.0.0';

function cachedLanguageMatches(
  parsed: CachedPayload,
  language: PreferredLanguage,
): boolean {
  return (parsed.language ?? 'en') === language;
}

export async function getScenarios(fetchFromNetwork: () => Promise<Scenario[]>): Promise<Scenario[]> {
  try {
    const cachedJson = await SecureStore.getItemAsync(CACHE_KEY);
    if (cachedJson) {
      const parsed: CachedPayload = JSON.parse(cachedJson);
      if (parsed.version === CATALOG_VERSION) {
        return parsed.data;
      }
    }
  } catch (error) {
    console.warn('[ScenarioCache] Read failed, falling back to network', error);
  }

  const data = await fetchFromNetwork();
  
  const payload: CachedPayload = {
    version: CATALOG_VERSION,
    timestamp: Date.now(),
    data,
  };

  try {
    await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('[ScenarioCache] Write failed', error);
  }

  return data;
}

export async function invalidateScenarioCache(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(CACHE_KEY);
  } catch (error) {
    console.warn('[ScenarioCache] Invalidation failed', error);
  }
}

// --- Backwards compatibility for scenarioStore.ts ---
export async function loadScenarioCache(
  language: PreferredLanguage = 'en',
): Promise<Scenario[] | null> {
  try {
    const cachedJson = await SecureStore.getItemAsync(CACHE_KEY);
    if (cachedJson) {
      const parsed: CachedPayload = JSON.parse(cachedJson);
      if (
        parsed.version === CATALOG_VERSION &&
        cachedLanguageMatches(parsed, language)
      ) {
        return parsed.data;
      }
    }
  } catch (error) {
    console.warn('[ScenarioCache] Load failed', error);
  }
  return null;
}

export async function saveScenarioCache(
  data: Scenario[],
  language: PreferredLanguage = 'en',
): Promise<void> {
  const payload: CachedPayload = {
    version: CATALOG_VERSION,
    timestamp: Date.now(),
    language,
    data,
  };
  try {
    await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('[ScenarioCache] Save failed', error);
  }
}