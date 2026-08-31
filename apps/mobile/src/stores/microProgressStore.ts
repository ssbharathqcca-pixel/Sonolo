/**
 * Culture Corner reading progress store (SN-047): which micro-lessons
 * the user has marked as done. Progress is device-local (AsyncStorage),
 * mirroring the authStore hydration pattern — `hydrate` runs once at
 * app start and the root Learn screen holds its rail until the flag
 * flips, so a completed lesson never un-checks after a relaunch.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

/** AsyncStorage key holding the JSON array of completed lesson ids. */
export const MICRO_PROGRESS_KEY = "sonolo.micro_progress";

interface MicroProgressState {
  completedMicrolessonIds: string[];
  /** True once the AsyncStorage hydration pass has finished. */
  isHydrated: boolean;
  /** Restore the completed set from AsyncStorage (idempotent). */
  hydrate: () => Promise<void>;
  /** Persist a lesson as done (idempotent — no duplicate ids). */
  markDone: (id: string) => Promise<void>;
  /** True when the lesson id is in the completed set. */
  isDone: (id: string) => boolean;
}

function parseCompleted(raw: string | null): string[] {
  if (raw === null) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export const useMicroProgressStore = create<MicroProgressState>()(
  (set, get) => ({
    completedMicrolessonIds: [],
    isHydrated: false,

    hydrate: async () => {
      if (get().isHydrated) {
        return;
      }
      let completed: string[] = [];
      try {
        completed = parseCompleted(await AsyncStorage.getItem(MICRO_PROGRESS_KEY));
      } catch {
        // Storage read failure keeps the in-memory empty set; the app
        // stays fully usable, completion just won't persist this run.
      }
      set({ completedMicrolessonIds: completed, isHydrated: true });
    },

    markDone: async (id) => {
      const next = get().completedMicrolessonIds.includes(id)
        ? get().completedMicrolessonIds
        : [...get().completedMicrolessonIds, id];
      set({ completedMicrolessonIds: next });
      try {
        await AsyncStorage.setItem(MICRO_PROGRESS_KEY, JSON.stringify(next));
      } catch {
        // Best-effort persistence; in-memory state stays correct.
      }
    },

    isDone: (id) => get().completedMicrolessonIds.includes(id),
  }),
);
