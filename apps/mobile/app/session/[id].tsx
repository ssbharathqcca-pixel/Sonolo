/**
 * Voice session — wired to the authenticated backend (SN-015).
 *
 * The screen owns presentation; the useVoiceSession hook drives the
 * 4-state pipeline over the WebSocket, collects the transcript, and
 * posts the completion payload on finish.
 */

import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { useEffect } from "react";
import { ChevronLeft, Flag, Lightbulb } from "lucide-react-native";

import { GlassCard } from "../../src/components/GlassCard";
import {
  VoiceButton,
  voiceButtonCaption,
} from "../../src/components/VoiceButton";
import { useScenarioStore } from "../../src/stores/scenarioStore";
import { useVoiceSession } from "../../src/hooks/useVoiceSession";
import { colors } from "../../src/theme/colors";

const HINT_TEXT =
  "Tap the mic and answer out loud — even a short reply counts. Tap again when you finish.";

const BAR_COUNT = 24;
const BAR_BASE_HEIGHT = 5;
const BAR_MAX_EXTRA = 26;
const WAVE_LOOP_MS = 1400;

function WaveformBar({
  phase,
  color,
}: {
  phase: number;
  color: string;
}): JSX.Element {
  const height = useSharedValue(BAR_BASE_HEIGHT);
  const active = phase === 1 || phase === 3; // listening or speaking

  useEffect(() => {
    if (active) {
      height.value = withRepeat(
        withTiming(BAR_BASE_HEIGHT + BAR_MAX_EXTRA, {
          duration: WAVE_LOOP_MS,
          easing: Easing.linear,
        }),
        -1,
      );
    } else {
      cancelAnimation(height);
      height.value = withTiming(BAR_BASE_HEIGHT, { duration: 350 });
    }
  }, [active, height]);

  const style = useAnimatedStyle(() => ({ height: height.value }));
  return <Animated.View style={[styles.bar, style, { backgroundColor: color }]} />;
}

export default function VoiceSessionScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const scenarios = useScenarioStore((state) => state.scenarios);
  const selected = useScenarioStore((state) => state.selected);
  const scenario =
    scenarios.find((item) => item.id === params.id) ?? selected ?? null;

  const [hintVisible, setHintVisible] = useState(false);
  const {
    phase,
    transcript,
    error,
    isConnected,
    isFinishing,
    handleTap,
    finishSession,
  } = useVoiceSession(scenario?.id ?? params.id ?? "");

  const barColor = phase === "listening" ? colors.warmCoral : colors.auroraTeal;
  const phaseIndex =
    phase === "listening" ? 1 : phase === "thinking" ? 2 : phase === "speaking" ? 3 : 0;

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 },
      ]}
    >
      <View style={styles.topBar}>
        <Pressable
          onPress={() => {
            router.back();
          }}
          hitSlop={12}
          accessibilityLabel="Go back"
        >
          <ChevronLeft color={colors.textPrimary} size={26} />
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {scenario?.title ?? "Practice session"}
          </Text>
          <Text style={styles.subtitle}>
            {isConnected ? "Live · Sonolo voice" : "Connecting…"}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            void finishSession();
          }}
          hitSlop={12}
          accessibilityLabel="Finish session and see feedback"
          disabled={isFinishing}
        >
          <Flag
            color={isFinishing ? colors.textTertiary : colors.textSecondary}
            size={22}
          />
        </Pressable>
      </View>

      <GlassCard style={styles.promptCard}>
        <Text style={styles.promptLabel}>Scenario</Text>
        <Text style={styles.promptText}>
          {scenario?.description ?? HINT_TEXT}
        </Text>
        <Pressable
          style={styles.hintButton}
          onPress={() => {
            setHintVisible((visible) => !visible);
          }}
          accessibilityLabel="Toggle hint"
        >
          <Lightbulb
            color={hintVisible ? colors.warning : colors.textSecondary}
            size={16}
          />
          <Text style={[styles.hintLabel, hintVisible && styles.hintLabelActive]}>
            Hint
          </Text>
        </Pressable>
        {hintVisible ? <Text style={styles.hintText}>{HINT_TEXT}</Text> : null}
      </GlassCard>

      <View style={styles.waveform}>
        {Array.from({ length: BAR_COUNT }, (_, index) => (
          <WaveformBar key={index} phase={phaseIndex} color={barColor} />
        ))}
      </View>

      <ScrollView
        style={styles.transcriptScroll}
        contentContainerStyle={styles.transcriptContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.transcriptHeader}>Transcript</Text>
        {transcript.map((turn) => (
          <View
            key={turn.id}
            style={[
              styles.turnRow,
              turn.role === "user" ? styles.turnRowRight : styles.turnRowLeft,
            ]}
          >
            <View
              style={[
                styles.turnBubble,
                turn.role === "user" ? styles.bubbleUser : styles.bubbleTutor,
              ]}
            >
              <Text
                style={[
                  styles.turnText,
                  turn.role === "user" && styles.turnTextUser,
                ]}
              >
                {turn.text}
              </Text>
            </View>
          </View>
        ))}
        {transcript.length === 0 ? (
          <Text style={styles.emptyText}>
            Your conversation will appear here as you speak.
          </Text>
        ) : null}
      </ScrollView>

      {error !== null ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.controls}>
        <VoiceButton state={phase} onPress={handleTap} />
        <Text style={styles.caption}>{voiceButtonCaption(phase)}</Text>
        <Pressable
          style={[styles.finishButton, isFinishing && styles.finishButtonBusy]}
          onPress={() => {
            void finishSession();
          }}
          accessibilityLabel="Finish session and see feedback"
          disabled={isFinishing}
        >
          <Text style={styles.finishButtonText}>
            {isFinishing ? "Saving session…" : "Finish session"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.nightSky,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  promptCard: {
    marginTop: 14,
    gap: 8,
  },
  promptLabel: {
    color: colors.auroraTeal,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  promptText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  hintButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: colors.nightSkyDeep,
    marginTop: 2,
  },
  hintLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  hintLabelActive: {
    color: colors.warning,
  },
  hintText: {
    color: colors.warning,
    fontSize: 13,
    lineHeight: 18,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: 44,
    marginTop: 14,
  },
  bar: {
    width: 4,
    borderRadius: 2,
  },
  transcriptScroll: {
    flex: 1,
    marginTop: 6,
  },
  transcriptContent: {
    gap: 8,
    paddingBottom: 8,
  },
  transcriptHeader: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  turnRow: {
    flexDirection: "row",
  },
  turnRowLeft: {
    justifyContent: "flex-start",
  },
  turnRowRight: {
    justifyContent: "flex-end",
  },
  turnBubble: {
    maxWidth: "82%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleTutor: {
    backgroundColor: colors.nightSkyDeep,
    borderBottomLeftRadius: 6,
  },
  bubbleUser: {
    backgroundColor: colors.auroraTealSoft,
    borderBottomRightRadius: 6,
  },
  turnText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  turnTextUser: {
    color: colors.textPrimary,
  },
  emptyText: {
    color: colors.textTertiary,
    fontSize: 13,
    fontStyle: "italic",
  },
  error: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  controls: {
    alignItems: "center",
    gap: 12,
    paddingTop: 14,
  },
  caption: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  finishButton: {
    backgroundColor: colors.auroraTeal,
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 13,
  },
  finishButtonBusy: {
    opacity: 0.6,
  },
  finishButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
