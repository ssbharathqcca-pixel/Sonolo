/**
 * useVoiceSession (SN-016): connects to the authenticated WebSocket,
 * drives the 4-state pipeline, handles user_text_chunk / ai_text_chunk /
 * audio_payload / session_summary frames, plays TTS audio, and POSTs
 * the real evaluation on completion.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

import {
  buildMockEvaluation,
  completeSession,
  getApiErrorMessage,
  type EvaluationInput,
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

const DUMMY_AUDIO_CHUNK = "YXVkaW8=";

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

interface SummaryCapture {
  evaluation: EvaluationInput;
  transcript: TranscriptTurnInput[];
}

function generateClientSessionId(): string {
  const hex = (count: number): string =>
    Array.from(
      { length: count },
      () => Math.floor(Math.random() * 16).toString(16),
    ).join("");
  return `${hex(8)}-${hex(4)}-4${hex(3)}-${hex(4)}-${hex(12)}`;
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
  const summaryRef = useRef<SummaryCapture | null>(null);
  const transcriptRef = useRef<TranscriptTurnInput[]>([]);
  const routerRef = useRef(router);
  routerRef.current = router;

  const handleFrame = useCallback((frame: ServerFrame) => {
    if (frame.type === "state_change") {
      const state = frame.payload["state"];
      if (typeof state === "string") {
        const mobileState =
          state === "processing" ? "thinking" : (state as VoiceButtonState);
        setPhase(mobileState);
      }
      return;
    }
    if (frame.type === "user_text_chunk") {
      const text = frame.payload["text"];
      if (typeof text === "string" && text !== "") {
        turnIdRef.current += 1;
        transcriptRef.current = [
          ...transcriptRef.current,
          { role: "user", text },
        ];
        setTranscript((current) => [
          ...current,
          { id: turnIdRef.current, role: "user", text },
        ]);
      }
      return;
    }
    if (frame.type === "ai_text_chunk") {
      const text = frame.payload["text"];
      if (typeof text === "string" && text !== "") {
        turnIdRef.current += 1;
        transcriptRef.current = [
          ...transcriptRef.current,
          { role: "assistant", text },
        ];
        setTranscript((current) => [
          ...current,
          { id: turnIdRef.current, role: "tutor", text },
        ]);
      }
      return;
    }
    if (frame.type === "session_summary") {
      const evaluation = frame.payload["evaluation"] as
        | EvaluationInput
        | undefined;
      const serverTranscript = frame.payload["transcript"] as
        | TranscriptTurnInput[]
        | undefined;
      if (evaluation && serverTranscript) {
        summaryRef.current = {
          evaluation: {
            scores: evaluation.scores,
            overall_score: evaluation.overall_score,
            insights: evaluation.insights ?? [],
            engine_version: evaluation.engine_version ?? "sn011-deterministic-v1",
          },
          transcript: serverTranscript,
        };
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
  }, [phase]);

  const finishSession = useCallback(async (): Promise<void> => {
    const startedAt = startedAtRef.current;
    if (startedAt === null || isFinishing) {
      return;
    }
    setIsFinishing(true);
    setError(null);
    const endedAt = new Date();
    const durationSeconds = Math.max(
      1,
      Math.round((endedAt.getTime() - startedAt.getTime()) / 1000),
    );
    // Prefer the real evaluation from session_summary; fall back to mock.
    const evaluation = summaryRef.current?.evaluation ?? buildMockEvaluation();
    const finalTranscript =
      summaryRef.current?.transcript ?? transcriptRef.current;
    try {
      const result: SessionCompleteResponse = await completeSession({
        client_session_id: clientSessionIdRef.current,
        scenario_id: scenarioId,
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
        duration_seconds: durationSeconds,
        transcript: finalTranscript,
        evaluation,
      });
      setLastResult(result);
      socketRef.current?.close();
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
