/**
 * Thin typed wrapper over the voice WebSocket (SN-007 protocol).
 *
 * The hook (useVoiceSession) owns state-machine logic; this class only
 * opens the authenticated socket, sends client frames, and forwards
 * server frames / close events.
 */

import { voiceSocketUrl } from "../api/client";

export type ServerFrame = {
  type: string;
  payload: Record<string, unknown>;
};

export interface VoiceSocketHandlers {
  onOpen: () => void;
  onFrame: (frame: ServerFrame) => void;
  onClose: (code: number, reason: string) => void;
}

/** Close code the backend uses for missing/invalid/expired JWTs. */
export const WS_UNAUTHORIZED_CODE = 4401;

export class VoiceSocket {
  private socket: WebSocket | null = null;

  constructor(
    private readonly sessionId: string,
    private readonly token: string,
    private readonly handlers: VoiceSocketHandlers,
  ) {}

  /** The exact URL this socket will connect to (exposed for tests). */
  get url(): string {
    return voiceSocketUrl(this.sessionId, this.token);
  }

  connect(): void {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = () => {
      this.handlers.onOpen();
    };
    this.socket.onmessage = (event: WebSocketMessageEvent) => {
      try {
        const parsed = JSON.parse(event.data as string) as ServerFrame;
        if (typeof parsed.type === "string") {
          this.handlers.onFrame(parsed);
        }
      } catch {
        // Ignore malformed frames; the server also skips them.
      }
    };
    this.socket.onclose = (event: WebSocketCloseEvent) => {
      this.handlers.onClose(event.code ?? 1006, event.reason ?? "");
    };
    this.socket.onerror = () => {
      // onclose always follows onerror; nothing to do here.
    };
  }

  /** Send a base64 audio chunk (starts LISTENING on the backend). */
  sendAudioChunk(audio: string): void {
    this.send({
      type: "audio_chunk",
      payload: { audio, session_id: this.sessionId },
    });
  }

  /** End the speaking turn (backend runs the pipeline). */
  sendEndTurn(): void {
    this.send({
      type: "end_turn",
      payload: { session_id: this.sessionId },
    });
  }

  /** Cancel playback / abort the current turn. */
  sendCancel(): void {
    this.send({ type: "cancel", payload: { session_id: this.sessionId } });
  }

  close(): void {
    this.socket?.close();
    this.socket = null;
  }

  private send(frame: unknown): void {
    if (this.socket !== null && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(frame));
    }
  }
}
