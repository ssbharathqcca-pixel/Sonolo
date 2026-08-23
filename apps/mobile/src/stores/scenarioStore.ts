/**
 * Scenario catalog store (SN-015): the published scenarios from the
 * backend plus the one currently selected for the next voice session.
 */

import { create } from "zustand";

import {
  fetchScenarios,
  getApiErrorMessage,
  type Scenario,
} from "../api/client";

interface ScenarioState {
  scenarios: Scenario[];
  selected: Scenario | null;
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
  select: (scenario: Scenario) => void;
}

export const useScenarioStore = create<ScenarioState>()((set) => ({
  scenarios: [],
  selected: null,
  isLoading: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const scenarios = await fetchScenarios();
      set((state) => ({
        scenarios,
        selected: state.selected ?? scenarios[0] ?? null,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: getApiErrorMessage(error) });
    }
  },

  select: (scenario) => {
    set({ selected: scenario });
  },
}));
