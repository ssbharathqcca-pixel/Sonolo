/**
 * Home — the daily driver (SN-015): loads the published scenario
 * catalog from the backend, features the selected scenario, and jumps
 * straight into a live voice session. Locked premium scenarios show a
 * Premium badge and open the SN-026 paywall instead of a session;
 * premium callers navigate normally.
 */

import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronRight,
  Lock,
  Play,
  RefreshCw,
  Sparkles,
} from "lucide-react-native";

import { GlassCard } from "../../src/components/GlassCard";
import { PaywallModal } from "../../src/components/PaywallModal";
import type { Scenario } from "../../src/api/client";
import { isLockedForCaller } from "../../src/lib/scenarioAccess";
import { useAuthStore } from "../../src/stores/authStore";
import { useScenarioStore } from "../../src/stores/scenarioStore";
import { colors } from "../../src/theme/colors";

const DIFFICULTY_TONES: Record<string, { label: string; text: string; background: string }> = {
  easy: { label: "Gentle", text: colors.success, background: colors.successSoft },
  medium: { label: "Standard", text: colors.auroraTeal, background: colors.auroraTealSoft },
  hard: { label: "Challenge", text: colors.warmCoral, background: colors.warmCoralSoft },
};

function difficultyTone(difficulty: number | null) {
  if (difficulty === null || difficulty <= 2) {
    return DIFFICULTY_TONES.easy;
  }
  return difficulty <= 3 ? DIFFICULTY_TONES.medium : DIFFICULTY_TONES.hard;
}

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 5) {
    return "Up late practicing";
  }
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 17) {
    return "Good afternoon";
  }
  return "Good evening";
}

export default function HomeScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const scenarios = useScenarioStore((state) => state.scenarios);
  const selected = useScenarioStore((state) => state.selected);
  const isLoading = useScenarioStore((state) => state.isLoading);
  const error = useScenarioStore((state) => state.error);
  const load = useScenarioStore((state) => state.load);
  // SN-035: locked premium scenarios open the SN-026 paywall instead
  // of a session; server tier truth beats a stale cached catalog.
  const isPremiumUser = user?.subscription_tier === "premium";
  const [paywallVisible, setPaywallVisible] = useState(false);

  // The catalog follows the account's content language (SN-020):
  // fetch when empty or when it still speaks the previous language.
  const preferredLanguage = user?.preferred_language ?? "en";
  const catalogLanguage = useScenarioStore((state) => state.language);

  useEffect(() => {
    if (scenarios.length === 0 || catalogLanguage !== preferredLanguage) {
      void load(preferredLanguage);
    }
  }, [scenarios.length, catalogLanguage, preferredLanguage, load]);

  const handleScenarioPress = useCallback(
    (scenario: Scenario): void => {
      if (isLockedForCaller(scenario, isPremiumUser)) {
        setPaywallVisible(true);
        return;
      }
      router.push(`/session/${scenario.id}`);
    },
    [isPremiumUser, router],
  );

  const rest = scenarios.filter((scenario) => scenario.id !== selected?.id);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: 120 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>{greetingForNow()}{user !== null ? `, ${user.name}` : ""}</Text>
      <Text style={styles.brandLine}>Ready to sound like you belong?</Text>

      {isLoading && scenarios.length === 0 ? (
        <View style={styles.loadingBlock}>
          <ActivityIndicator color={colors.auroraTeal} size="large" />
          <Text style={styles.loadingText}>Loading today's scenarios…</Text>
        </View>
      ) : null}

      {error !== null ? (
        <View style={styles.errorBlock}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => {
              void load();
            }}
            accessibilityLabel="Retry loading scenarios"
          >
            <RefreshCw color={colors.auroraTeal} size={16} />
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {selected !== null ? (
        <GlassCard style={styles.todayCard}>
          <View style={styles.todayHeader}>
            <View style={styles.todayKickerWell}>
              <Play color={colors.auroraTeal} size={22} />
            </View>
            {isLockedForCaller(selected, isPremiumUser) ? (
              <View style={styles.premiumBadge}>
                <Lock color={colors.warmCoral} size={12} />
                <Text style={[styles.difficultyText, { color: colors.warmCoral }]}>
                  Premium
                </Text>
              </View>
            ) : (
              <View style={[styles.difficultyBadge, { backgroundColor: difficultyTone(selected.difficulty).background }]}>
                <Text style={[styles.difficultyText, { color: difficultyTone(selected.difficulty).text }]}>
                  {difficultyTone(selected.difficulty).label}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.todayKicker}>Today's scenario</Text>
          <Text style={styles.todayTitle}>{selected.title}</Text>
          <Text style={styles.todayScenario}>{selected.description}</Text>
          <Pressable
            style={styles.startButton}
            accessibilityLabel={
              isLockedForCaller(selected, isPremiumUser)
                ? `Premium session: ${selected.title}`
                : `Start session: ${selected.title}`
            }
            onPress={() => {
              handleScenarioPress(selected);
            }}
          >
            <Play color="#FFFFFF" size={18} />
            <Text style={styles.startButtonText}>Start session</Text>
          </Pressable>
        </GlassCard>
      ) : null}

      {rest.length > 0 ? (
        <Text style={styles.sectionTitle}>More scenarios</Text>
      ) : null}
      {rest.map((scenario) => {
        const locked = isLockedForCaller(scenario, isPremiumUser);
        return (
          <GlassCard key={scenario.id} style={styles.rowCard}>
            <Pressable
              style={styles.rowPressable}
              accessibilityLabel={
                locked
                  ? `Premium scenario: ${scenario.title}`
                  : `Start scenario: ${scenario.title}`
              }
              onPress={() => {
                handleScenarioPress(scenario);
              }}
            >
              <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>{scenario.title}</Text>
                <Text style={styles.rowMeta}>{scenario.category}</Text>
              </View>
              {locked ? (
                <View style={styles.premiumBadge}>
                  <Lock color={colors.warmCoral} size={12} />
                  <Text style={[styles.difficultyText, { color: colors.warmCoral }]}>
                    Premium
                  </Text>
                </View>
              ) : (
                <>
                  <View style={[styles.difficultyBadge, { backgroundColor: difficultyTone(scenario.difficulty).background }]}>
                    <Text style={[styles.difficultyText, { color: difficultyTone(scenario.difficulty).text }]}>
                      {difficultyTone(scenario.difficulty).label}
                    </Text>
                  </View>
                  <ChevronRight color={colors.textTertiary} size={18} />
                </>
              )}
            </Pressable>
          </GlassCard>
        );
      })}

      <View style={styles.footerNote}>
        <Sparkles color={colors.auroraTeal} size={16} />
        <Text style={styles.footerNoteText}>
          Every session feeds your streak, quests, and CanadaReady scores.
        </Text>
      </View>

      <PaywallModal
        visible={paywallVisible}
        onClose={() => {
          setPaywallVisible(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.nightSky,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  brandLine: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },
  loadingBlock: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 24,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  errorBlock: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    textAlign: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.nightSkyDeep,
  },
  retryText: {
    color: colors.auroraTeal,
    fontSize: 13,
    fontWeight: "700",
  },
  todayCard: {
    gap: 10,
  },
  todayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todayKickerWell: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.auroraTealSoft,
  },
  todayKicker: {
    color: colors.auroraTeal,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  todayTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  todayScenario: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.auroraTeal,
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 4,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  rowCard: {
    padding: 14,
  },
  rowPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  rowMeta: {
    color: colors.textTertiary,
    fontSize: 12,
    textTransform: "capitalize",
  },
  difficultyBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    backgroundColor: colors.warmCoralSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: "700",
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 6,
    paddingTop: 6,
  },
  footerNoteText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
