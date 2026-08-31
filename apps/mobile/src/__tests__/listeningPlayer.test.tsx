/**
 * Listening Gym player tests (SN-050): the screen renders the dialogue
 * and quiz, Play speaks role-prefixed turns via expo-speech (mocked —
 * no real TTS in tests), the speed toggle cycles, submitting all three
 * answers calls evaluate and renders the results panel, and a locked
 * premium dialogue opens the PaywallModal instead of the player.
 */

const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  navigate: jest.fn(),
  back: jest.fn(),
};

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => ({ id: "listen-coffee-morning-rush" }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("lucide-react-native", () => ({
  CheckCircle2: () => null,
  Gauge: () => null,
  Headphones: () => null,
  Lock: () => null,
  Pause: () => null,
  Play: () => null,
  RotateCcw: () => null,
  XCircle: () => null,
}));

jest.mock("../../lib/analytics", () => ({
  trackEvent: jest.fn(),
}));

jest.mock("expo-speech", () => ({
  speak: jest.fn(),
  stop: jest.fn(),
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
    fetchListeningDialogue: jest.fn(),
    evaluateListening: jest.fn(),
  };
});

import { fireEvent, render, waitFor } from "@testing-library/react-native";

import ListeningPlayerScreen from "../../app/listening/[id]";
import {
  evaluateListening,
  fetchListeningDialogue,
  type ListeningDialogue,
  type ListeningEvaluation,
} from "../../src/api/client";
import { trackEvent } from "../../lib/analytics";
import * as Speech from "expo-speech";
import { useAuthStore } from "../../src/stores/authStore";

const mockFetch = fetchListeningDialogue as jest.Mock;
const mockEvaluate = evaluateListening as jest.Mock;
const mockSpeak = Speech.speak as jest.Mock;

function makeUser(subscription_tier: string) {
  return {
    id: "user-1",
    email: "listen@example.com",
    name: "Listen",
    native_language: "hi",
    target_language: "en-CA",
    learning_goal: "casual",
    current_level: "sprout",
    preferred_language: "en" as const,
    subscription_tier,
    streak_count: 0,
    streak_last_date: null,
    total_xp: 0,
    total_speaking_seconds: 0,
    onboarding_completed: true,
    created_at: "2026-08-31T12:00:00Z",
    skills: null,
  };
}

function makeDialogue(
  overrides: Partial<ListeningDialogue> = {},
): ListeningDialogue {
  return {
    id: "listen-coffee-morning-rush",
    title: "Coffee shop morning rush",
    context:
      "You step into a busy coffee shop near your office. The barista greets you as you approach the counter.",
    level: "sprout",
    difficulty: 0.3,
    listening_focus: "details",
    is_premium: false,
    turns: [
      {
        role: "speaker",
        text: "Hi there! What can I get started for you today?",
        pause_after_ms: 1500,
      },
      {
        role: "listener",
        text: "Hi, could I get a medium dark roast, please?",
        pause_after_ms: 1200,
      },
    ],
    questions: [
      {
        prompt: "What did the customer order?",
        choices: [
          "A large latte with almond milk",
          "A medium dark roast with cream and sugar",
          "A small espresso with one sugar",
          "A medium cappuccino with extra foam",
        ],
        correct_index: 1,
        explanation: "The customer ordered a medium dark roast.",
      },
      {
        prompt: "What did the barista offer as an extra?",
        choices: ["A cookie", "A latte or espresso", "Water", "A loyalty card"],
        correct_index: 1,
        explanation: "The barista offered a latte or espresso.",
      },
      {
        prompt: "Why did the barista warn the customer?",
        choices: ["Hot coffee", "Slippery floor", "Rain", "Broken door"],
        correct_index: 1,
        explanation: "The floor was slippery.",
      },
    ],
    vocab_targets: ["espresso", "latte", "cream", "sugar", "medium"],
    pack_id: "listening-english-v1",
    theme_color: "#06B6D4",
    icon: "🎧",
    ...overrides,
  };
}

function makeEvaluation(): ListeningEvaluation {
  return {
    correct_count: 2,
    total: 3,
    score: 67,
    missed: [
      {
        prompt: "Why did the barista warn the customer?",
        your_answer: "Hot coffee",
        correct_answer: "Slippery floor",
        explanation: "The floor was slippery.",
      },
    ],
    time_seconds: 42,
    engine_version: "sn050-mock-listening-v1",
  };
}

describe("Listening Gym player (SN-050)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue(makeDialogue());
    mockEvaluate.mockResolvedValue(makeEvaluation());
  });

  it("renders the dialogue hero and the three-question quiz", async () => {
    useAuthStore.setState({ user: makeUser("free"), isAuthenticated: true });

    const { getByText } = render(<ListeningPlayerScreen />);

    await waitFor(() => {
      expect(getByText("Coffee shop morning rush")).toBeTruthy();
    });
    expect(getByText("What did the customer order?")).toBeTruthy();
    expect(getByText("Why did the barista warn the customer?")).toBeTruthy();
    expect(getByText("Answer all 3 to submit")).toBeTruthy();
  });

  it("Play speaks role-prefixed turns and tracks the event", async () => {
    useAuthStore.setState({ user: makeUser("free"), isAuthenticated: true });

    const { getByText } = render(<ListeningPlayerScreen />);
    await waitFor(() => {
      expect(getByText("Play dialogue")).toBeTruthy();
    });

    fireEvent.press(getByText("Play dialogue"));

    expect(mockSpeak).toHaveBeenCalledWith(
      "Speaker: Hi there! What can I get started for you today?",
      expect.objectContaining({ language: "en-CA", rate: 1 }),
    );
    expect(trackEvent).toHaveBeenCalledWith("Listening Play Tapped", {
      dialogue_id: "listen-coffee-morning-rush",
    });
  });

  it("the speed toggle cycles 1.0 → 1.2 → 0.8 and tracks the change", async () => {
    useAuthStore.setState({ user: makeUser("free"), isAuthenticated: true });

    const { getByText } = render(<ListeningPlayerScreen />);
    await waitFor(() => {
      expect(getByText("Speed")).toBeTruthy();
    });

    fireEvent.press(getByText("Speed"));
    expect(getByText("1.2x")).toBeTruthy();
    expect(trackEvent).toHaveBeenCalledWith("Listening Speed Changed", {
      dialogue_id: "listen-coffee-morning-rush",
      speed: 1.2,
    });

    fireEvent.press(getByText("Speed"));
    expect(getByText("0.8x")).toBeTruthy();
  });

  it("submitting all three answers evaluates and renders the results", async () => {
    useAuthStore.setState({ user: makeUser("free"), isAuthenticated: true });

    const { getByText, queryByText } = render(<ListeningPlayerScreen />);
    await waitFor(() => {
      expect(getByText("What did the customer order?")).toBeTruthy();
    });

    // Answer all three questions (pick the correct choices).
    fireEvent.press(getByText("A medium dark roast with cream and sugar"));
    fireEvent.press(getByText("A latte or espresso"));
    fireEvent.press(getByText("Slippery floor"));

    await waitFor(() => {
      expect(getByText("Submit answers")).toBeTruthy();
    });

    fireEvent.press(getByText("Submit answers"));

    await waitFor(() => {
      expect(mockEvaluate).toHaveBeenCalledWith(
        "listen-coffee-morning-rush",
        [1, 1, 1],
        expect.any(Number),
      );
      expect(getByText("Your score")).toBeTruthy();
    });
    expect(getByText(/^67/)).toBeTruthy();
    expect(getByText("2 of 3 correct")).toBeTruthy();
    expect(getByText("Completed in 42s")).toBeTruthy();
    expect(trackEvent).toHaveBeenCalledWith("Listening Dialogue Completed", {
      dialogue_id: "listen-coffee-morning-rush",
      score: 67,
      correct_count: 2,
    });
    expect(queryByText("What did the customer order?")).toBeNull();
  });

  it("a locked premium dialogue opens the paywall instead of the player", async () => {
    useAuthStore.setState({ user: makeUser("free"), isAuthenticated: true });
    mockFetch.mockRejectedValueOnce(
      Object.assign(new Error("403"), { response: { status: 403 } }),
    );

    const { findByText } = render(<ListeningPlayerScreen />);

    expect(await findByText("Premium dialogue")).toBeTruthy();
    expect(await findByText("paywall open")).toBeTruthy();
  });

  it("a premium user sees the player for a premium dialogue", async () => {
    useAuthStore.setState({ user: makeUser("premium"), isAuthenticated: true });
    mockFetch.mockResolvedValueOnce(makeDialogue({ is_premium: true }));

    const { getByText } = render(<ListeningPlayerScreen />);

    await waitFor(() => {
      expect(getByText("Coffee shop morning rush")).toBeTruthy();
    });
    expect(getByText("Play dialogue")).toBeTruthy();
  });
});
