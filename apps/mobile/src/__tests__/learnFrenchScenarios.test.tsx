/**
 * Tests for the Learn screen's handling of French scenarios (SN-020):
 * free French cards render unlocked and navigable, premium-gated French
 * cards show the lock overlay and open the SN-026 paywall instead of a
 * session, and a premium caller sees everything unlocked.
 */

const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  navigate: jest.fn(),
};

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: { View },
    Easing: { out: (easing: unknown) => easing, quad: (t: number) => t },
    useSharedValue: (value: number) => ({ value }),
    useAnimatedStyle: (
      builder: (shared: { value: number }) => Record<string, unknown>,
    ) => builder({ value: 0 }),
    withTiming: (value: number) => value,
    withDelay: (_delay: number, value: number) => value,
  };
});

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("lucide-react-native", () => ({
  CheckCircle2: () => null,
  ChevronRight: () => null,
  Lock: () => null,
  MessagesSquare: () => null,
  Target: () => null,
}));

jest.mock("../../src/components/PaywallModal", () => {
  const { Text } = require("react-native");
  return {
    PaywallModal: ({ visible }: { visible: boolean }) =>
      visible ? (
        <Text accessibilityLabel="Sonolo premium upgrade">paywall open</Text>
      ) : null,
  };
});

jest.mock("../../src/api/client", () => {
  const actual = jest.requireActual("../../src/api/client");
  return {
    ...actual,
    fetchScenarios: jest.fn(async () => []),
    fetchPacks: jest.fn(async () => []),
    fetchTodayQuests: jest.fn(async () => ({
      quest_date: "2026-08-24",
      timezone: "America/Toronto",
      quests: [],
    })),
  };
});

jest.mock("../../src/services/scenarioCache", () => ({
  loadScenarioCache: jest.fn(async () => null),
  saveScenarioCache: jest.fn(async () => undefined),
}));

import { fireEvent, render, waitFor } from "@testing-library/react-native";

import LearnScreen from "../../app/(tabs)/learn";
import { fetchScenarios } from "../../src/api/client";
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
    preferred_language: "fr" as const,
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

function frenchCatalog() {
  return [
    {
      id: "ramq-carte-sante-rendez-vous",
      title: "Prendre rendez-vous pour votre carte santé",
      description: "RAMQ",
      category: "healthcare",
      difficulty: 2,
      is_locked: false,
    },
    {
      id: "cegep-premium-fr",
      title: "Conseils cégep avancés",
      description: "Cégep",
      category: "education",
      difficulty: 3,
      is_locked: true,
    },
  ];
}

describe("Learn screen with French scenarios (SN-020)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function seedStores(
    subscription_tier: string,
    scenarios: ReturnType<typeof frenchCatalog>,
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
      language: "fr",
    });
  }

  it("renders free French scenarios unlocked", async () => {
    seedStores("free", frenchCatalog());

    const screen = render(<LearnScreen />);

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          "Start scenario: Prendre rendez-vous pour votre carte santé",
        ),
      ).toBeTruthy();
    });
  });

  it("locks premium French scenarios behind the paywall for free users", async () => {
    seedStores("free", frenchCatalog());

    const screen = render(<LearnScreen />);
    await waitFor(() => {
      expect(
        screen.getByLabelText("Premium scenario: Conseils cégep avancés"),
      ).toBeTruthy();
    });

    // The lock overlay marks the gated card...
    expect(screen.getByText("Premium")).toBeTruthy();
    // ...the catalog came straight from the store, no refetch...
    expect(fetchScenarios).not.toHaveBeenCalled();
    // ...and no session navigation happened implicitly.
    expect(mockRouter.push).not.toHaveBeenCalled();

    fireEvent.press(
      screen.getByLabelText("Premium scenario: Conseils cégep avancés"),
    );

    // Pressing opens the SN-026 paywall instead of a session route.
    await waitFor(() => {
      expect(screen.queryByLabelText("Sonolo premium upgrade")).toBeTruthy();
    });
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("opens sessions directly for premium callers regardless of language", async () => {
    seedStores("premium", frenchCatalog());

    const screen = render(<LearnScreen />);

    await waitFor(() => {
      expect(
        screen.getByLabelText("Start scenario: Conseils cégep avancés"),
      ).toBeTruthy();
    });
    expect(screen.queryByText("Premium")).toBeNull();
  });
});
