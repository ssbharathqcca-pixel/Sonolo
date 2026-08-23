/**
 * useVoiceSession (SN-015): connects the Voice Session screen to the
 * authenticated backend WebSocket and drives the 4-state pipeline.
 *
 * - Opens `ws://.../ws/voice/{uuid}?token=<JWT>` on mount.
 * - Tap flow: IDLE tap -> send audio chunk (LISTENING); LISTENING tap
 *   -> end_turn (PROCESSING -> SPEAKING); SPEAKING tap -> cancel.
 * - Collects transcript turns from ai_text_chunk frames (first chunk
 *   after a turn is the recognized user speech, then the tutor reply).
 * - finish() compiles the transcript and POSTs /sessions/complete with
 *   a deterministic placeholder evaluation, stores the gamification
 *   result, and navigates to the Feedback screen.
 * - Close code 4401 logs the user out (SN-013 flow) and returns to
 *   login; any other unexpected close shows a gentle error and idles.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

import {
  buildMockEvaluation,
  completeSession,
  getApiErrorMessage,
  type SessionCompleteResponse,
  type TranscriptTurnInput,
} from "../api/client";
import { useAuthStore } from "../stores/authStore";
import { useSessionResultStore } from "../stores/sessionResultStore";
import type { VoiceButtonState } from "../components/VoiceButton";
import {
  VoiceSocket,
  WS_UNAUTHORIZED_CODE,
  type ServerFrame,
} from "../services/voiceSocket";

const DUMMY_AUDIO_CHUNK = "YXVkaW8="; // base64("audio") until capture lands.

export interface TranscriptTurnView {
  id: number;
  role: "user" | "tutor";
  text: string;
}

export interface UseVoiceSessionResult {
  phase: VoiceButtonState;
  transcript: TranscriptTurnView[];
  error: string | null;
  isConnected: boolean;
  isFinishing: boolean;
  handleTap: () => void;
  finishSession: () => Promise<void>;
}

export function useVoiceSession(scenarioId: string): UseVoiceSessionResult {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const setLastResult = useSessionResultStore(
    (state) => state.setLastResult,
  );

  const [phase, setPhase] = useState<VoiceButtonState>("idle");
  const [transcript, setTranscript] = useState<TranscriptTurnView[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const socketRef = useRef<VoiceSocket | null>(null);
  const startedAtRef = useRef<Date | null>(null);
  const clientSessionIdRef = useRef<string>("");
  const turnIdRef = useRef(0);
  const nextRoleRef = useRef<"user" | "tutor">("user");
  const transcriptRef = useRef<TranscriptTurnInput[]>([]);
  // Router identity can change between renders; keep it out of the
  // socket effect's dependencies so the connection is never recycled.
  const routerRef = useRef(router);
  routerRef.current = router;

  const handleFrame = useCallback((frame: ServerFrame) => {
    if (frame.type === "state_change") {
      const state = frame.payload["state"];
      if (typeof state === "string") {
        // Backend "processing" maps to the button's "thinking" state.
        const mobileState =
          state === "processing" ? "thinking" : (state as VoiceButtonState);
        setPhase(mobileState);
      }
      return;
    }
    if (frame.type === "ai_text_chunk") {
      const text = frame.payload["text"];
      if (typeof text === "string" && text !== "") {
        const viewRole = nextRoleRef.current;
        nextRoleRef.current = viewRole === "user" ? "tutor" : "user";
        turnIdRef.current += 1;
        transcriptRef.current = [
          ...transcriptRef.current,
          // The wire protocol uses "assistant"; the view shows "tutor".
          {
            role: viewRole === "user" ? ("user" as const) : ("assistant" as const),
            text,
          },
        ];
        setTranscript((current) => [
          ...current,
          { id: turnIdRef.current, role: viewRole, text },
        ]);
      }
    }
  }, []);

  useEffect(() => {
    if (token === null) {
      return;
    }
    clientSessionIdRef.current = generateClientSessionId();
    startedAtRef.current = new Date();
    const socket = new VoiceSocket(clientSessionIdRef.current, token, {
      onOpen: () => {
        setIsConnected(true);
        setError(null);
      },
      onFrame: handleFrame,
      onClose: (code) => {
        setIsConnected(false);
        if (code === WS_UNAUTHORIZED_CODE) {
          void logout().then(() => {
            routerRef.current.replace("/(auth)/login");
          });
          return;
        }
        if (code !== 1000) {
          setError("The connection dropped — your progress is safe. Try again.");
          setPhase("idle");
        }
      },
    });
    socketRef.current = socket;
    socket.connect();
    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [token, logout, handleFrame]);

  const handleTap = useCallback(() => {
    const socket = socketRef.current;
    if (socket === null) {
      return;
    }
    if (phase === "idle") {
      socket.sendAudioChunk(DUMMY_AUDIO_CHUNK);
    } else if (phase === "listening") {
      socket.sendEndTurn();
    } else if (phase === "speaking") {
      socket.sendCancel();
    }
    // PROCESSING ignores taps — wait for the pipeline.
  }, [phase]);

  const finishSession = useCallback(async (): Promise<void> => {
    const socket = socketRef.current;
    const startedAt = startedAtRef.current;
    if (socket === null || startedAt === null || isFinishing) {
      return;
    }    setIsFinishing(true);
    setError(null);
    const endedAt = new Date();
    const durationSeconds = Math.max(
      1,
      Math.round((endedAt.getTime() - startedAt.getTime()) / 1000),
    );
    try {
      const result: SessionCompleteResponse = await completeSession({
        client_session_id: clientSessionIdRef.current,
        scenario_id: scenarioId,
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
        duration_seconds: durationSeconds,
        transcript: transcriptRef.current,
        evaluation: buildMockEvaluation(),
      });
      setLastResult(result);
      socket.close();
      socketRef.current = null;
      routerRef.current.replace(`/feedback/${clientSessionIdRef.current}`);
    } catch (completionError) {
      setIsFinishing(false);
      setError(getApiErrorMessage(completionError));
    }
  }, [scenarioId, isFinishing, setLastResult]);

  return {
    phase,
    transcript,
    error,
    isConnected,
    isFinishing,
    handleTap,
    finishSession,
  };
}

function generateClientSessionId(): string {
  // UUID-v4-shaped id from Math.random: this is a client-generated
  // idempotency key, not a security primitive.
  const hex = (count: number): string =>
    Array.from(
      { length: count },
      () => Math.floor(Math.random() * 16).toString(16),
    ).join("");
  return `${hex(8)}-${hex(4)}-4${hex(3)}-${hex(4)}-${hex(12)}`;
}
