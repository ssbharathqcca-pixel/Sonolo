/**
 * Tests for AudioRecorderService (SN-021).
 * Mocks expo-av and expo-file-system to test chunking, permissions,
 * and lifecycle without native modules.
 */

const mockRecordingInstance = {
  stopAndUnloadAsync: jest.fn(async () => {}),
  getURI: jest.fn(() => "file:///tmp/test-recording.m4a"),
};

jest.mock("expo-av", () => ({
  Audio: {
    requestPermissionsAsync: jest.fn(async () => ({
      granted: true,
      status: "granted",
    })),
    setAudioModeAsync: jest.fn(async () => {}),
    Recording: {
      createAsync: jest.fn(async (_options: unknown, callback: unknown) => {
        (globalThis as any).__recorderStatusCallback = callback;
        return { recording: mockRecordingInstance };
      }),
    },
    AndroidOutputFormat: { MPEG_4: "mpeg4", DEFAULT: "default" },
    AndroidAudioEncoder: { AAC: "aac", DEFAULT: "default" },
    IOSOutputFormat: { MPEG_4: "mpeg4" },
    IOSAudioQuality: { HIGH: "high", MEDIUM: "medium", LOW: "low" },
  },
}));

jest.mock("expo-file-system", () => ({
  cacheDirectory: "/tmp/",
  readAsStringAsync: jest.fn(async () => "QUJDREVGRw=="), // "ABCDEFG" b64
  deleteAsync: jest.fn(async () => {}),
  writeAsStringAsync: jest.fn(async () => {}),
  EncodingType: { Base64: "base64", UTF8: "utf8" },
}));

import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import {
  AudioRecorderService,
} from "../services/audioRecorder";

describe("AudioRecorderService", () => {
  let recorder: AudioRecorderService;

  beforeEach(() => {
    jest.clearAllMocks();
    recorder = new AudioRecorderService();
    (mockRecordingInstance.stopAndUnloadAsync as jest.Mock).mockClear();
    (mockRecordingInstance.getURI as jest.Mock).mockClear().mockReturnValue(
      "file:///tmp/test-recording.m4a",
    );
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(
      "QUJDREVGRw==",
    );
  });

  it("start returns true and sets state to recording when permitted", async () => {
    const started = await recorder.start();
    expect(started).toBe(true);
    expect(recorder.state).toBe("recording");
    expect(Audio.requestPermissionsAsync).toHaveBeenCalled();
    expect(Audio.Recording.createAsync).toHaveBeenCalled();
  });

  it("start returns false and sets state to denied when permission rejected", async () => {
    (Audio.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      granted: false,
      status: "denied",
    });
    const started = await recorder.start();
    expect(started).toBe(false);
    expect(recorder.state).toBe("denied");
  });

  it("stopAndCollect reads file as base64 and emits chunks via onChunk", async () => {
    await recorder.start();
    const chunks: string[] = [];
    recorder.setOnChunk((chunk) => chunks.push(chunk));
    const result = await recorder.stopAndCollect();

    expect(result).toBe("QUJDREVGRw==");
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    expect(chunks.join("")).toBe("QUJDREVGRw==");
    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(
      "file:///tmp/test-recording.m4a",
      { encoding: "base64" },
    );
    expect(recorder.state).toBe("idle");
  });

  it("stopAndCollect returns null when no recording is active", async () => {
    const result = await recorder.stopAndCollect();
    expect(result).toBeNull();
  });

  it("cleanup resets state even after error", async () => {
    await recorder.start();
    (mockRecordingInstance.stopAndUnloadAsync as jest.Mock)
      .mockRejectedValueOnce(new Error("already stopped"));
    recorder.cleanup();
    expect(recorder.state).toBe("idle");
    expect(recorder.isRecording).toBe(false);
  });
});
