/**
 * Microphone capture service (SN-021).
 *
 * Records 16 kHz mono AAC via expo-av. On stop, reads the complete
 * file as base64 and slices it into ~300 ms `audio_chunk` payloads.
 *
 * Permission-denied is surfaced as a distinct state (not thrown) so
 * the hook can render a mic-denied UI instead of crashing.
 */

import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

export type RecorderState = "idle" | "recording" | "denied" | "unavailable";

export interface RecorderStatusHint {
  /** True when consecutive silent metering readings exceed threshold. */
  silent: boolean;
}

/** ~300 ms of 64 kbps mono AAC ≈ 24 000 bits ≈ 3 000 raw bytes. */
const CHUNK_BYTE_TARGET = 3000;

/** Consecutive metering readings below threshold before hinting silence. */
const SILENT_UPDATE_COUNT = 3;

const SILENCE_THRESHOLD_DB = -45;

const RECORDING_OPTIONS: Audio.RecordingOptions = {
  isMeteringEnabled: true,
  android: {
    extension: ".m4a",
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 64000,
  },
  ios: {
    extension: ".m4a",
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 64000,
  },
  web: {
    bitsPerSecond: 64000,
  },
};

export class AudioRecorderService {
  private recording: Audio.Recording | null = null;
  private _state: RecorderState = "idle";
  private _silentReadings = 0;
  private onChunk: ((base64Chunk: string) => void) | null = null;
  private onSilenceHint: (() => void) | null = null;

  get state(): RecorderState {
    return this._state;
  }

  get isRecording(): boolean {
    return this._state === "recording";
  }

  /** Register the callback that receives base64 audio chunks. */
  setOnChunk(callback: ((chunk: string) => void) | null): void {
    this.onChunk = callback;
  }

  /** Register the silence-hint callback (client-side complement only). */
  setOnSilenceHint(callback: (() => void) | null): void {
    this.onSilenceHint = callback;
  }

  /**
   * Request mic permission and begin recording.
   * Returns false on permission denial or native-module failure.
   */
  async start(): Promise<boolean> {
    if (this._state === "recording") {
      return true;
    }
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        this._state = "denied";
        return false;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        RECORDING_OPTIONS,
        (status) => this._handleStatus(status),
      );
      this.recording = recording;
      this._state = "recording";
      this._silentReadings = 0;
      return true;
    } catch (error) {
      // Native module unavailable (Jest, Expo Go limits) — caller falls back.
      console.warn("[audioRecorder] start failed:", error);
      this._state = "unavailable";
      return false;
    }
  }

  /**
   * Stop the recording, read the file, slice into chunks, invoke
   * `onChunk` for each, clean up, and return the full base64 payload
   * (null on failure).
   */
  async stopAndCollect(): Promise<string | null> {
    if (this.recording === null) {
      return null;
    }
    const rec = this.recording;
    this.recording = null;
    try {
      await rec.stopAndUnloadAsync();
    } catch (error) {
      logger_warn("stopAndUnloadAsync failed", error);
      this._state = "idle";
      return null;
    }
    this._state = "idle";

    const uri = rec.getURI();
    if (!uri) {
      logger_warn("Recording URI is null after unload.");
      return null;
    }

    try {
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // Clean up the temp file (best-effort).
      await FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
      this._emitChunks(base64Data);
      return base64Data;
    } catch (error) {
      logger_warn("Failed to read recording file:", error);
      return null;
    }
  }

  /** Best-effort teardown for unmount or error paths. */
  cleanup(): void {
    if (this.recording !== null) {
      this.recording.stopAndUnloadAsync().catch(() => {});
      this.recording = null;
    }
    this._state = "idle";
    this._silentReadings = 0;
  }

  // ------------------------------------------------------------------

  private _handleStatus(status: Audio.RecordingStatus): void {
    if (status.isDoneRecording || !status.metering !== undefined) {
      // Guard: some platforms report undefined metering.
    }
    if (
      typeof status.metering === "number" &&
      status.metering < SILENCE_THRESHOLD_DB
    ) {
      this._silentReadings += 1;
    } else {
      this._silentReadings = 0;
    }
    if (this._silentReadings >= SILENT_UPDATE_COUNT) {
      this.onSilenceHint?.();
    }
  }

  private _emitChunks(base64Data: string): void {
    if (this.onChunk === null || base64Data === "") {
      return;
    }
    for (let offset = 0; offset < base64Data.length; offset += CHUNK_BYTE_TARGET * 2) {
      // Base64 encodes 3 bytes into 4 chars; target ~300 ms of audio.
      const length = Math.min(CHUNK_BYTE_TARGET * 2, base64Data.length - offset);
      this.onChunk(base64Data.substr(offset, length));
    }
  }
}

function logger_warn(message: string, error?: unknown): void {
  console.warn(`[audioRecorder] ${message}`, error ?? "");
}
