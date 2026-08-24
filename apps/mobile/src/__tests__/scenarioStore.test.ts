/**
 * Tests for the scenario catalog store (SN-020): fetches pass the
 * requested language to the API, the cache is language-aware, and a
 * stale selection never survives a language switch.
 */

jest.mock("../api/client", () => {
  const actual = jest.requireActual("../api/client");
  return {
    ...actual,
    fetchScenarios: jest.fn(),
  };
});

jest.mock("../services/scenarioCache", () => ({
  loadScenarioCache: jest.fn(async () => null),
  saveScenarioCache: jest.fn(async () => undefined),
}));

import { fetchScenarios, type Scenario } from "../api/client";
import { loadScenarioCache, saveScenarioCache } from "../services/scenarioCache";
import { useScenarioStore } from "../stores/scenarioStore";

const mockFetch = fetchScenarios as jest.Mock;
const mockLoadCache = loadScenarioCache as jest.Mock;

function scenario(id: string, overrides: Partial<Scenario> = {}): Scenario {
  return {
    id,
    title: `Scenario ${id}`,
    description: "desc",
    category: "housing",
    difficulty: 2,
    ...overrides,
  };
}

const ENGLISH_CATALOG = [
  scenario("en-1"),
  scenario("en-2"),
];

const FRENCH_CATALOG = [
  scenario("fr-1", { title: "Prendre rendez-vous à la RAMQ" }),
  scenario("fr-2", { title: "Pneus d'hiver chez le garagiste" }),
];

describe("scenarioStore.load with language (SN-020)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useScenarioStore.setState({
      scenarios: [],
      selected: null,
      isLoading: false,
      error: null,
      isFromCache: false,
      language: null,
    });
  });

  it("passes the language parameter to the API request", async () => {
    mockFetch.mockResolvedValueOnce(FRENCH_CATALOG);

    await useScenarioStore.getState().load("fr");

    expect(mockFetch).toHaveBeenCalledWith("fr");
    const state = useScenarioStore.getState();
    expect(state.language).toBe("fr");
    expect(state.scenarios.map((s) => s.id)).toEqual(["fr-1", "fr-2"]);
    expect(state.isFromCache).toBe(false);
  });

  it("defaults to English when no language is given", async () => {
    mockFetch.mockResolvedValueOnce(ENGLISH_CATALOG);

    await useScenarioStore.getState().load();

    expect(mockFetch).toHaveBeenCalledWith("en");
  });

  it("caches successful fetches tagged with the language", async () => {
    mockFetch.mockResolvedValueOnce(FRENCH_CATALOG);

    await useScenarioStore.getState().load("fr");

    expect(saveScenarioCache).toHaveBeenCalledWith(FRENCH_CATALOG, "fr");
  });

  it("falls back only to a cache matching the requested language", async () => {
    mockFetch.mockRejectedValueOnce(new Error("offline"));
    // Behave like the real cache: an English catalog is useless for fr.
    mockLoadCache.mockImplementationOnce(async (language: string) =>
      language === "en" ? ENGLISH_CATALOG : null,
    );

    await useScenarioStore.getState().load("fr");

    expect(mockLoadCache).toHaveBeenCalledWith("fr");
    const state = useScenarioStore.getState();
    expect(state.scenarios).toEqual([]);
    expect(state.error).toBeTruthy();
  });

  it("hydrates from the cache when the cached language matches", async () => {
    mockFetch.mockRejectedValueOnce(new Error("offline"));
    mockLoadCache.mockResolvedValueOnce(FRENCH_CATALOG);

    await useScenarioStore.getState().load("fr");

    const state = useScenarioStore.getState();
    expect(state.isFromCache).toBe(true);
    expect(state.error).toBeNull();
    expect(state.scenarios.map((s) => s.id)).toEqual(["fr-1", "fr-2"]);
  });

  it("drops the previous selection if it is not in the new catalog", async () => {
    mockFetch.mockResolvedValueOnce(ENGLISH_CATALOG);
    await useScenarioStore.getState().load("en");
    useScenarioStore.getState().select(scenario("en-2"));

    mockFetch.mockResolvedValueOnce(FRENCH_CATALOG);
    await useScenarioStore.getState().load("fr");

    const state = useScenarioStore.getState();
    expect(state.selected?.id).toBe("fr-1");
  });

  it("keeps the selection across refetches within one language", async () => {
    mockFetch.mockResolvedValueOnce(ENGLISH_CATALOG);
    await useScenarioStore.getState().load("en");
    useScenarioStore.getState().select(scenario("en-2"));

    mockFetch.mockResolvedValueOnce([...ENGLISH_CATALOG]);
    await useScenarioStore.getState().load("en");

    expect(useScenarioStore.getState().selected?.id).toBe("en-2");
  });
});
