/**
 * Scenario catalog store (SN-015, offline-resilient since SN-017):
 * the published scenarios from the backend plus the one currently
 * selected for the next voice session. The last successful fetch is
 * persisted on-device; when the backend is unreachable, the catalog
 * hydrates from that cache so Home and Learn still render.
 */

import { create } from "zustand";

import {
  fetchScenarios,
  getApiErrorMessage,
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
  load: () => Promise<void>;
  select: (scenario: Scenario) => void;
}

export const useScenarioStore = create<ScenarioState>()((set) => ({
  scenarios: [],
  selected: null,
  isLoading: false,
  error: null,
  isFromCache: false,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const scenarios = await fetchScenarios();
      void saveScenarioCache(scenarios);
      set((state) => ({
        scenarios,
        selected: state.selected ?? scenarios[0] ?? null,
        isLoading: false,
        isFromCache: false,
      }));
    } catch (error) {
      const cached = await loadScenarioCache();
      if (cached !== null && cached.length > 0) {
        set((state) => ({
          scenarios: cached,
          selected: state.selected ?? cached[0] ?? null,
          isLoading: false,
          isFromCache: true,
          error: null,
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
