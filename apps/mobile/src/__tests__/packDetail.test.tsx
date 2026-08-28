/**
 * Tests for the Pack Detail screen (SN-039): the theme-colored hero
 * banner, the overlapping glass "Your Progress" card with the mock
 * completion state (first 3 free scenarios done), the scenario list
 * with level badges and status icons, and the bottom action that
 * resumes or starts the pack at the first available scenario.
 */

const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  navigate: jest.fn(),
  back: jest.fn(),
};

const mockParams = { id: "workplace-english-v1" };

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockParams,
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("lucide-react-native", () => ({
  CheckCircle2: () => null,
  Lock: () => null,
  Play: () => null,
}));

// The real vector Icon fetches glyph fonts at render time and throws
// under react-test-renderer, so render the glyph name as text.
jest.mock("@expo/vector-icons/Ionicons", () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => {
    const { Text } = require("react-native");
    return <Text>{`ionicon:${name}`}</Text>;
  },
}));

jest.mock("../../src/api/client", () => {
  const actual = jest.requireActual("../../src/api/client");
  return {
    ...actual,
    fetchScenarios: jest.fn(async () => []),
    fetchPacks: jest.fn(async () => []),
  };
});

jest.mock("../../src/services/scenarioCache", () => ({
  loadScenarioCache: jest.fn(async () => null),
  saveScenarioCache: jest.fn(async () => undefined),
}));

import { fireEvent, render, waitFor } from "@testing-library/react-native";

import PackDetailScreen from "../../app/pack/[id]";
import { fetchPacks } from "../../src/api/client";
import { useAuthStore } from "../../src/stores/authStore";
import { useScenarioStore } from "../../src/stores/scenarioStore";

function makeUser(subscription_tier: string) {
  return {
    id: "user-1",
    email: "pavan@example.com",
    name: "Pavan",
    native_language: "hi",
    target_language: "en-CA",
    learning_goal: "pr_readiness",
    current_level: "sprout",
    preferred_language: "en" as const,
    subscription_tier,
    streak_count: 0,
    streak_last_date: null,
    total_xp: 0,
    total_speaking_seconds: 0,
    onboarding_completed: true,
    created_at: "2026-08-24T12:00:00Z",
    skills: null,
  };
}

const workplacePack = {
  id: "workplace-english-v1",
  type: "scenarios",
  title: "Workplace English",
  description: "Meetings, interviews, and workplace confidence.",
  category: "workplace",
  language: "en",
  tier: "freemium",
  theme_color: "#FF8A00",
  icon: "briefcase",
  scenario_count: 6,
  premium_count: 2,
};

function workplaceScenarios() {
  return [
    {
      id: "work-s1",
      title: "Interview warm-up",
      description: "Work",
      category: "workplace",
      target_language: "en-CA",
      pack_id: "workplace-english-v1",
      difficulty: 1,
      is_locked: false,
    },
    {
      id: "work-s2",
      title: "Small talk at the water cooler",
      description: "Work",
      category: "workplace",
      target_language: "en-CA",
      pack_id: "workplace-english-v1",
      difficulty: 2,
      is_locked: false,
    },
    {
      id: "work-s3",
      title: "Performance review",
      description: "Work",
      category: "workplace",
      target_language: "en-CA",
      pack_id: "workplace-english-v1",
      difficulty: 3,
      is_locked: false,
    },
    {
      id: "work-s4",
      title: "Negotiating a raise",
      description: "Work",
      category: "workplace",
      target_language: "en-CA",
      pack_id: "workplace-english-v1",
      difficulty: 4,
      is_locked: false,
    },
    {
      id: "work-s5",
      title: "Leadership offsite",
      description: "Work",
      category: "workplace",
      target_language: "en-CA",
      pack_id: "workplace-english-v1",
      difficulty: 2,
      is_locked: true,
    },
    {
      id: "work-s6",
      title: "Executive presence",
      description: "Work",
      category: "workplace",
      target_language: "en-CA",
      pack_id: "workplace-english-v1",
      difficulty: 3,
      is_locked: true,
    },
  ];
}

function seedStores(
  subscription_tier: string,
  scenarios: ReturnType<typeof workplaceScenarios>,
) {
  useAuthStore.setState({
    user: makeUser(subscription_tier),
    token: "test-token",
    isLoading: false,
    isHydrated: true,
    isAuthenticated: true,
  });
  useScenarioStore.setState({
    scenarios,
    selected: scenarios[0],
    isLoading: false,
    error: null,
    isFromCache: false,
    // Matching language stops the mount effect from refetching.
    language: "en",
  });
}

describe("Pack detail screen (SN-039)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchPacks as jest.Mock).mockResolvedValue([workplacePack]);
  });

  it("renders the hero, progress card, and scenario rows", async () => {
    seedStores("free", workplaceScenarios());

    const screen = render(<PackDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText("Workplace English")).toBeTruthy();
    });

    // Hero banner: theme icon, title, description.
    expect(screen.getByText("ionicon:briefcase")).toBeTruthy();
    expect(
      screen.getByText("Meetings, interviews, and workplace confidence."),
    ).toBeTruthy();

    // Progress card: the first 3 free scenarios count as completed.
    expect(screen.getByText("Your Progress")).toBeTruthy();
    expect(screen.getByText("3 of 6 Scenarios Completed")).toBeTruthy();

    // Level badges derive from difficulty: sprout/branch/bloom.
    expect(screen.getAllByText("Sprout").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Branch").length).toBeGreaterThan(0);
    expect(screen.getByText("Bloom")).toBeTruthy();
  });

  it("marks completed, locked, and available scenarios with status icons", async () => {
    seedStores("free", workplaceScenarios());

    const screen = render(<PackDetailScreen />);

    await waitFor(() => {
      expect(
        screen.getByLabelText("Completed scenario: Interview warm-up"),
      ).toBeTruthy();
    });
    // First 3 free scenarios are done; the 4th free one is available.
    expect(
      screen.getByLabelText("Completed scenario: Small talk at the water cooler"),
    ).toBeTruthy();
    expect(
      screen.getByLabelText("Completed scenario: Performance review"),
    ).toBeTruthy();
    expect(
      screen.getByLabelText("Start scenario: Negotiating a raise"),
    ).toBeTruthy();
    // Premium scenarios carry the lock for free-tier callers.
    expect(
      screen.getByLabelText("Premium scenario: Leadership offsite"),
    ).toBeTruthy();
    expect(
      screen.getByLabelText("Premium scenario: Executive presence"),
    ).toBeTruthy();
  });

  it("shows Continue Learning and resumes at the first available scenario", async () => {
    seedStores("free", workplaceScenarios());

    const screen = render(<PackDetailScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText("Continue Learning")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Continue Learning"));
    expect(mockRouter.push).toHaveBeenCalledWith("/session/work-s1");
  });

  it("does not navigate when a locked scenario row is tapped", async () => {
    seedStores("free", workplaceScenarios());

    const screen = render(<PackDetailScreen />);
    await waitFor(() => {
      expect(
        screen.getByLabelText("Premium scenario: Leadership offsite"),
      ).toBeTruthy();
    });

    fireEvent.press(
      screen.getByLabelText("Premium scenario: Leadership offsite"),
    );
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("shows a disabled Start Pack for an all-premium pack", async () => {
    seedStores(
      "free",
      workplaceScenarios().filter((scenario) => scenario.is_locked),
    );

    const screen = render(<PackDetailScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText("Start Pack")).toBeTruthy();
    });
    expect(screen.getByText("0 of 2 Scenarios Completed")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Start Pack"));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
