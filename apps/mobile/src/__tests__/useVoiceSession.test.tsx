/**
 * Tests for useVoiceSession (SN-016): authenticated socket URL,
 * user_text_chunk / ai_text_chunk / session_summary handling, 4401
 * logout, and completion POST with real evaluation.
 */

import { act, renderHook, waitFor } from "@testing-library/react-native";

const openSockets: FakeSocket[] = [];

class FakeSocket {
  static OPEN = 1;
  readyState = FakeSocket.OPEN;
  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onclose: ((event: { code: number; reason: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  sent: string[] = [];

  constructor(url: string) {
    this.url = url;
    openSockets.push(this);
  }

  send(data: string): void {
    this.sent.push(data);
  }

  close(): void {}

  simulateOpen(): void { this.onopen?.(); }
  simulateFrame(frame: unknown): void { this.onmessage?.({ data: JSON.stringify(frame) }); }
  simulateClose(code: number, reason = ""): void { this.onclose?.({ code, reason }); }
}

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn(), navigate: jest.fn() }),
}));

jest.mock("../services/secureStorage", () => ({
  TOKEN_KEY: "sonolo.access_token",
  setItem: jest.fn(async () => true),
  getItem: jest.fn(async () => null),
  removeItem: jest.fn(async () => true),
}));

jest.mock("expo-av", () => ({
  Audio: {
    requestPermissionsAsync: jest.fn(async () => ({ granted: true, status: "granted" })),
    setAudioModeAsync: jest.fn(async () => {}),
    Recording: { createAsync: jest.fn() },
    AndroidOutputFormat: { MPEG_4: "mpeg4" },
    AndroidAudioEncoder: { AAC: "aac" },
    IOSOutputFormat: { MPEG_4: "mpeg4" },
    IOSAudioQuality: { HIGH: "high", MEDIUM: "medium", LOW: "low" },
  },
}));

jest.mock("../api/client", () => {
  const actualModule = jest.requireActual("../api/client");
  return { ...actualModule, completeSession: jest.fn() };
});

import { useVoiceSession } from "../hooks/useVoiceSession";
import { useAuthStore } from "../stores/authStore";
import { useScenarioStore } from "../stores/scenarioStore";
import { completeSession, type User } from "../api/client";

function makeUser(subscription_tier: string): User {
  return {
    id: "user-1",
    email: "pavan@example.com",
    name: "Pavan",
    native_language: "hi",
    target_language: "en-CA",
    learning_goal: "pr_readiness",
    current_level: "sprout",
    subscription_tier,
    streak_count: 0,
    streak_last_date: null,
    total_xp: 0,
    total_speaking_seconds: 0,
    onboarding_completed: true,
    created_at: "2026-08-22T20:05:00Z",
    skills: null,
  };
}

describe("useVoiceSession", () => {
  beforeEach(() => {
    openSockets.length = 0;
    (global as { WebSocket?: unknown }).WebSocket = FakeSocket;
    useAuthStore.setState({
      user: null, token: "test-token", isLoading: false,
      isHydrated: true, isAuthenticated: true,
    });
    useScenarioStore.setState({
      scenarios: [], selected: null, isLoading: false,
      error: null, isFromCache: false,
    });
  });

  function lastSocket(): FakeSocket { return openSockets[openSockets.length - 1]; }

  it("opens the WebSocket with the authenticated token URL", async () => {
    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await waitFor(() => expect(openSockets.length).toBe(1));
    expect(lastSocket().url).toContain("/ws/voice/");
    expect(lastSocket().url).toContain("token=test-token");
    act(() => { lastSocket().simulateOpen(); });
    expect(result.current.isConnected).toBe(true);
  });

  it("refuses to connect for a locked scenario on the free tier (SN-026)", async () => {
    useScenarioStore.setState({
      scenarios: [
        {
          id: "scenario-1",
          title: "File your first tax return",
          description: "A community tax clinic.",
          category: "government",
          difficulty: 3,
          is_locked: true,
        },
      ],
    });

    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await act(async () => {});

    expect(openSockets.length).toBe(0);
    expect(result.current.error).toContain("Premium");

    // Taps are dead ends too — no recorder, no socket traffic.
    await act(async () => {
      result.current.handleTap();
    });
    expect(openSockets.length).toBe(0);
  });

  it("connects for a locked scenario once the tier is premium", async () => {
    useAuthStore.setState({ user: makeUser("premium") });
    useScenarioStore.setState({
      scenarios: [
        {
          id: "scenario-1",
          title: "File your first tax return",
          description: "A community tax clinic.",
          category: "government",
          difficulty: 3,
          is_locked: true,
        },
      ],
    });

    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await waitFor(() => expect(openSockets.length).toBe(1));
    act(() => { lastSocket().simulateOpen(); });
    expect(result.current.isConnected).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("collects user turns from user_text_chunk frames", async () => {
    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await waitFor(() => expect(openSockets.length).toBe(1));
    act(() => {
      lastSocket().simulateFrame({
        type: "user_text_chunk",
        payload: { text: "Could I get a coffee?", is_final: true },
      });
    });
    expect(result.current.transcript[0].role).toBe("user");
    expect(result.current.transcript[0].text).toBe("Could I get a coffee?");
  });

  it("collects assistant turns from ai_text_chunk frames", async () => {
    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await waitFor(() => expect(openSockets.length).toBe(1));
    act(() => {
      lastSocket().simulateFrame({
        type: "ai_text_chunk",
        payload: { text: "Great choice!", is_final: true },
      });
    });
    expect(result.current.transcript[0].role).toBe("tutor");
    expect(result.current.transcript[0].text).toBe("Great choice!");
  });

  it("sends audio_chunk on idle tap and end_turn while listening", async () => {
    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await waitFor(() => expect(openSockets.length).toBe(1));
    act(() => {
      lastSocket().simulateOpen();
    });
    // IDLE tap → async recorder.start() then sends init chunk.
    await act(async () => {
      result.current.handleTap();
    });
    await waitFor(() => {
      expect(lastSocket().sent.length).toBeGreaterThanOrEqual(1);
    });
    act(() => {
      lastSocket().simulateFrame({
        type: "state_change", payload: { state: "listening" },
      });
    });
    // LISTENING tap → stopAndCollect + end_turn.
    const beforeEndTurn = lastSocket().sent.length;
    await act(async () => {
      result.current.handleTap();
    });
    await waitFor(() => {
      expect(lastSocket().sent.length).toBeGreaterThan(beforeEndTurn);
    });
    const types = lastSocket().sent.map((raw) => JSON.parse(raw).type);
    expect(types).toEqual(["audio_chunk", "end_turn"]);
  });

  it("a 4401 close logs out from the auth store", async () => {
    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await waitFor(() => expect(openSockets.length).toBe(1));
    act(() => { lastSocket().simulateOpen(); });
    act(() => { lastSocket().simulateClose(4401, "Unauthorized"); });
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().token).toBeNull();
    });
    expect(result.current.isConnected).toBe(false);
  });

  it("an unexpected close sets error and returns to idle", async () => {
    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await waitFor(() => expect(openSockets.length).toBe(1));
    act(() => {
      lastSocket().simulateFrame({
        type: "state_change", payload: { state: "listening" },
      });
      lastSocket().simulateClose(1006, "abnormal");
    });
    expect(result.current.error).toContain("connection dropped");
    expect(result.current.phase).toBe("idle");
  });

  it("session_summary captures evaluation for completion POST", async () => {
    const mockComplete = completeSession as jest.MockedFunction<typeof completeSession>;
    mockComplete.mockResolvedValue({
      session_id: "session-1", idempotent_replayed: false,
      xp_eligible: true,
      xp: { session_xp: 48, quest_xp: 20, total_xp: 68, xp_total: 68, xp_today: 68, level: 1, progress_to_next_level: 68 },
      skills: [], streak_current: 1, streak_longest: 1,
      quests: [], newly_awarded_badges: [],
      completed_at: "2026-08-22T20:05:00Z",
    });

    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await waitFor(() => expect(openSockets.length).toBe(1));
    act(() => {
      lastSocket().simulateOpen();
      lastSocket().simulateFrame({ type: "ai_text_chunk", payload: { text: "Hello there", is_final: true } });
      lastSocket().simulateFrame({
        type: "session_summary",
        payload: {
          evaluation: {
            scores: { fluency: 90, pronunciation: 85, grammar: 80, vocabulary: 88, coherence: 82, task_completion: 92 },
            overall_score: 86,
            insights: ["Great pace!"],
          },
          transcript: [{ role: "assistant", text: "Hello there" }],
        },
      });
    });
    await act(async () => { await result.current.finishSession(); });

    expect(mockComplete).toHaveBeenCalledTimes(1);
    const payload = mockComplete.mock.calls[0][0];
    expect(payload.evaluation.overall_score).toBe(86);
    expect(payload.evaluation.scores.fluency).toBe(90);
  });
});
