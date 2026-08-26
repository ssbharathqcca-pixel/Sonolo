/**
 * Home screen gating tests (SN-035): locked premium scenarios show a
 * Premium badge and open the SN-026 paywall bottom sheet instead of
 * starting a session; premium callers navigate straight into sessions
 * with no paywall.
 */

const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  navigate: jest.fn(),
};

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("lucide-react-native", () => ({
  ChevronRight: () => null,
  Lock: () => null,
  Play: () => null,
  RefreshCw: () => null,
  Sparkles: () => null,
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

jest.mock("../../src/services/scenarioCache", () => ({
  loadScenarioCache: jest.fn(async () => null),
  saveScenarioCache: jest.fn(async () => undefined),
}));

import { fireEvent, render, waitFor } from "@testing-library/react-native";

import HomeScreen from "../../app/(tabs)/index";
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
    created_at: "2026-08-26T12:00:00Z",
    skills: null,
  };
}

/** Featured scenario is premium-locked; the More list mixes both tiers. */
function catalog() {
  return [
    {
      id: "interpret-bloodwork-results",
      title: "Go over bloodwork results",
      description: "Clinic review of your annual labs",
      category: "healthcare",
      pack_id: "healthcare-english-v1",
      difficulty: 4,
      is_locked: true,
    },
    {
      id: "talk-through-dental-options",
      title: "Talk through dental options",
      description: "Treatment choices at the dentist",
      category: "healthcare",
      pack_id: "healthcare-english-v1",
      difficulty: 3,
      is_locked: true,
    },
    {
      id: "order-coffee-and-chat",
      title: "Order coffee and chat",
      description: "Small talk at the counter",
      category: "social",
      pack_id: "canadian-life-v1",
      difficulty: 1,
      is_locked: false,
    },
  ];
}

describe("Home screen premium gating (SN-035)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function seedStores(
    subscription_tier: string,
    scenarios: ReturnType<typeof catalog>,
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

  it("shows a Premium badge on the featured locked scenario", async () => {
    seedStores("free", catalog());

    const screen = render(<HomeScreen />);

    await waitFor(() => {
      expect(
        screen.getByLabelText("Premium session: Go over bloodwork results"),
      ).toBeTruthy();
    });
    // The lock chip replaces the difficulty badge on the gated card...
    expect(screen.getAllByText("Premium").length).toBeGreaterThan(0);
    // ...and nothing navigates implicitly.
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("opens the paywall instead of a session for a free caller", async () => {
    seedStores("free", catalog());

    const screen = render(<HomeScreen />);
    await waitFor(() => {
      expect(
        screen.getByLabelText("Premium session: Go over bloodwork results"),
      ).toBeTruthy();
    });

    fireEvent.press(
      screen.getByLabelText("Premium session: Go over bloodwork results"),
    );

    // The SN-026 paywall opens; no session route was pushed.
    await waitFor(() => {
      expect(screen.queryByLabelText("Sonolo premium upgrade")).toBeTruthy();
    });
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("opens the paywall from locked rows in the More list too", async () => {
    seedStores("free", catalog());

    const screen = render(<HomeScreen />);
    await waitFor(() => {
      expect(
        screen.getByLabelText("Premium scenario: Talk through dental options"),
      ).toBeTruthy();
    });

    fireEvent.press(
      screen.getByLabelText("Premium scenario: Talk through dental options"),
    );

    await waitFor(() => {
      expect(screen.queryByLabelText("Sonolo premium upgrade")).toBeTruthy();
    });
    expect(mockRouter.push).not.toHaveBeenCalled();

    // Unlocked rows keep their normal start labels.
    expect(
      screen.getByLabelText("Start scenario: Order coffee and chat"),
    ).toBeTruthy();
  });

  it("navigates into sessions normally for premium callers", async () => {
    seedStores("premium", catalog());

    const screen = render(<HomeScreen />);
    await waitFor(() => {
      expect(
        screen.getByLabelText("Start session: Go over bloodwork results"),
      ).toBeTruthy();
    });
    expect(screen.queryByText("Premium")).toBeNull();

    fireEvent.press(
      screen.getByLabelText("Start session: Go over bloodwork results"),
    );

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        "/session/interpret-bloodwork-results",
      );
    });
    expect(screen.queryByLabelText("Sonolo premium upgrade")).toBeNull();
  });
});
