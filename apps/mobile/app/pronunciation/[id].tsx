/**
 * Pronunciation Lab drill player (SN-049): a Canadian-speech drill.
 *
 * The screen shows the target sentence with its IPA hint, a "Listen"
 * button that speaks it via expo-speech (0.8x / 1.0x rate toggle), and
 * a "Record & Score" button that captures ~3 seconds through the
 * existing AudioRecorderService (expo-av) and POSTs the take to the
 * deterministic mock evaluator. The result panel shows an overall
 * dial, per-phoneme score bars with tips, and a tip summary. A
 * premium drill that is still locked for the caller opens the paywall
 * instead of the player.
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
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import {
  Gauge,
  Lock,
  Mic,
  RotateCcw,
  Volume2,
} from "lucide-react-native";

import { GlassCard } from "../../src/components/GlassCard";
import { PaywallModal } from "../../src/components/PaywallModal";
import {
  evaluatePronunciation,
  fetchPronunciationDrill,
  type PronunciationDrill,
  type PronunciationEvaluation,
} from "../../src/api/client";
import { trackEvent } from "../../lib/analytics";
import { ensureMicPermission } from "../../src/utils/permissions";
import { AudioRecorderService } from "../../src/services/audioRecorder";
import { useAuthStore } from "../../src/stores/authStore";
import { colors } from "../../src/theme/colors";

/** The drill player records roughly three seconds per take. */
const RECORD_MS = 3000;

export default function PronunciationDrillScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const drillId = params.id ?? "";

  const subscriptionTier = useAuthStore((state) => state.user?.subscription_tier);

  const [drill, setDrill] = useState<PronunciationDrill | null>(null);
  const [failed, setFailed] = useState(false);
  const [rate, setRate] = useState<0.8 | 1.0>(1.0);
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<PronunciationEvaluation | null>(null);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [gateError, setGateError] = useState(false);

  const recorderRef = useRef<AudioRecorderService>(new AudioRecorderService());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPronunciationDrill(drillId)
      .then((data) => {
        if (!cancelled) {
          setDrill(data);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          // 403 = premium drill gated for the free tier -> paywall.
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
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      recorderRef.current.cleanup();
    };
  }, [drillId]);

  // A drill the catalog marked locked (or that came back gated) never
  // opens the player — the paywall is the only path forward.
  const isLocked = drill?.is_premium === true && subscriptionTier !== "premium";
  useEffect(() => {
    if (isLocked) {
      setPaywallVisible(true);
    }
  }, [isLocked]);

  const handleListen = useCallback((): void => {
    if (drill === null) {
      return;
    }
    trackEvent("Pronunciation Listen Tapped", { drill_id: drill.id });
    Speech.speak(drill.target_sentence, {
      language: "en-CA",
      rate,
    });
  }, [drill, rate]);

  const handleRecord = useCallback(async (): Promise<void> => {
    if (drill === null || isRecording || isEvaluating) {
      return;
    }
    const granted = await ensureMicPermission();
    if (!granted) {
      return;
    }
    const started = await recorderRef.current.start();
    if (!started) {
      return;
    }
    setIsRecording(true);
    setResult(null);
    timerRef.current = setTimeout(() => {
      void (async () => {
        await recorderRef.current.stopAndCollect();
        setIsRecording(false);
        setIsEvaluating(true);
        try {
          const evaluation = await evaluatePronunciation(
            drill.id,
            RECORD_MS / 1000,
          );
          setResult(evaluation);
          trackEvent("Pronunciation Drill Completed", {
            drill_id: drill.id,
            overall: evaluation.overall,
          });
        } catch {
          setFailed(true);
        } finally {
          setIsEvaluating(false);
        }
      })();
    }, RECORD_MS);
  }, [drill, isRecording, isEvaluating]);

  if (failed) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
        {gateError ? (
          <View style={styles.centeredNote}>
            <View style={styles.lockWell}>
              <Lock color={colors.warmCoral} size={20} />
            </View>
            <Text style={styles.noteTitle}>Premium drill</Text>
            <Text style={styles.noteBody}>
              This drill is part of Sonolo Premium — unlock it to keep
              practicing.
            </Text>
          </View>
        ) : (
          <View style={styles.centeredNote}>
            <Text style={styles.noteTitle}>Drill unavailable</Text>
            <Text style={styles.noteBody}>
              The drill needs a connection — try again once you're back
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

  if (drill === null) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
        <ActivityIndicator color={colors.auroraTeal} style={styles.spinner} />
      </View>
    );
  }

  const levelTone =
    drill.level === "bloom"
      ? { text: colors.warmCoral, background: colors.warmCoralSoft }
      : drill.level === "branch"
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
        {/* Hero: focus + level */}
        <View style={styles.hero}>
          <Text style={styles.title}>{drill.title}</Text>
          <View
            style={[
              styles.levelBadge,
              { backgroundColor: levelTone.background },
            ]}
          >
            <Text style={[styles.levelText, { color: levelTone.text }]}>
              {drill.level}
            </Text>
          </View>
          <Text style={styles.focus}>{drill.focus}</Text>
        </View>

        {/* Target sentence card */}
        <GlassCard style={styles.sentenceCard}>
          <Text style={styles.cardLabel}>Say it out loud</Text>
          <Text style={styles.targetSentence}>{drill.target_sentence}</Text>
          <Text style={styles.ipaHint}>{drill.ipa_hint}</Text>
        </GlassCard>

        {/* Listen */}
        <View style={styles.controlRow}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleListen}
            accessibilityLabel="Listen to the target sentence"
          >
            <Volume2 color="#FFFFFF" size={18} />
            <Text style={styles.primaryButtonText}>Listen</Text>
            <View style={styles.rateChip}>
              <Text style={styles.rateChipText}>{rate}x</Text>
            </View>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.rateButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              setRate((current) => (current === 1.0 ? 0.8 : 1.0));
            }}
            accessibilityLabel="Toggle speech rate"
          >
            <Text style={styles.rateButtonText}>Rate</Text>
          </Pressable>
        </View>

        {/* Record & Score */}
        <Pressable
          style={({ pressed }) => [
            styles.recordButton,
            (isRecording || isEvaluating) && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => {
            void handleRecord();
          }}
          disabled={isRecording || isEvaluating}
          accessibilityLabel="Record and score this drill"
        >
          {isEvaluating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : isRecording ? (
            <>
              <Mic color="#FFFFFF" size={18} />
              <Text style={styles.recordButtonText}>Recording…</Text>
            </>
          ) : (
            <>
              <Mic color="#FFFFFF" size={18} />
              <Text style={styles.recordButtonText}>Record &amp; Score</Text>
            </>
          )}
        </Pressable>

        {/* Result panel */}
        {result !== null ? (
          <View style={styles.resultSection}>
            <GlassCard style={styles.overallCard}>
              <View style={styles.overallHeader}>
                <Gauge color={colors.auroraTeal} size={20} />
                <Text style={styles.overallLabel}>Overall</Text>
              </View>
              <Text style={styles.overallScore}>
                {result.overall}
                <Text style={styles.overallDenom}> / 100</Text>
              </Text>
              <Text style={styles.fluencyNote}>
                Fluency: {result.fluency_score}
              </Text>
            </GlassCard>

            <View style={styles.phonemeSection}>
              <Text style={styles.sectionTitle}>Phoneme check</Text>
              {result.phonemes.map((phoneme, index) => (
                <View key={`${phoneme.symbol}-${index}`} style={styles.phonemeRow}>
                  <View style={styles.phonemeLabelRow}>
                    <Text style={styles.phonemeSymbol}>{phoneme.symbol}</Text>
                    <Text style={styles.phonemeScore}>{phoneme.score}</Text>
                  </View>
                  <View style={styles.phonemeBarTrack}>
                    <View
                      style={[
                        styles.phonemeBarFill,
                        { width: `${Math.max(2, phoneme.score)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.phonemeTip}>{phoneme.tip}</Text>
                </View>
              ))}
            </View>

            <GlassCard style={styles.tipCard}>
              <Text style={styles.tipLabel}>Coach tip</Text>
              <Text style={styles.tipText}>{result.tip_summary}</Text>
            </GlassCard>

            <Pressable
              style={({ pressed }) => [
                styles.tryAgainButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => {
                setResult(null);
              }}
              accessibilityLabel="Try the drill again"
            >
              <RotateCcw color={colors.auroraTeal} size={16} />
              <Text style={styles.tryAgainText}>Try again</Text>
            </Pressable>
          </View>
        ) : null}

        {drill.tip !== "" ? (
          <Text style={styles.tip}>{drill.tip}</Text>
        ) : null}
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
  focus: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  sentenceCard: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 22,
  },
  cardLabel: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  targetSentence: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 28,
  },
  ipaHint: {
    color: colors.auroraTeal,
    fontSize: 15,
    textAlign: "center",
  },
  controlRow: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.auroraTeal,
    borderRadius: 16,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  rateChip: {
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  rateChipText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  rateButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  rateButtonText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  recordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.warmCoral,
    borderRadius: 16,
    paddingVertical: 15,
  },
  recordButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.7,
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
    gap: 4,
    paddingVertical: 18,
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
    fontSize: 40,
    fontWeight: "800",
  },
  overallDenom: {
    fontSize: 18,
    fontWeight: "600",
  },
  fluencyNote: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  phonemeSection: {
    gap: 8,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  phonemeRow: {
    gap: 3,
  },
  phonemeLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  phonemeSymbol: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  phonemeScore: {
    color: colors.auroraTeal,
    fontSize: 13,
    fontWeight: "700",
  },
  phonemeBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(148, 163, 184, 0.2)",
    overflow: "hidden",
  },
  phonemeBarFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.auroraTeal,
  },
  phonemeTip: {
    color: colors.textTertiary,
    fontSize: 12,
    lineHeight: 17,
  },
  tipCard: {
    gap: 4,
    padding: 16,
  },
  tipLabel: {
    color: colors.warmCoral,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  tipText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  tryAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.auroraTeal,
    paddingVertical: 12,
  },
  tryAgainText: {
    color: colors.auroraTeal,
    fontSize: 14,
    fontWeight: "700",
  },
  tip: {
    color: colors.textTertiary,
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    paddingHorizontal: 12,
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
