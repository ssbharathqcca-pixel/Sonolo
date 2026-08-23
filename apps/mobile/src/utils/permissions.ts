/**
 * Runtime microphone permission helper (SN-017).
 *
 * Voice sessions cannot start without recording access, so every entry
 * point funnels through `ensureMicPermission`. A denial surfaces a calm
 * alert that routes the user to the OS settings screen — the only way
 * to recover once Android/iOS has applied a permanent denial.
 */

import { Audio } from "expo-av";
import { Alert, Linking } from "react-native";

/**
 * Request (or confirm) microphone access.
 *
 * Resolves true when recording is allowed. On any denial the user is
 * shown an alert with an "Open Settings" shortcut and false is
 * returned so callers can stay on screen without crashing.
 */
export async function ensureMicPermission(): Promise<boolean> {
  const permission = await Audio.requestPermissionsAsync();
  if (permission.status === "granted") {
    return true;
  }

  Alert.alert(
    "Microphone access needed",
    "Sonolo practices out loud. Enable the microphone in Settings so your speaking can be heard and scored.",
    [
      { text: "Not now", style: "cancel" },
      {
        text: "Open Settings",
        onPress: () => {
          void Linking.openSettings();
        },
      },
    ],
  );
  return false;
}
