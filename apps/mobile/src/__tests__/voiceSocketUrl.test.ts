/**
 * Tests for the authenticated voice WebSocket URL builder (SN-015).
 */

import { API_BASE_URL, voiceSocketUrl } from "../api/client";

describe("voiceSocketUrl", () => {
  it("builds the authenticated ws:// URL with the token", () => {
    const url = voiceSocketUrl(
      "11111111-2222-4333-8444-555555555555",
      "jwt-token-123",
    );
    expect(url).toBe(
      `${API_BASE_URL.replace(/^http/, "ws")}/ws/voice/11111111-2222-4333-8444-555555555555?token=jwt-token-123`,
    );
    expect(url.startsWith("ws://")).toBe(true);
  });

  it("encodes reserved characters in the token", () => {
    const url = voiceSocketUrl("abc", "tok/en&x=y");
    expect(url).toContain("token=tok%2Fen%26x%3Dy");
  });

  it("converts https base URLs to wss", () => {
    const original = process.env.EXPO_PUBLIC_API_URL;
    process.env.EXPO_PUBLIC_API_URL = "https://api.sonolo.app";
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fresh = require("../api/client") as typeof import("../api/client");
    expect(fresh.API_BASE_URL).toBe("https://api.sonolo.app");
    expect(fresh.voiceSocketUrl("s", "t").startsWith("wss://")).toBe(true);
    if (original === undefined) {
      delete process.env.EXPO_PUBLIC_API_URL;
    } else {
      process.env.EXPO_PUBLIC_API_URL = original;
    }
    jest.resetModules();
  });
});
