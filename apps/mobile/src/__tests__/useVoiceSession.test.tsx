/**
 * Tests for useVoiceSession (SN-015): authenticated socket URL, the
 * 4401 -> logout flow, transcript collection, and tap frame sends.
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

  close(): void {
    /* recorded by the test via onclose invocation */
  }

  // Test helpers.
  simulateOpen(): void {
    this.onopen?.();
  }

  simulateFrame(frame: unknown): void {
    this.onmessage?.({ data: JSON.stringify(frame) });
  }

  simulateClose(code: number, reason = ""): void {
    this.onclose?.({ code, reason });
  }
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

jest.mock("react-native", () => ({
  // Minimal RN surface the hook's dependency tree touches.
  AppState: { addEventListener: jest.fn(() => ({ remove: jest.fn() })) },
}));

jest.mock("../api/client", () => {
  const actualModule = jest.requireActual("../api/client");
  return {
    ...actualModule,
    completeSession: jest.fn(),
  };
});

import { useVoiceSession } from "../hooks/useVoiceSession";
import { useAuthStore } from "../stores/authStore";
import { completeSession } from "../api/client";

describe("useVoiceSession", () => {
  beforeEach(() => {
    openSockets.length = 0;
    (global as { WebSocket?: unknown }).WebSocket = FakeSocket;
    useAuthStore.setState({
      user: null,
      token: "test-token",
      isLoading: false,
      isHydrated: true,
      isAuthenticated: true,
    });
  });

  function lastSocket(): FakeSocket {
    return openSockets[openSockets.length - 1];
  }

  it("opens the WebSocket with the authenticated token URL", async () => {
    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await waitFor(() => {
      expect(openSockets.length).toBe(1);
    });
    expect(lastSocket().url).toContain("/ws/voice/");
    expect(lastSocket().url).toContain("token=test-token");
    expect(result.current.isConnected).toBe(false); // until onopen fires
    act(() => {
      lastSocket().simulateOpen();
    });
    expect(result.current.isConnected).toBe(true);
  });

  it("collects transcript turns from ai_text_chunk frames", async () => {
    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await waitFor(() => {
      expect(openSockets.length).toBe(1);
    });
    act(() => {
      lastSocket().simulateFrame({
        type: "ai_text_chunk",
        payload: { text: "Could I get a coffee?", is_final: true },
      });
      lastSocket().simulateFrame({
        type: "ai_text_chunk",
        payload: { text: "Great choice!", is_final: true },
      });
    });
    expect(result.current.transcript.map((turn) => turn.role)).toEqual([
      "user",
      "tutor",
    ]);
    expect(result.current.transcript[0].text).toBe("Could I get a coffee?");
  });

  it("sends audio_chunk on idle tap and end_turn while listening", async () => {
    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await waitFor(() => {
      expect(openSockets.length).toBe(1);
    });
    act(() => {
      lastSocket().simulateOpen();
      result.current.handleTap(); // idle -> audio_chunk
    });
    act(() => {
      lastSocket().simulateFrame({
        type: "state_change",
        payload: { state: "listening" },
      });
    });
    act(() => {
      result.current.handleTap(); // listening -> end_turn
    });
    const frames = lastSocket().sent.map((raw) => JSON.parse(raw) as { type: string });
    expect(frames.map((frame) => frame.type)).toEqual(["audio_chunk", "end_turn"]);
  });

  it("a 4401 close logs the user out of the auth store", async () => {
    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await waitFor(() => {
      expect(openSockets.length).toBe(1);
    });
    act(() => {
      lastSocket().simulateOpen();
    });
    act(() => {
      lastSocket().simulateClose(4401, "Unauthorized");
    });
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().token).toBeNull();
    });
    expect(result.current.isConnected).toBe(false);
  });

  it("an unexpected close sets a gentle error and returns to idle", async () => {
    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await waitFor(() => {
      expect(openSockets.length).toBe(1);
    });
    act(() => {
      lastSocket().simulateFrame({
        type: "state_change",
        payload: { state: "listening" },
      });
      lastSocket().simulateClose(1006, "abnormal");
    });
    expect(result.current.error).toContain("connection dropped");
    expect(result.current.phase).toBe("idle");
  });

  it("finishSession posts the completion payload and stores the result", async () => {
    const mockComplete = completeSession as jest.MockedFunction<
      typeof completeSession
    >;
    mockComplete.mockResolvedValue({
      session_id: "session-1",
      idempotent_replayed: false,
      xp_eligible: true,
      xp: {
        session_xp: 48,
        quest_xp: 20,
        total_xp: 68,
        xp_total: 68,
        xp_today: 68,
        level: 1,
        progress_to_next_level: 68,
      },
      skills: [],
      streak_current: 1,
      streak_longest: 1,
      quests: [],
      newly_awarded_badges: [],
      completed_at: "2026-08-22T20:05:00Z",
    });

    const { result } = renderHook(() => useVoiceSession("scenario-1"));
    await waitFor(() => {
      expect(openSockets.length).toBe(1);
    });
    act(() => {
      lastSocket().simulateOpen();
      lastSocket().simulateFrame({
        type: "ai_text_chunk",
        payload: { text: "Hello there", is_final: true },
      });
    });
    await act(async () => {
      await result.current.finishSession();
    });

    expect(mockComplete).toHaveBeenCalledTimes(1);
    const payload = mockComplete.mock.calls[0][0];
    expect(payload.scenario_id).toBe("scenario-1");
    expect(payload.duration_seconds).toBeGreaterThanOrEqual(1);
    expect(payload.transcript).toEqual([
      { role: "user", text: "Hello there" },
    ]);
    expect(payload.evaluation.overall_score).toBe(75);
  });
});
