/**
 * Pronunciation Lab drill player tests (SN-049): the Listen button
 * speaks the target sentence via expo-speech (mocked — no real TTS in
 * tests), the Record & Score flow reuses the recorder service and
 * renders the deterministic phoneme result, and a locked premium drill
 * opens the PaywallModal instead of the player.
 */

const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  navigate: jest.fn(),
};

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => ({ id: "pron-flapped-t" }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("lucide-react-native", () => ({
  Gauge: () => null,
  Lock: () => null,
  Mic: () => null,
  Play: () => null,
  RotateCcw: () => null,
  Volume2: () => null,
}));

jest.mock("../../lib/analytics", () => ({
  trackEvent: jest.fn(),
}));

jest.mock("expo-speech", () => ({
  speak: jest.fn(),
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
    fetchPronunciationDrill: jest.fn(),
    evaluatePronunciation: jest.fn(),
  };
});

jest.mock("../../src/utils/permissions", () => ({
  ensureMicPermission: jest.fn(async () => true),
}));

jest.mock("../../src/services/audioRecorder", () => {
  class FakeRecorder {
    state = "idle";
    async start(): Promise<boolean> {
      this.state = "recording";
      return true;
    }
    async stopAndCollect(): Promise<string | null> {
      this.state = "idle";
      return "YXVkaW8=";
    }
    cleanup(): void {
      this.state = "idle";
    }
  }
  return { AudioRecorderService: FakeRecorder };
});

import { act, fireEvent, render, waitFor } from "@testing-library/react-native";

import PronunciationDrillScreen from "../../app/pronunciation/[id]";
import {
  evaluatePronunciation,
  fetchPronunciationDrill,
  type PronunciationDrill,
  type PronunciationEvaluation,
} from "../../src/api/client";
import { trackEvent } from "../../lib/analytics";
import * as Speech from "expo-speech";
import { useAuthStore } from "../../src/stores/authStore";

const mockFetchDrill = fetchPronunciationDrill as jest.Mock;
const mockEvaluate = evaluatePronunciation as jest.Mock;
const mockSpeak = Speech.speak as jest.Mock;

function makeUser(subscription_tier: string) {
  return {
    id: "user-1",
    email: "pron@example.com",
    name: "Pron",
    native_language: "hi",
    target_language: "en-CA",
    learning_goal: "workplace",
    current_level: "branch",
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

function makeDrill(overrides: Partial<PronunciationDrill> = {}): PronunciationDrill {
  return {
    id: "pron-flapped-t",
    title: "The flapped T — water, better",
    focus: "The quick d-like T between vowels",
    target_sentence: "Could I get a water? That's better, thanks.",
    target_words: ["water", "better", "later"],
    ipa_hint: "/ˈwɑːɾər/ · /ˈbɛɾər/ — t becomes ɾ",
    tip: "When a T sits between two vowels, it becomes a light tap.",
    level: "branch",
    is_premium: true,
    pack_id: "canadian-speech-english-v1",
    theme_color: "#A78BFA",
    icon: "🗣️",
    ...overrides,
  };
}

function makeEvaluation(): PronunciationEvaluation {
  return {
    overall: 75,
    phonemes: [
      { symbol: "t", score: 61, tip: "Listen for the rhythm, then mirror it back." },
      { symbol: "j", score: 85, tip: "Round your lips just a touch for this one." },
      { symbol: "ɛ", score: 81, tip: "Let the air flow freely." },
      { symbol: "θ", score: 94, tip: "Push the sound to the front of your mouth." },
    ],
    fluency_score: 78,
    tip_summary: "Solid take. Try the target sentence once more with the tip in mind.",
    engine_version: "sn049-mock-phoneme-v1",
  };
}

describe("Pronunciation drill player (SN-049)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockFetchDrill.mockResolvedValue(makeDrill());
    mockEvaluate.mockResolvedValue(makeEvaluation());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the drill hero, sentence, and IPA hint", async () => {
    useAuthStore.setState({ user: makeUser("premium"), isAuthenticated: true });

    const { getByText } = render(<PronunciationDrillScreen />);

    await waitFor(() => {
      expect(getByText("The flapped T — water, better")).toBeTruthy();
    });
    expect(getByText("Could I get a water? That's better, thanks.")).toBeTruthy();
    expect(getByText("/ˈwɑːɾər/ · /ˈbɛɾər/ — t becomes ɾ")).toBeTruthy();
    expect(getByText("Record & Score")).toBeTruthy();
  });

  it("Listen speaks the target sentence and tracks the event", async () => {
    useAuthStore.setState({ user: makeUser("premium"), isAuthenticated: true });

    const { getByText } = render(<PronunciationDrillScreen />);
    await waitFor(() => {
      expect(getByText("Listen")).toBeTruthy();
    });

    fireEvent.press(getByText("Listen"));

    expect(mockSpeak).toHaveBeenCalledWith(
      "Could I get a water? That's better, thanks.",
      { language: "en-CA", rate: 1 },
    );
    expect(trackEvent).toHaveBeenCalledWith("Pronunciation Listen Tapped", {
      drill_id: "pron-flapped-t",
    });
  });

  it("Record & Score renders the phoneme bars and tracks completion", async () => {
    useAuthStore.setState({ user: makeUser("premium"), isAuthenticated: true });

    const { getByText, getAllByText } = render(<PronunciationDrillScreen />);
    await waitFor(() => {
      expect(getByText("Record & Score")).toBeTruthy();
    });

    fireEvent.press(getByText("Record & Score"));
    // The async handler awaits permission + recorder start before it
    // schedules the 3s timer, so flush those microtasks first, THEN
    // fire the timer, then flush the evaluate chain.
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      jest.advanceTimersByTime(3000);
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(mockEvaluate).toHaveBeenCalledWith("pron-flapped-t", 3);
      expect(getByText("Overall")).toBeTruthy();
    });
    expect(getByText("Fluency: 78")).toBeTruthy();
    expect(getByText("θ")).toBeTruthy();
    expect(getAllByText("94").length).toBeGreaterThan(0);
    expect(
      trackEvent,
    ).toHaveBeenCalledWith("Pronunciation Drill Completed", {
      drill_id: "pron-flapped-t",
      overall: 75,
    });
  });

  it("a locked premium drill opens the paywall instead of the player", async () => {
    useAuthStore.setState({ user: makeUser("free"), isAuthenticated: true });

    const { findByText } = render(<PronunciationDrillScreen />);

    expect(await findByText("paywall open")).toBeTruthy();
  });

  it("renders a gated note when the drill fetch fails with a lock", async () => {
    useAuthStore.setState({ user: makeUser("free"), isAuthenticated: true });
    mockFetchDrill.mockRejectedValueOnce(
      Object.assign(new Error("403"), {
        response: { status: 403 },
      }),
    );

    const { findByText } = render(<PronunciationDrillScreen />);

    expect(await findByText("Premium drill")).toBeTruthy();
    expect(await findByText("paywall open")).toBeTruthy();
  });
});
