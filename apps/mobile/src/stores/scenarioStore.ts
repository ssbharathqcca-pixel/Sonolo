/**
 * Scenario catalog store (SN-015, offline-resilient since SN-017):
 * the published scenarios from the backend plus the one currently
 * selected for the next voice session. The last successful fetch is
 * persisted on-device per language (SN-020); when the backend is
 * unreachable, the catalog hydrates from that cache so Home and Learn
 * still render — but never in the wrong language.
 */

import { create } from "zustand";

import {
  fetchScenarios,
  getApiErrorMessage,
  type PreferredLanguage,
  type Scenario,
} from "../api/client";
import {
  loadScenarioCache,
  saveScenarioCache,
} from "../services/scenarioCache";

interface ScenarioState {
  scenarios: Scenario[];
  selected: Scenario | null;
  isLoading: boolean;
  error: string | null;
  /** True when `scenarios` came from the on-device cache, not the API. */
  isFromCache: boolean;
  /** Language the current catalog belongs to (null until first load). */
  language: PreferredLanguage | null;
  load: (language?: PreferredLanguage) => Promise<void>;
  select: (scenario: Scenario) => void;
}

export const useScenarioStore = create<ScenarioState>()((set) => ({
  scenarios: [],
  selected: null,
  isLoading: false,
  error: null,
  isFromCache: false,
  language: null,

  load: async (language = "en") => {
    set({ isLoading: true, error: null });
    try {
      const scenarios = await fetchScenarios(language);
      void saveScenarioCache(scenarios, language);
      set((state) => ({
        scenarios,
        // Keep a selection only if it survived the catalog switch.
        selected:
          state.selected &&
          scenarios.some((scenario) => scenario.id === state.selected?.id)
            ? state.selected
            : scenarios[0] ?? null,
        isLoading: false,
        isFromCache: false,
        language,
      }));
    } catch (error) {
      const cached = await loadScenarioCache(language);
      if (cached !== null && cached.length > 0) {
        set((state) => ({
          scenarios: cached,
          selected:
            state.selected &&
            cached.some((scenario) => scenario.id === state.selected?.id)
              ? state.selected
              : cached[0] ?? null,
          isLoading: false,
          isFromCache: true,
          error: null,
          language,
        }));
        return;
      }
      set({ isLoading: false, error: getApiErrorMessage(error) });
    }
  },

  select: (scenario) => {
    set({ selected: scenario });
  },
}));
