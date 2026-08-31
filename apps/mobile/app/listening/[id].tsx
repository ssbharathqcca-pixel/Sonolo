/**
 * Listening Gym player (SN-050): a real Canadian conversation you train
 * your ear on. The screen plays each turn aloud via expo-speech with a
 * role prefix and natural pacing (pause per turn), a speed toggle
 * (0.8x / 1.0x / 1.2x), pause/resume, and replay. A three-question
 * comprehension quiz below is submitted only once all questions are
 * answered; the deterministic backend scores it and the results panel
 * shows the score dial, correct/total, and missed explanations. A
 * premium dialogue that is still locked opens the paywall instead.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import {
  CheckCircle2,
  Gauge,
  Headphones,
  Lock,
  Pause,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react-native";

import { GlassCard } from "../../src/components/GlassCard";
import { PaywallModal } from "../../src/components/PaywallModal";
import {
  evaluateListening,
  fetchListeningDialogue,
  type DialogueTurn,
  type ListeningDialogue,
  type ListeningEvaluation,
} from "../../src/api/client";
import { trackEvent } from "../../lib/analytics";
import { useAuthStore } from "../../src/stores/authStore";
import { colors } from "../../src/theme/colors";

const SPEED_OPTIONS = [0.8, 1.0, 1.2] as const;
type Speed = (typeof SPEED_OPTIONS)[number];

function roleLabel(role: DialogueTurn["role"]): string {
  if (role === "system") {
    return "Announcer";
  }
  return role === "speaker" ? "Speaker" : "Listener";
}

export default function ListeningPlayerScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const dialogueId = params.id ?? "";

  const subscriptionTier = useAuthStore((state) => state.user?.subscription_tier);

  const [dialogue, setDialogue] = useState<ListeningDialogue | null>(null);
  const [failed, setFailed] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [gateError, setGateError] = useState(false);

  // Playback state
  const [playState, setPlayState] = useState<"idle" | "playing" | "paused">(
    "idle",
  );
  const [activeTurn, setActiveTurn] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1.0);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Quiz state
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ListeningEvaluation | null>(null);

  const turnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playStartedAtRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);

  const clearTurnTimer = useCallback((): void => {
    if (turnTimerRef.current !== null) {
      clearTimeout(turnTimerRef.current);
      turnTimerRef.current = null;
    }
  }, []);

  const stopSpeaking = useCallback((): void => {
    Speech.stop();
    clearTurnTimer();
  }, [clearTurnTimer]);

  const speakTurn = useCallback(
    (turnIndex: number): void => {
      if (dialogue === null || cancelledRef.current) {
        return;
      }
      const turn = dialogue.turns[turnIndex];
      setActiveTurn(turnIndex);
      Speech.speak(`${roleLabel(turn.role)}: ${turn.text}`, {
        language: "en-CA",
        rate: speed,
        onDone: () => {
          if (cancelledRef.current) {
            return;
          }
          const next = turnIndex + 1;
          if (next >= dialogue.turns.length) {
            setPlayState("idle");
            return;
          }
          turnTimerRef.current = setTimeout(() => {
            speakTurn(next);
          }, turn.pause_after_ms);
        },
      });
    },
    [dialogue, speed],
  );

  const startPlayback = useCallback((): void => {
    if (dialogue === null) {
      return;
    }
    if (!hasPlayed) {
      setHasPlayed(true);
      playStartedAtRef.current = Date.now();
      trackEvent("Listening Play Tapped", { dialogue_id: dialogue.id });
    }
    clearTurnTimer();
    setPlayState("playing");
    speakTurn(activeTurn);
  }, [dialogue, hasPlayed, activeTurn, clearTurnTimer, speakTurn]);

  const handlePauseResume = useCallback((): void => {
    if (playState === "playing") {
      stopSpeaking();
      setPlayState("paused");
    } else if (playState === "paused") {
      setPlayState("playing");
      speakTurn(activeTurn);
    }
  }, [playState, activeTurn, stopSpeaking, speakTurn]);

  const handleReplay = useCallback((): void => {
    stopSpeaking();
    setActiveTurn(0);
    setPlayState("playing");
    if (dialogue !== null) {
      speakTurn(0);
    }
  }, [dialogue, stopSpeaking, speakTurn]);

  const handleSpeedChange = useCallback((): void => {
    setSpeed((current) => {
      const index = SPEED_OPTIONS.indexOf(current);
      const next = SPEED_OPTIONS[(index + 1) % SPEED_OPTIONS.length];
      if (dialogue !== null) {
        trackEvent("Listening Speed Changed", {
          dialogue_id: dialogue.id,
          speed: next,
        });
      }
      return next;
    });
  }, [dialogue]);

  const selectAnswer = useCallback((questionIndex: number, choice: number): void => {
    setAnswers((current) => {
      const next = [...current];
      next[questionIndex] = choice;
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (
      dialogue === null ||
      answers.some((answer) => answer === null) ||
      isSubmitting
    ) {
      return;
    }
    setIsSubmitting(true);
    const timeSeconds = playStartedAtRef.current
      ? Math.max(
          1,
          Math.round((Date.now() - playStartedAtRef.current) / 1000),
        )
      : 1;
    try {
      const evaluation = await evaluateListening(
        dialogue.id,
        answers as number[],
        timeSeconds,
      );
      setResult(evaluation);
      trackEvent("Listening Dialogue Completed", {
        dialogue_id: dialogue.id,
        score: evaluation.score,
        correct_count: evaluation.correct_count,
      });
    } catch {
      setFailed(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [dialogue, answers, isSubmitting]);

  const handleTryAgain = useCallback((): void => {
    stopSpeaking();
    setAnswers(dialogue ? dialogue.questions.map(() => null) : []);
    setResult(null);
    setActiveTurn(0);
    setPlayState("idle");
    setHasPlayed(false);
    playStartedAtRef.current = null;
  }, [dialogue, stopSpeaking]);

  useEffect(() => {
    let cancelled = false;
    cancelledRef.current = false;
    fetchListeningDialogue(dialogueId)
      .then((data) => {
        if (!cancelled) {
          setDialogue(data);
          setAnswers(data.questions.map(() => null));
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const status = (
            error as { response?: { status?: number } } | undefined
          )?.response?.status;
          if (status === 403) {
            setGateError(true);
            setPaywallVisible(true);
          }
          setFailed(true);
        }
      });
    return () => {
      cancelled = true;
      cancelledRef.current = true;
      stopSpeaking();
    };
  }, [dialogueId, stopSpeaking]);

  const isLocked = dialogue?.is_premium === true && subscriptionTier !== "premium";
  useEffect(() => {
    if (isLocked) {
      setPaywallVisible(true);
    }
  }, [isLocked]);

  const allAnswered =
    answers.length > 0 && answers.every((answer) => answer !== null);

  if (failed) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
        {gateError ? (
          <View style={styles.centeredNote}>
            <View style={styles.lockWell}>
              <Lock color={colors.warmCoral} size={20} />
            </View>
            <Text style={styles.noteTitle}>Premium dialogue</Text>
            <Text style={styles.noteBody}>
              This dialogue is part of Sonolo Premium — unlock it to keep
              training your ear.
            </Text>
          </View>
        ) : (
          <View style={styles.centeredNote}>
            <Text style={styles.noteTitle}>Dialogue unavailable</Text>
            <Text style={styles.noteBody}>
              The dialogue needs a connection — try again once you're back
              online.
            </Text>
          </View>
        )}
        <PaywallModal
          visible={paywallVisible}
          onClose={() => {
            setPaywallVisible(false);
          }}
        />
      </View>
    );
  }

  if (dialogue === null) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
        <ActivityIndicator color={colors.auroraTeal} style={styles.spinner} />
      </View>
    );
  }

  const levelTone =
    dialogue.level === "bloom"
      ? { text: colors.warmCoral, background: colors.warmCoralSoft }
      : dialogue.level === "branch"
        ? { text: colors.auroraTeal, background: colors.auroraTealSoft }
        : { text: colors.success, background: colors.successSoft };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero: title + context */}
        <View style={styles.hero}>
          <View style={[styles.iconWell, { backgroundColor: `${dialogue.theme_color ?? "#06B6D4"}E6` }]}>
            <Headphones color="#FFFFFF" size={26} />
          </View>
          <Text style={styles.title}>{dialogue.title}</Text>
          <View
            style={[
              styles.levelBadge,
              { backgroundColor: levelTone.background },
            ]}
          >
            <Text style={[styles.levelText, { color: levelTone.text }]}>
              {dialogue.listening_focus} · {dialogue.level}
            </Text>
          </View>
          <Text style={styles.context}>{dialogue.context}</Text>
        </View>

        {/* Player controls */}
        <GlassCard style={styles.playerCard}>
          <View style={styles.playerHeader}>
            <Text style={styles.playerLabel}>Dialogue</Text>
            <View style={styles.speedChip}>
              <Text style={styles.speedChipText}>{speed}x</Text>
            </View>
          </View>

          <View style={styles.controlsRow}>
            {playState === "idle" ? (
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={startPlayback}
                accessibilityLabel="Play dialogue"
              >
                <Play color="#FFFFFF" size={20} />
                <Text style={styles.playButtonText}>Play dialogue</Text>
              </Pressable>
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handlePauseResume}
                accessibilityLabel={
                  playState === "playing" ? "Pause dialogue" : "Resume dialogue"
                }
              >
                {playState === "playing" ? (
                  <Pause color="#FFFFFF" size={20} />
                ) : (
                  <Play color="#FFFFFF" size={20} />
                )}
                <Text style={styles.playButtonText}>
                  {playState === "playing" ? "Pause" : "Resume"}
                </Text>
              </Pressable>
            )}
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleReplay}
              accessibilityLabel="Replay dialogue from the start"
            >
              <RotateCcw color={colors.auroraTeal} size={18} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSpeedChange}
              accessibilityLabel="Change speech speed"
            >
              <Text style={styles.rateButtonText}>Speed</Text>
            </Pressable>
          </View>

          <Text style={styles.playingLine} numberOfLines={1}>
            {playState === "idle"
              ? "Press play to hear the conversation."
              : `${roleLabel(dialogue.turns[activeTurn]?.role ?? "system")} · turn ${
                  activeTurn + 1
                } of ${dialogue.turns.length}`}
          </Text>
        </GlassCard>

        {/* Quiz */}
        {result === null ? (
          <View style={styles.quizSection}>
            <Text style={styles.sectionTitle}>Comprehension check</Text>
            <Text style={styles.sectionSubtitle}>
              Answer all three questions, then submit.
            </Text>
            {dialogue.questions.map((question, qIndex) => (
              <GlassCard key={`${dialogue.id}-q${qIndex}`} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>{qIndex + 1}.</Text>
                  <Text style={styles.questionPrompt}>{question.prompt}</Text>
                </View>
                <View style={styles.choices}>
                  {question.choices.map((choice, cIndex) => {
                    const selected = answers[qIndex] === cIndex;
                    return (
                      <Pressable
                        key={`${qIndex}-${cIndex}`}
                        style={[
                          styles.choice,
                          selected && styles.choiceSelected,
                        ]}
                        onPress={() => selectAnswer(qIndex, cIndex)}
                        accessibilityLabel={`Question ${qIndex + 1}, option ${cIndex + 1}: ${choice}`}
                      >
                        <View
                          style={[
                            styles.choiceDot,
                            selected && styles.choiceDotSelected,
                          ]}
                        >
                          {selected ? (
                            <CheckCircle2 color={colors.auroraTeal} size={14} />
                          ) : null}
                        </View>
                        <Text
                          style={[
                            styles.choiceText,
                            selected && styles.choiceTextSelected,
                          ]}
                        >
                          {choice}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </GlassCard>
            ))}

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                !allAnswered && styles.buttonDisabled,
                pressed && allAnswered && styles.buttonPressed,
              ]}
              disabled={!allAnswered || isSubmitting}
              onPress={() => {
                void handleSubmit();
              }}
              accessibilityLabel="Submit answers"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {allAnswered ? "Submit answers" : "Answer all 3 to submit"}
                </Text>
              )}
            </Pressable>
          </View>
        ) : (
          /* Results panel */
          <View style={styles.resultSection}>
            <GlassCard style={styles.overallCard}>
              <View style={styles.overallHeader}>
                <Gauge color={colors.auroraTeal} size={20} />
                <Text style={styles.overallLabel}>Your score</Text>
              </View>
              <Text style={styles.overallScore}>
                {result.score}
                <Text style={styles.overallDenom}> / 100</Text>
              </Text>
              <View style={styles.correctBadge}>
                <CheckCircle2 color={colors.success} size={14} />
                <Text style={styles.correctBadgeText}>
                  {result.correct_count} of {result.total} correct
                </Text>
              </View>
              <Text style={styles.timeNote}>
                Completed in {result.time_seconds}s
              </Text>
            </GlassCard>

            {result.missed.length > 0 ? (
              <View style={styles.missedSection}>
                <Text style={styles.sectionTitle}>Review</Text>
                {result.missed.map((missed, index) => (
                  <GlassCard key={`missed-${index}`} style={styles.missedCard}>
                    <View style={styles.missedHeader}>
                      <XCircle color={colors.warmCoral} size={16} />
                      <Text style={styles.missedPrompt}>{missed.prompt}</Text>
                    </View>
                    <Text style={styles.missedAnswer}>
                      Your answer: {missed.your_answer}
                    </Text>
                    <Text style={styles.missedCorrect}>
                      Correct: {missed.correct_answer}
                    </Text>
                    <Text style={styles.missedExplanation}>
                      {missed.explanation}
                    </Text>
                  </GlassCard>
                ))}
              </View>
            ) : (
              <GlassCard style={styles.perfectCard}>
                <Text style={styles.perfectTitle}>Perfect score! 🎉</Text>
                <Text style={styles.perfectText}>
                  Your ear is catching the Canadian cadence. Try another
                  dialogue to keep going.
                </Text>
              </GlassCard>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.tryAgainButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleTryAgain}
              accessibilityLabel="Try the dialogue again"
            >
              <RotateCcw color={colors.auroraTeal} size={16} />
              <Text style={styles.tryAgainText}>Try again</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.back()}
              accessibilityLabel="Back to library"
            >
              <Text style={styles.backButtonText}>Back to library</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <PaywallModal
        visible={paywallVisible}
        onClose={() => {
          setPaywallVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.nightSky,
  },
  spinner: {
    paddingVertical: 24,
  },
  content: {
    paddingHorizontal: 20,
    gap: 14,
  },
  hero: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  iconWell: {
    width: 60,
    height: 60,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  levelBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  levelText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  context: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  playerCard: {
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  playerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playerLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  speedChip: {
    borderRadius: 999,
    backgroundColor: colors.auroraTealSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  speedChipText: {
    color: colors.auroraTeal,
    fontSize: 12,
    fontWeight: "700",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  playButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.auroraTeal,
    borderRadius: 16,
    paddingVertical: 14,
  },
  playButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  iconButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rateButtonText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  playingLine: {
    color: colors.textTertiary,
    fontSize: 12,
    textAlign: "center",
  },
  quizSection: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: colors.textTertiary,
    fontSize: 13,
    marginTop: -6,
  },
  questionCard: {
    padding: 16,
    gap: 10,
  },
  questionHeader: {
    flexDirection: "row",
    gap: 6,
  },
  questionNumber: {
    color: colors.textTertiary,
    fontSize: 14,
    fontWeight: "700",
  },
  questionPrompt: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    flex: 1,
  },
  choices: {
    gap: 8,
  },
  choice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  choiceSelected: {
    borderColor: colors.auroraTeal,
    backgroundColor: colors.auroraTealSoft,
  },
  choiceDot: {
    width: 22,
    height: 22,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  choiceDotSelected: {
    borderColor: colors.auroraTeal,
    backgroundColor: colors.nightSkyDeep,
  },
  choiceText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  choiceTextSelected: {
    color: colors.textPrimary,
  },
  submitButton: {
    backgroundColor: colors.auroraTeal,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  resultSection: {
    gap: 12,
  },
  overallCard: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 20,
  },
  overallHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  overallLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  overallScore: {
    color: colors.textPrimary,
    fontSize: 42,
    fontWeight: "800",
  },
  overallDenom: {
    fontSize: 18,
    fontWeight: "600",
  },
  correctBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: colors.successSoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  correctBadgeText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "700",
  },
  timeNote: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  missedSection: {
    gap: 10,
  },
  missedCard: {
    padding: 14,
    gap: 4,
  },
  missedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  missedPrompt: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  missedAnswer: {
    color: colors.warmCoral,
    fontSize: 12,
    lineHeight: 17,
  },
  missedCorrect: {
    color: colors.success,
    fontSize: 12,
    lineHeight: 17,
  },
  missedExplanation: {
    color: colors.textTertiary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  perfectCard: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 18,
  },
  perfectTitle: {
    color: colors.success,
    fontSize: 17,
    fontWeight: "800",
  },
  perfectText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  tryAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.auroraTeal,
    paddingVertical: 13,
  },
  tryAgainText: {
    color: colors.auroraTeal,
    fontSize: 14,
    fontWeight: "700",
  },
  backButton: {
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  centeredNote: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  lockWell: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.warmCoralSoft,
  },
  noteTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  noteBody: {
    color: colors.textTertiary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
});
