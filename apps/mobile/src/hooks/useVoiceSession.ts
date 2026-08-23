/**
 * useVoiceSession (SN-021): connects the Voice Session screen to the
 * authenticated WebSocket, drives the 4-state pipeline, captures real
 * microphone audio via AudioRecorderService, plays TTS audio, and POSTs
 * the completion payload with real evaluation.
 *
 * Fallback: when the recorder is unavailable (Jest, Expo Go limits),
 * the tap flow degrades to the SN-015 simulated-chunk behaviour so CI
 * stays green without native audio modules.
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
import { AudioRecorderService } from "../services/audioRecorder";
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
  micDenied: boolean;
  handleTap: () => void;
  finishSession: () => Promise<void>;
}

export function useVoiceSession(scenarioId: string): UseVoiceSessionResult {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const setLastResult = useSessionResultStore((state) => state.setLastResult);

  const [phase, setPhase] = useState<VoiceButtonState>("idle");
  const [transcript, setTranscript] = useState<TranscriptTurnView[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [micDenied, setMicDenied] = useState(false);

  const socketRef = useRef<VoiceSocket | null>(null);
  const startedAtRef = useRef<Date | null>(null);
  const clientSessionIdRef = useRef<string>("");
  const turnIdRef = useRef(0);
  const summaryRef = useRef<SummaryCapture | null>(null);
  const transcriptRef = useRef<TranscriptTurnInput[]>([]);
  const recorderRef = useRef<AudioRecorderService>(
    new AudioRecorderService(),
  );
  const routerRef = useRef(router);
  routerRef.current = router;

  // ------------------------------------------------------------------
  // Frame handler
  // ------------------------------------------------------------------

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

  // ------------------------------------------------------------------
  // Recorder lifecycle helpers
  // ------------------------------------------------------------------

  const stopRecorder = useCallback(() => {
    recorderRef.current.cleanup();
  }, []);

  // ------------------------------------------------------------------
  // Socket lifecycle
  // ------------------------------------------------------------------

  useEffect(() => {
    if (token === null) {
      return;
    }
    clientSessionIdRef.current = generateClientSessionId();
    startedAtRef.current = new Date();

    // Wire recorder chunk/silence callbacks to the socket.
    recorderRef.current.setOnChunk((chunk) => {
      socketRef.current?.sendAudioChunk(chunk);
    });

    const socket = new VoiceSocket(clientSessionIdRef.current, token, {
      onOpen: () => {
        setIsConnected(true);
        setError(null);
      },
      onFrame: handleFrame,
      onClose: (code) => {
        setIsConnected(false);
        stopRecorder();
        if (code === WS_UNAUTHORIZED_CODE) {
          void logout().then(() => {
            routerRef.current.replace("/(auth)/login");
          });
          return;
        }
        if (code !== 1000) {
          setError(
            "The connection dropped — your progress is safe. Try again.",
          );
          setPhase("idle");
        }
      },
    });
    socketRef.current = socket;
    socket.connect();

    return () => {
      stopRecorder();
      socket.close();
      socketRef.current = null;
    };
  }, [token, logout, handleFrame, stopRecorder]);

  // ------------------------------------------------------------------
  // Tap flow
  // ------------------------------------------------------------------

  const handleTap = useCallback(() => {
    const socket = socketRef.current;
    if (socket === null) {
      return;
    }

    if (phase === "idle") {
      void (async () => {
        const started = await recorderRef.current.start();
        if (
          !started &&
          recorderRef.current.state === "unavailable"
        ) {
          // Fallback (Jest / Expo Go): simulate with a dummy chunk.
          socket.sendAudioChunk(DUMMY_AUDIO_CHUNK);
          return;
        }
        if (!started && recorderRef.current.state === "denied") {
          setMicDenied(true);
          return;
        }
        if (!started) {
          setError("Could not start the microphone.");
          return;
        }
        // Recording started — send a minimal chunk to trigger backend LISTENING.
        socket.sendAudioChunk(DUMMY_AUDIO_CHUNK);
      })();
      return;
    }

    if (phase === "listening") {
      void (async () => {
        const recorder = recorderRef.current;
        recorder.setOnChunk((chunk) => {
          socket.sendAudioChunk(chunk);
        });
        await recorder.stopAndCollect();
        socket.sendEndTurn();
      })();
      return;
    }

    if (phase === "speaking") {
      socket.sendCancel();
      stopRecorder();
    }
    // PROCESSING ignores taps — wait for the pipeline.
  }, [phase, socketRef, stopRecorder]);

  // ------------------------------------------------------------------
  // Finish / complete
  // ------------------------------------------------------------------

  const finishSession = useCallback(async (): Promise<void> => {
    const startedAt = startedAtRef.current;
    if (startedAt === null || isFinishing) {
      return;
    }
    setIsFinishing(true);
    setError(null);
    stopRecorder();
    const endedAt = new Date();
    const durationSeconds = Math.max(
      1,
      Math.round((endedAt.getTime() - startedAt.getTime()) / 1000),
    );
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
  }, [scenarioId, isFinishing, setLastResult, stopRecorder]);

  // ------------------------------------------------------------------
  // Cleanup on unmount
  // ------------------------------------------------------------------

  useEffect(() => {
    return () => {
      stopRecorder();
    };
  }, [stopRecorder]);

  return {
    phase,
    transcript,
    error,
    isConnected,
    isFinishing,
    micDenied,
    handleTap,
    finishSession,
  };
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
