/**
 * Onboarding step 3 — microphone check (SN-017).
 *
 * Requests recording permission via `ensureMicPermission`, captures a
 * three-second sample with expo-av, plays it back, and finishes
 * onboarding on success. The chosen goal rides in as a route param
 * from the Goals screen and is persisted device-side by the auth
 * store (the backend exposes no profile-write endpoint yet).
 */

import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { Check, Mic, Play } from "lucide-react-native";

import { GlassCard } from "../../src/components/GlassCard";
import { ensureMicPermission } from "../../src/utils/permissions";
import { useAuthStore } from "../../src/stores/authStore";
import { colors } from "../../src/theme/colors";

type MicCheckPhase = "ready" | "requesting" | "recording" | "playback" | "done";

const SAMPLE_DURATION_MS = 3000;
const DEFAULT_GOAL = "clb-5";

export default function MicCheckScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ goal?: string }>();
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const isFinishing = useAuthStore((state) => state.isLoading);

  const [phase, setPhase] = useState<MicCheckPhase>("ready");
  const [errorText, setErrorText] = useState<string | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Unmount cleanup: never leak a live recorder, player, or timer.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      void recordingRef.current?.stopAndUnloadAsync().catch(() => undefined);
      void soundRef.current?.unloadAsync().catch(() => undefined);
    };
  }, []);

  const runMicCheck = async (): Promise<void> => {
    setErrorText(null);
    setPhase("requesting");
    try {
      const granted = await ensureMicPermission();
      if (!granted) {
        setPhase("ready");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      setPhase("recording");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = recording;

      await new Promise<void>((resolve) => {
        timerRef.current = setTimeout(resolve, SAMPLE_DURATION_MS);
      });
      timerRef.current = null;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recordingRef.current = null;
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      if (uri === null) {
        throw new Error("Recording produced no audio file.");
      }

      setPhase("playback");
      const { sound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      await sound.playAsync();
      await new Promise<void>((resolve) => {
        void sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            resolve();
          }
        });
      });
      await sound.unloadAsync();
      soundRef.current = null;

      setPhase("done");
    } catch (error) {
      recordingRef.current = null;
      soundRef.current = null;
      try {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      } catch {
        // Audio mode restore is best-effort; session screens set their own.
      }
      setErrorText(
        error instanceof Error
          ? `Mic check failed: ${error.message}`
          : "Mic check failed. Please try again.",
      );
      setPhase("ready");
    }
  };

  const finishOnboarding = async (): Promise<void> => {
    setErrorText(null);
    try {
      await completeOnboarding(params.goal ?? DEFAULT_GOAL);
      router.replace("/(tabs)");
    } catch {
      setErrorText("Could not save your goal. Please try again.");
    }
  };

  const phaseCopy: Record<MicCheckPhase, string> = {
    ready: "Run a quick mic check so your first session hears you clearly.",
    requesting: "Checking permission…",
    recording: "Listening — say something like “Hey Sonolo!”",
    playback: "Playing your sample back…",
    done: "Sounds good! Your mic is ready.",
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Microphone check</Text>
      <GlassCard style={styles.card}>
        <View style={styles.iconWell}>
          {phase === "done" ? (
            <Check color={colors.success} size={26} />
          ) : (
            <Mic color={colors.auroraTeal} size={26} />
          )}
        </View>
        <Text style={styles.phaseText}>{phaseCopy[phase]}</Text>
        {phase === "recording" ? (
          <ActivityIndicator color={colors.warmCoral} />
        ) : null}

        {phase === "ready" || phase === "requesting" ? (
          <Pressable
            style={styles.primaryButton}
            accessibilityLabel="Run mic check"
            disabled={phase === "requesting"}
            onPress={() => {
              void runMicCheck();
            }}
          >
            <Play color="#FFFFFF" size={16} />
            <Text style={styles.primaryButtonText}>Test my microphone</Text>
          </Pressable>
        ) : null}

        {phase === "recording" ? (
          <Text style={styles.hintText}>Recording for 3 seconds…</Text>
        ) : null}

        {phase === "done" ? (
          <Pressable
            style={styles.primaryButton}
            accessibilityLabel="Finish onboarding"
            disabled={isFinishing}
            onPress={() => {
              void finishOnboarding();
            }}
          >
            {isFinishing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Start learning</Text>
            )}
          </Pressable>
        ) : null}

        {errorText !== null ? (
          <Text role="alert" style={styles.errorText}>
            {errorText}
          </Text>
        ) : null}
      </GlassCard>

      <Text style={styles.finePrint}>
        Your sample stays on this device. Sessions are scored from the live
        conversation only.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.nightSky,
  },
  content: {
    paddingHorizontal: 24,
    gap: 16,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "800",
  },
  card: {
    alignItems: "center",
    gap: 14,
    paddingVertical: 28,
  },
  iconWell: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.auroraTealSoft,
  },
  phaseText: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
  },
  hintText: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.auroraTeal,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 28,
    marginTop: 4,
    minWidth: 220,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  finePrint: {
    color: colors.textTertiary,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});
