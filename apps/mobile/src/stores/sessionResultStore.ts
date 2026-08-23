/**
 * Holds the most recent session-completion result (SN-015) so the
 * Feedback screen can render real gamification data without stuffing
 * large objects into route params (strings only in Expo Router).
 */

import { create } from "zustand";

import type { SessionCompleteResponse } from "../api/client";

interface SessionResultState {
  lastResult: SessionCompleteResponse | null;
  setLastResult: (result: SessionCompleteResponse) => void;
  clear: () => void;
}

export const useSessionResultStore = create<SessionResultState>()((set) => ({
  lastResult: null,
  setLastResult: (result) => {
    set({ lastResult: result });
  },
  clear: () => {
    set({ lastResult: null });
  },
}));
