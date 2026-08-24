/**
 * Onboarding step 2 — pick a CLB-inspired target level (SN-017).
 *
 * The choice rides to the mic-check screen as a route param and is
 * persisted device-side when onboarding completes. Levels are coaching
 * milestones mapped to the CLB scale; no official-status claims.
 */

import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check } from "lucide-react-native";

import { GlassCard } from "../../src/components/GlassCard";
import { colors } from "../../src/theme/colors";

export interface GoalOption {
  id: string;
  level: string;
  title: string;
  detail: string;
}

export const GOAL_OPTIONS: GoalOption[] = [
  {
    id: "clb-4",
    level: "CLB 4",
    title: "Getting settled",
    detail: "Everyday errands, simple requests, and small talk.",
  },
  {
    id: "clb-5",
    level: "CLB 5",
    title: "Everyday confidence",
    detail: "Work chats, appointments, and conversations with neighbours.",
  },
  {
    id: "clb-7",
    level: "CLB 7",
    title: "Working proficiency",
    detail: "Meetings, interviews, and clear explanations under pressure.",
  },
  {
    id: "clb-9",
    level: "CLB 9",
    title: "Near-fluent",
    detail: "Nuance, humour, and fast-moving group conversation.",
  },
];

export default function GoalsScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = GOAL_OPTIONS.find((option) => option.id === selectedId) ?? null;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>What's your goal?</Text>
      <Text style={styles.subheading}>
        Pick the CLB-inspired level you're aiming for. Sonolo tunes scenario
        difficulty and feedback to match — for coaching only, not an official
        benchmark.
      </Text>

      <View style={styles.options}>
        {GOAL_OPTIONS.map((option) => {
          const isSelected = option.id === selectedId;
          return (
            <Pressable
              key={option.id}
              accessibilityLabel={`Select goal ${option.level} ${option.title}`}
              accessibilityState={{ selected: isSelected }}
              onPress={() => {
                setSelectedId(option.id);
              }}
            >
              <GlassCard
                style={[
                  styles.optionCard,
                  isSelected ? styles.optionCardSelected : null,
                ]}
              >
                <View style={styles.optionRow}>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionLevel}>{option.level}</Text>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionDetail}>{option.detail}</Text>
                  </View>
                  <View
                    style={[
                      styles.checkWell,
                      isSelected ? styles.checkWellSelected : null,
                    ]}
                  >
                    {isSelected ? (
                      <Check color="#FFFFFF" size={16} />
                    ) : null}
                  </View>
                </View>
              </GlassCard>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={[styles.cta, selected === null ? styles.ctaDisabled : null]}
        disabled={selected === null}
        accessibilityLabel="Continue to microphone check"
        onPress={() => {
          if (selected === null) {
            return;
          }
          router.push({
            pathname: "./mic-check",
            params: { goal: selected.id },
          });
        }}
      >
        <Text style={[styles.ctaText, selected === null ? styles.ctaTextDisabled : null]}>
          Continue
        </Text>
      </Pressable>
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
  subheading: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  options: {
    gap: 12,
    marginTop: 4,
  },
  optionCard: {
    padding: 16,
  },
  optionCardSelected: {
    borderColor: colors.auroraTeal,
    borderWidth: 1.5,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionInfo: {
    flex: 1,
    gap: 2,
  },
  optionLevel: {
    color: colors.auroraTeal,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  optionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  optionDetail: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  checkWell: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.nightSkyDeep,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  checkWellSelected: {
    backgroundColor: colors.auroraTeal,
    borderColor: colors.auroraTeal,
  },
  cta: {
    alignItems: "center",
    backgroundColor: colors.auroraTeal,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  ctaDisabled: {
    opacity: 0.4,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  ctaTextDisabled: {
    color: "#FFFFFF",
  },
});
