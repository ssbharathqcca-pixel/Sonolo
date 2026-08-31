/**
 * Microlesson reader — one Culture Corner micro-lesson (SN-047).
 * Tapped from the Learn tab's Culture Corner rail, the screen renders
 * the hook as a hero line, each section as a readable glass card, the
 * takeaway in a highlighted card, and the try-it challenge in a
 * distinct card. A sticky bottom action marks the lesson as done
 * (persisted via the micro progress store) and flips to Done ✓.
 */
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CheckCircle2, Clock3, Lightbulb, Sparkles } from "lucide-react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fetchMicrolesson, type Microlesson } from "../../src/api/client";
import { GlassCard } from "../../src/components/GlassCard";
import { trackEvent } from "../../lib/analytics";
import { useMicroProgressStore } from "../../src/stores/microProgressStore";
import { colors } from "../../src/theme/colors";

export default function MicrolessonScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const lessonId = params.id ?? "";

  const [lesson, setLesson] = useState<Microlesson | null>(null);
  const [failed, setFailed] = useState(false);

  const isDone = useMicroProgressStore((state) =>
    state.completedMicrolessonIds.includes(lessonId),
  );
  const markDone = useMicroProgressStore((state) => state.markDone);

  useEffect(() => {
    let cancelled = false;
    fetchMicrolesson(lessonId)
      .then((data) => {
        if (!cancelled) {
          setLesson(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  const themeColor = useMemo(
    () => lesson?.theme_color ?? colors.warmCoral,
    [lesson],
  );

  if (failed) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
        <View style={styles.centeredNote}>
          <Text style={styles.noteTitle}>Lesson unavailable</Text>
          <Text style={styles.noteBody}>
            Culture Corner needs a connection — try again once you're back
            online.
          </Text>
        </View>
      </View>
    );
  }

  if (lesson === null) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
        <ActivityIndicator color={colors.auroraTeal} style={styles.spinner} />
      </View>
    );
  }

  const handleMarkDone = (): void => {
    if (isDone) {
      return;
    }
    void markDone(lessonId);
    trackEvent("Microlesson Completed", { microlesson_id: lessonId });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero: pack icon + hook as the hero line. */}
        <View style={styles.hero}>
          <View style={[styles.heroIconWell, { backgroundColor: themeColor }]}>
            <Text style={styles.heroIcon}>{lesson.icon ?? "🍁"}</Text>
          </View>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.hook}>{lesson.hook}</Text>
          <View style={styles.minutesChip}>
            <Clock3 color={colors.auroraTeal} size={13} />
            <Text style={styles.minutesText}>
              {lesson.read_minutes} min read
            </Text>
          </View>
        </View>

        {/* Sections as readable cards. */}
        <View style={styles.sections}>
          {lesson.sections.map((section, index) => (
            <GlassCard key={`${lesson.id}-${index}`} style={styles.sectionCard}>
              <Text style={styles.sectionHeading}>{section.heading}</Text>
              <Text style={styles.sectionText}>{section.text}</Text>
            </GlassCard>
          ))}
        </View>

        {/* Takeaway in a highlighted card. */}
        <View style={[styles.takeawayCard, { backgroundColor: `${themeColor}1F` }]}>
          <View style={styles.takeawayIconWell}>
            <Lightbulb color={themeColor} size={18} />
          </View>
          <View style={styles.takeawayBody}>
            <Text style={styles.takeawayLabel}>Takeaway</Text>
            <Text style={styles.takeawayText}>{lesson.takeaway}</Text>
          </View>
        </View>

        {/* Try-it challenge in a distinct card. */}
        <View style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <Sparkles color={colors.warmCoral} size={18} />
            <Text style={styles.challengeLabel}>Try it today</Text>
          </View>
          <Text style={styles.challengeText}>{lesson.try_it}</Text>
        </View>
      </ScrollView>

      {/* Sticky bottom action: mark as done flips to Done ✓. */}
      <View
        style={[
          styles.actionBar,
          { paddingBottom: insets.bottom + 16, paddingTop: insets.bottom > 0 ? 8 : 12 },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            isDone && styles.actionButtonDone,
            pressed && styles.actionButtonPressed,
          ]}
          accessibilityLabel={
            isDone ? "Lesson completed" : "Mark lesson as done"
          }
          disabled={isDone}
          onPress={handleMarkDone}
        >
          {isDone ? (
            <CheckCircle2 color="#FFFFFF" size={18} />
          ) : null}
          <Text style={styles.actionButtonText}>
            {isDone ? "Done ✓" : "Mark as done"}
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
    gap: 10,
    paddingVertical: 8,
  },
  heroIconWell: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  heroIcon: {
    fontSize: 30,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  hook: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
    fontStyle: "italic",
  },
  minutesChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: colors.auroraTealSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 2,
  },
  minutesText: {
    color: colors.auroraTeal,
    fontSize: 12,
    fontWeight: "700",
  },
  sections: {
    gap: 12,
  },
  sectionCard: {
    padding: 16,
    gap: 6,
  },
  sectionHeading: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  sectionText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  takeawayCard: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 16,
  },
  takeawayIconWell: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(148, 163, 184, 0.16)",
  },
  takeawayBody: {
    flex: 1,
    gap: 4,
  },
  takeawayLabel: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  takeawayText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  challengeCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.45)",
    backgroundColor: colors.warmCoralSoft,
    padding: 16,
    gap: 8,
  },
  challengeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  challengeLabel: {
    color: colors.warmCoral,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  challengeText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
  },
  centeredNote: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 24,
    paddingHorizontal: 20,
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
  actionBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    backgroundColor: colors.nightSky,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.glassBorder,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.auroraTeal,
    borderRadius: 16,
    paddingVertical: 15,
  },
  actionButtonDone: {
    backgroundColor: colors.success,
  },
  actionButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
