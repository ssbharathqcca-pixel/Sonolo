/**
 * CanadaReady™ Scorecard screen tests (SN-048): the screen renders the
 * badge, six bands, stats, and the mandatory disclaimer; a free-tier
 * user tapping export opens the PaywallModal, while a premium user
 * downloads the PDF, writes it with expo-file-system, and shares it
 * with expo-sharing.
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
  Award: () => null,
  ChevronRight: () => null,
  Download: () => null,
  Flame: () => null,
  Lock: () => null,
  RefreshCw: () => null,
  Trophy: () => null,
  Zap: () => null,
}));

jest.mock("../../lib/analytics", () => ({
  trackEvent: jest.fn(),
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
    fetchScorecard: jest.fn(),
    fetchScorecardPdf: jest.fn(),
  };
});

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///cache/",
  writeAsStringAsync: jest.fn(async () => undefined),
  EncodingType: { Base64: 0 },
}));

jest.mock("expo-sharing", () => ({
  shareAsync: jest.fn(async () => undefined),
}));

import { fireEvent, render, waitFor } from "@testing-library/react-native";

import ScorecardScreen from "../../app/scorecard";
import {
  fetchScorecard,
  fetchScorecardPdf,
  type Scorecard,
} from "../../src/api/client";
import { trackEvent } from "../../lib/analytics";
import { useAuthStore } from "../../src/stores/authStore";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

const mockFetch = fetchScorecard as jest.Mock;
const mockFetchPdf = fetchScorecardPdf as jest.Mock;
const mockWrite = FileSystem.writeAsStringAsync as jest.Mock;
const mockShare = Sharing.shareAsync as jest.Mock;

function makeUser(subscription_tier: string) {
  return {
    id: "user-1",
    email: "scorecard@example.com",
    name: "Score",
    native_language: "hi",
    target_language: "en-CA",
    learning_goal: "workplace",
    current_level: "branch",
    preferred_language: "en" as const,
    subscription_tier,
    streak_count: 4,
    streak_last_date: null,
    total_xp: 320,
    total_speaking_seconds: 1260,
    onboarding_completed: true,
    created_at: "2026-08-28T12:00:00Z",
    skills: null,
  };
}

function scorecard(overrides: Partial<Scorecard> = {}): Scorecard {
  return {
    generated_at: "2026-08-31T12:00:00Z",
    badge: {
      code: "confident-colleague",
      title: "Confident Colleague",
      tagline: "You're holding real conversations with confidence.",
    },
    canada_ready_score: 64,
    bands: [
      { code: "fluency", label: "Fluency", score: 62, clb_hint: "CLB-inspired 5-6" },
      { code: "pronunciation", label: "Pronunciation", score: 71, clb_hint: "CLB-inspired 7+" },
      { code: "grammar", label: "Grammar", score: 55, clb_hint: "CLB-inspired 5-6" },
      { code: "vocabulary", label: "Vocabulary", score: 68, clb_hint: "CLB-inspired 5-6" },
      { code: "coherence", label: "Coherence", score: 60, clb_hint: "CLB-inspired 5-6" },
      { code: "task_completion", label: "Task Completion", score: 74, clb_hint: "CLB-inspired 7+" },
    ],
    stats: {
      sessions_completed: 8,
      speaking_minutes: 21,
      streak_current: 4,
      total_xp: 320,
    },
    disclaimer:
      "CLB-inspired self-assessment — not an official language test.",
    ...overrides,
  };
}

describe("CanadaReady™ Scorecard screen (SN-048)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue(scorecard());
    mockFetchPdf.mockResolvedValue("JVBERi0xLjQ="); // "%PDF-1.4"
  });

  it("renders badge, six bands, stats, and the disclaimer", async () => {
    useAuthStore.setState({
      user: makeUser("premium"),
      isAuthenticated: true,
    });

    const { getByText, getAllByText } = render(<ScorecardScreen />);

    await waitFor(() => {
      expect(getByText("Confident Colleague")).toBeTruthy();
    });
    expect(getByText("CanadaReady™ Score")).toBeTruthy();
    expect(getByText(/64/)).toBeTruthy();
    expect(getByText("Fluency")).toBeTruthy();
    expect(getAllByText("CLB-inspired 7+").length).toBe(2);
    expect(getByText("Speaking min")).toBeTruthy();
    expect(
      getByText("CLB-inspired self-assessment — not an official language test."),
    ).toBeTruthy();
  });

  it("tracks a Scorecard Viewed event on load", async () => {
    useAuthStore.setState({
      user: makeUser("premium"),
      isAuthenticated: true,
    });

    render(<ScorecardScreen />);

    await waitFor(() => {
      expect(trackEvent).toHaveBeenCalledWith("Scorecard Viewed");
    });
  });

  it("opens the paywall when a free user taps export", async () => {
    useAuthStore.setState({
      user: makeUser("free"),
      isAuthenticated: true,
    });

    const { getByText, findByText } = render(<ScorecardScreen />);
    await waitFor(() => {
      expect(getByText("Confident Colleague")).toBeTruthy();
    });

    fireEvent.press(getByText("Unlock PDF Export"));

    expect(await findByText("paywall open")).toBeTruthy();
    expect(mockFetchPdf).not.toHaveBeenCalled();
    expect(mockShare).not.toHaveBeenCalled();
  });

  it("downloads, writes, and shares the PDF for a premium user", async () => {
    useAuthStore.setState({
      user: makeUser("premium"),
      isAuthenticated: true,
    });

    const { getByText } = render(<ScorecardScreen />);
    await waitFor(() => {
      expect(getByText("Confident Colleague")).toBeTruthy();
    });

    fireEvent.press(getByText("Export PDF"));

    await waitFor(() => {
      expect(mockFetchPdf).toHaveBeenCalledTimes(1);
      expect(mockWrite).toHaveBeenCalledWith(
        expect.stringContaining("file:///cache/sonolo-scorecard-"),
        "JVBERi0xLjQ=",
        { encoding: 0 },
      );
    });
    expect(mockShare).toHaveBeenCalledWith(
      expect.stringContaining("file:///cache/sonolo-scorecard-"),
      { mimeType: "application/pdf", dialogTitle: "Export your CanadaReady™ Scorecard" },
    );
    expect(trackEvent).toHaveBeenCalledWith("Scorecard PDF Exported");
  });

  it("does not export when the PDF fetch fails", async () => {
    useAuthStore.setState({
      user: makeUser("premium"),
      isAuthenticated: true,
    });
    mockFetchPdf.mockRejectedValueOnce(new Error("offline"));

    const { getByText } = render(<ScorecardScreen />);
    await waitFor(() => {
      expect(getByText("Confident Colleague")).toBeTruthy();
    });

    fireEvent.press(getByText("Export PDF"));

    await waitFor(() => {
      expect(mockFetchPdf).toHaveBeenCalledTimes(1);
      expect(mockShare).not.toHaveBeenCalled();
    });
  });
});
