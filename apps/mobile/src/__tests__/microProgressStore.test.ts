/**
 * Tests for the Culture Corner progress store (SN-047): completion
 * persists to AsyncStorage, hydrate restores it after a relaunch, and
 * markDone is idempotent (no duplicate ids in the persisted set).
 */

jest.mock("@react-native-async-storage/async-storage", () => {
  const store: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key: string) => store[key] ?? null),
      setItem: jest.fn(async (key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn(async (key: string) => {
        delete store[key];
      }),
      clear: jest.fn(async () => {
        Object.keys(store).forEach((key) => delete store[key]);
      }),
    },
  };
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MICRO_PROGRESS_KEY,
  useMicroProgressStore,
} from "../stores/microProgressStore";

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

describe("microProgressStore (SN-047)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    useMicroProgressStore.setState({
      completedMicrolessonIds: [],
      isHydrated: false,
    });
  });

  it("starts with no completed lessons and unhydrated", () => {
    const state = useMicroProgressStore.getState();
    expect(state.completedMicrolessonIds).toEqual([]);
    expect(state.isHydrated).toBe(false);
    expect(state.isDone("micro-weather-is-love")).toBe(false);
  });

  it("markDone adds the id and persists the JSON array", async () => {
    await useMicroProgressStore.getState().markDone("micro-weather-is-love");

    expect(useMicroProgressStore.getState().isDone("micro-weather-is-love")).toBe(
      true,
    );
    expect(mockSetItem).toHaveBeenCalledWith(
      MICRO_PROGRESS_KEY,
      JSON.stringify(["micro-weather-is-love"]),
    );
  });

  it("markDone is idempotent and never duplicates ids", async () => {
    const store = useMicroProgressStore.getState();
    await store.markDone("micro-sorry-social-lubricant");
    await useMicroProgressStore.getState().markDone("micro-sorry-social-lubricant");

    expect(
      useMicroProgressStore.getState().completedMicrolessonIds,
    ).toEqual(["micro-sorry-social-lubricant"]);
    expect(mockSetItem).toHaveBeenLastCalledWith(
      MICRO_PROGRESS_KEY,
      JSON.stringify(["micro-sorry-social-lubricant"]),
    );
  });

  it("hydrate restores the persisted completed set", async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify(["micro-hockey-civic-religion", "micro-tipping-math"]),
    );

    await useMicroProgressStore.getState().hydrate();

    const state = useMicroProgressStore.getState();
    expect(state.isHydrated).toBe(true);
    expect(state.completedMicrolessonIds).toEqual([
      "micro-hockey-civic-religion",
      "micro-tipping-math",
    ]);
    expect(state.isDone("micro-hockey-civic-religion")).toBe(true);
  });

  it("hydrate with no stored data yields an empty set", async () => {
    await useMicroProgressStore.getState().hydrate();

    const state = useMicroProgressStore.getState();
    expect(state.isHydrated).toBe(true);
    expect(state.completedMicrolessonIds).toEqual([]);
  });

  it("hydrate ignores corrupted storage instead of crashing", async () => {
    mockGetItem.mockResolvedValue("not-json-at-all");

    await useMicroProgressStore.getState().hydrate();

    const state = useMicroProgressStore.getState();
    expect(state.isHydrated).toBe(true);
    expect(state.completedMicrolessonIds).toEqual([]);
  });
});
