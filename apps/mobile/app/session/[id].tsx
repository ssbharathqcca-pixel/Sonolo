/**
 * Voice session — the core speaking loop.
 *
 * A mock state machine walks the VoiceButton through idle → listening →
 * thinking → speaking so the full interaction is playable before real
 * audio capture lands. The waveform is driven by one shared loop phase,
 * and the transcript shows the conversation so far with live-listening
 * dots while the learner speaks.
 */
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { ChevronLeft, Flag, Lightbulb } from "lucide-react-native";
import { GlassCard } from "../../src/components/GlassCard";
import {
  VoiceButton,
  voiceButtonCaption,
  type VoiceButtonState,
} from "../../src/components/VoiceButton";
import { FALLBACK_QUEST, getQuestById } from "../../src/data/quests";
import { colors } from "../../src/theme/colors";

interface TranscriptTurn {
  id: string;
  speaker: "tutor" | "learner";
  text: string;
}

const TRANSCRIPT: TranscriptTurn[] = [
  {
    id: "t1",
    speaker: "tutor",
    text: "Morning! Welcome to Sonolo Coffee — what can I get started for you?",
  },
  {
    id: "l1",
    speaker: "learner",
    text: "Hi! Could I get a medium double-double, please?",
  },
  {
    id: "t2",
    speaker: "tutor",
    text: "Great choice. Anything else today — maybe a maple dip?",
  },
];

const HINT_TEXT = 'Try adding: "Could I also grab a maple dip, please?"';

const BAR_COUNT = 24;
const BAR_BASE_HEIGHT = 5;
const BAR_MAX_EXTRA = 26;
const WAVE_LOOP_MS = 1400;

const NEXT_STATE: Record<VoiceButtonState, VoiceButtonState> = {
  idle: "listening",
  listening: "thinking",
  thinking: "speaking",
  speaking: "idle",
};

function WaveformBar({
  phase,
  index,
  color,
}: {
  phase: SharedValue<number>;
  index: number;
  color: string;
}): JSX.Element {
  const style = useAnimatedStyle(() => {
    const offset = (phase.value + (index % 6) / 6) % 1;
    const wave = 0.5 - 0.5 * Math.cos(2 * Math.PI * offset * 2);
    return { height: BAR_BASE_HEIGHT + wave * BAR_MAX_EXTRA };
  });
  return <Animated.View style={[styles.bar, style, { backgroundColor: color }]} />;
}

function ListeningDots(): JSX.Element {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 420 }),
        withTiming(0.3, { duration: 420 }),
      ),
      -1,
    );
    return () => {
      cancelAnimation(opacity);
    };
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.dotsRow}>
      <Animated.View style={[styles.dot, style]} />
      <Animated.View style={[styles.dot, style]} />
      <Animated.View style={[styles.dot, style]} />
    </View>
  );
}

export default function VoiceSessionScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const quest = getQuestById(params.id) ?? FALLBACK_QUEST;

  const [voiceState, setVoiceState] = useState<VoiceButtonState>("idle");
  const [hintVisible, setHintVisible] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const phase = useSharedValue(0);
  const waveformActive = voiceState === "listening" || voiceState === "speaking";

  useEffect(() => {
    if (waveformActive) {
      phase.value = withRepeat(
        withTiming(1, { duration: WAVE_LOOP_MS, easing: Easing.linear }),
        -1,
      );
    } else {
      cancelAnimation(phase);
      phase.value = withTiming(0, { duration: 350 });
    }
  }, [waveformActive, phase]);

  const handleVoicePress = (): void => {
    if (voiceState === "speaking") {
      setSessionComplete(true);
    }
    setVoiceState(NEXT_STATE[voiceState]);
  };

  const openFeedback = (): void => {
    router.replace({ pathname: "/feedback/[id]", params: { id: quest.id } });
  };

  const barColor =
    voiceState === "listening" ? colors.warmCoral : colors.auroraTeal;
  const latestTutorLine = TRANSCRIPT[TRANSCRIPT.length - 1].text;

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 },
      ]}
    >
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityLabel="Go back"
        >
          <ChevronLeft color={colors.textPrimary} size={26} />
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {quest.title}
          </Text>
          <Text style={styles.subtitle}>
            {quest.difficulty} · {quest.minutes} min
          </Text>
        </View>
        <Pressable
          onPress={openFeedback}
          hitSlop={12}
          accessibilityLabel="Finish session and see feedback"
        >
          <Flag color={colors.textSecondary} size={22} />
        </Pressable>
      </View>

      <GlassCard style={styles.promptCard}>
        <Text style={styles.promptLabel}>Tutor</Text>
        <Text style={styles.promptText}>{latestTutorLine}</Text>
        <Pressable
          style={styles.hintButton}
          onPress={() => setHintVisible((visible) => !visible)}
          accessibilityLabel="Toggle hint"
        >
          <Lightbulb
            color={hintVisible ? colors.warning : colors.textSecondary}
            size={16}
          />
          <Text
            style={[styles.hintLabel, hintVisible && styles.hintLabelActive]}
          >
            Hint
          </Text>
        </Pressable>
        {hintVisible ? <Text style={styles.hintText}>{HINT_TEXT}</Text> : null}
      </GlassCard>

      <View style={styles.waveform} importantForAccessibility="no-hide-descendants">
        {Array.from({ length: BAR_COUNT }, (_, index) => (
          <WaveformBar key={index} phase={phase} index={index} color={barColor} />
        ))}
      </View>

      <ScrollView
        style={styles.transcriptScroll}
        contentContainerStyle={styles.transcriptContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.transcriptHeader}>Transcript</Text>
        {TRANSCRIPT.map((turn) => (
          <View
            key={turn.id}
            style={[
              styles.turnRow,
              turn.speaker === "learner"
                ? styles.turnRowRight
                : styles.turnRowLeft,
            ]}
          >
            <View
              style={[
                styles.turnBubble,
                turn.speaker === "learner"
                  ? styles.bubbleLearner
                  : styles.bubbleTutor,
              ]}
            >
              <Text
                style={[
                  styles.turnText,
                  turn.speaker === "learner" && styles.turnTextLearner,
                ]}
              >
                {turn.text}
              </Text>
            </View>
          </View>
        ))}
        {voiceState === "listening" ? (
          <View style={[styles.turnRow, styles.turnRowRight]}>
            <View style={[styles.turnBubble, styles.bubbleLearner]}>
              <ListeningDots />
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.controls}>
        <VoiceButton state={voiceState} onPress={handleVoicePress} />
        <Text style={styles.caption}>{voiceButtonCaption(voiceState)}</Text>
        {sessionComplete ? (
          <Pressable
            style={styles.finishButton}
            onPress={openFeedback}
            accessibilityLabel="View session feedback"
          >
            <Text style={styles.finishButtonText}>View feedback</Text>
          </Pressable>
        ) : (
          <Text style={styles.stepHint}>
            Tap the mic, speak your reply, then tap again — Sonolo coaches you
            after a few turns.
          </Text>
        )}
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
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 24,
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
  bubbleLearner: {
    backgroundColor: colors.auroraTealSoft,
    borderBottomRightRadius: 6,
  },
  turnText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  turnTextLearner: {
    color: colors.textPrimary,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 5,
    paddingVertical: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.textSecondary,
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
  finishButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  stepHint: {
    color: colors.textTertiary,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 17,
    paddingHorizontal: 24,
  },
});
