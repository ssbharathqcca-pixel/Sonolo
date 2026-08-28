/**
 * Tests for the SN-040 onboarding flow: the language step saves the
 * primary language to the backend and advances, the goal step persists
 * the chosen focus and advances, and the ready step completes
 * onboarding into the recommended pack (with a Learn-library fallback
 * when the goal + language maps to no pack).
 */

const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  navigate: jest.fn(),
  back: jest.fn(),
};

const mockParams: Record<string, string | undefined> = {};

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockParams,
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("lucide-react-native", () => ({
  Check: () => null,
  Play: () => null,
  Sparkles: () => null,
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
    fetchPacks: jest.fn(async () => []),
    fetchCurrentUser: jest.fn(async () => null),
    loginRequest: jest.fn(async () => ({ access_token: "t", token_type: "bearer" })),
    registerRequest: jest.fn(async () => ({})),
    updatePreferredLanguage: jest.fn(),
    upgradeAccountRequest: jest.fn(async () => null),
  };
});

jest.mock("../../src/services/secureStorage", () => ({
  TOKEN_KEY: "sonolo.access_token",
  setItem: jest.fn(async () => true),
  getItem: jest.fn(async () => null),
  removeItem: jest.fn(async () => true),
}));

import { fireEvent, render, waitFor } from "@testing-library/react-native";

import LanguageScreen from "../../app/(onboarding)/index";
import GoalScreen from "../../app/(onboarding)/goal";
import ReadyScreen from "../../app/(onboarding)/ready";
import { fetchPacks, updatePreferredLanguage } from "../../src/api/client";
import { useAuthStore } from "../../src/stores/authStore";

function makeUser(preferred_language: "en" | "fr") {
  return {
    id: "user-1",
    email: "pavan@example.com",
    name: "Pavan",
    native_language: "hi",
    target_language: "en-CA",
    learning_goal: "pr_readiness",
    current_level: "sprout",
    preferred_language,
    subscription_tier: "free",
    streak_count: 0,
    streak_last_date: null,
    total_xp: 0,
    total_speaking_seconds: 0,
    onboarding_completed: false,
    created_at: "2026-08-24T12:00:00Z",
    skills: null,
  };
}

function seedStore(preferred_language: "en" | "fr") {
  useAuthStore.setState({
    user: makeUser(preferred_language),
    token: "test-token",
    isLoading: false,
    isHydrated: true,
    isAuthenticated: true,
    onboardingCompleted: false,
    onboardingGoal: null,
  });
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
};

const quebecWorkplacePack = {
  id: "quebec-workplace-v1",
  type: "scenarios",
  title: "Travail au Québec",
  description: "Réunions, entrevues et confiance au travail.",
  category: "workplace",
  language: "fr",
  tier: "freemium",
  theme_color: "#22C55E",
  icon: "briefcase",
};

describe("Onboarding language step (SN-040)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    seedStore("en");
  });

  it("renders the headline and both language cards", () => {
    const screen = render(<LanguageScreen />);

    expect(screen.getByText("Welcome to Sonolo.")).toBeTruthy();
    expect(
      screen.getByText("Sound like you belong. Choose your primary language."),
    ).toBeTruthy();
    expect(screen.getByLabelText("Choose English")).toBeTruthy();
    expect(screen.getByLabelText("Choose Français")).toBeTruthy();
  });

  it("saves English via the auth store and advances to the goal step", async () => {
    (updatePreferredLanguage as jest.Mock).mockResolvedValueOnce(makeUser("en"));
    const screen = render(<LanguageScreen />);

    fireEvent.press(screen.getByLabelText("Choose English"));

    await waitFor(() => {
      expect(updatePreferredLanguage).toHaveBeenCalledWith("en");
      expect(mockRouter.push).toHaveBeenCalledWith("./goal");
    });
  });

  it("saves French via the auth store and advances", async () => {
    (updatePreferredLanguage as jest.Mock).mockResolvedValueOnce(makeUser("fr"));
    const screen = render(<LanguageScreen />);

    fireEvent.press(screen.getByLabelText("Choose Français"));

    await waitFor(() => {
      expect(updatePreferredLanguage).toHaveBeenCalledWith("fr");
      expect(mockRouter.push).toHaveBeenCalledWith("./goal");
    });
  });

  it("stays on the screen when the language save fails", async () => {
    // The auth store normalizes thrown errors into a user-facing
    // message (getApiErrorMessage), so the plain rejection surfaces as
    // the generic fallback.
    (updatePreferredLanguage as jest.Mock).mockRejectedValueOnce(
      new Error("network down"),
    );
    const screen = render(<LanguageScreen />);

    fireEvent.press(screen.getByLabelText("Choose English"));

    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong. Please try again."),
      ).toBeTruthy();
    });
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});

describe("Onboarding goal step (SN-040)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    seedStore("en");
  });

  it("renders the four focus goals", () => {
    const screen = render(<GoalScreen />);

    expect(screen.getByText("What is your main focus?")).toBeTruthy();
    for (const label of [
      "Career & Workplace",
      "Health & Wellness",
      "Housing & Renting",
      "Daily Settlement",
    ]) {
      expect(screen.getByLabelText(`Select goal ${label}`)).toBeTruthy();
    }
  });

  it("persists the chosen goal and advances to the ready step", async () => {
    const screen = render(<GoalScreen />);

    fireEvent.press(screen.getByLabelText("Select goal Career & Workplace"));

    await waitFor(() => {
      expect(useAuthStore.getState().onboardingGoal).toBe("career");
      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: "./ready",
        params: { goal: "career" },
      });
    });
  });
});

describe("Onboarding ready step (SN-040)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    seedStore("en");
    delete mockParams.goal;
  });

  it("recommends the English career pack and completes into it", async () => {
    (fetchPacks as jest.Mock).mockResolvedValueOnce([workplacePack]);
    mockParams.goal = "career";
    const screen = render(<ReadyScreen />);

    await waitFor(() => {
      expect(screen.getByText("Your journey is ready.")).toBeTruthy();
      expect(screen.getByText("Workplace English")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Start Learning"));

    await waitFor(() => {
      expect(useAuthStore.getState().onboardingCompleted).toBe(true);
      expect(mockRouter.replace).toHaveBeenCalledWith(
        "/pack/workplace-english-v1",
      );
    });
  });

  it("recommends the Quebec workplace pack for career + Français", async () => {
    (fetchPacks as jest.Mock).mockResolvedValueOnce([quebecWorkplacePack]);
    mockParams.goal = "career";
    seedStore("fr");
    const screen = render(<ReadyScreen />);

    await waitFor(() => {
      expect(screen.getByText("Travail au Québec")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Start Learning"));

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith(
        "/pack/quebec-workplace-v1",
      );
    });
  });

  it("falls back to the Learn library when the goal maps to no pack", async () => {
    mockParams.goal = "unknown";
    seedStore("fr");
    const screen = render(<ReadyScreen />);

    await waitFor(() => {
      expect(screen.getByText("Your journey is ready.")).toBeTruthy();
      expect(
        screen.getByText(
          "We'll curate scenarios around your focus as you learn.",
        ),
      ).toBeTruthy();
    });
    expect(fetchPacks).not.toHaveBeenCalled();

    fireEvent.press(screen.getByLabelText("Start Learning"));

    await waitFor(() => {
      expect(useAuthStore.getState().onboardingCompleted).toBe(true);
      expect(mockRouter.replace).toHaveBeenCalledWith("/(tabs)/learn");
    });
  });
});
