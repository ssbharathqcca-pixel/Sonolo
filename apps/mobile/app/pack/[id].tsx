/**
 * Pack detail — one manifest pack's full scenario list with visual
 * progress (SN-039). Tapped from a Learn tab pack card, the screen
 * renders a theme-colored hero banner, a glass "Your Progress" card
 * that overlaps it, the pack's scenarios with level badges and status
 * icons, and a large bottom action that resumes or starts the pack.
 *
 * Progress is a client-side mock for now: the first 3 free scenarios
 * count as completed, matching the free-vs-premium split of the seeded
 * packs. Level badges derive from the catalog's `difficulty` (the
 * backend serializes difficulty, not the scenario `level` column), so
 * sprout/branch/bloom follow the same thresholds as the Learn tab's
 * difficulty tones.
 */
import { useEffect, useMemo, useState } from "react";
import type { ComponentProps } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckCircle2, Lock, Play } from "lucide-react-native";

import { GlassCard } from "../../src/components/GlassCard";
import {
  fetchPacks,
  type ContentPack,
  type Scenario,
} from "../../src/api/client";
import { isLockedForCaller } from "../../src/lib/scenarioAccess";
import { useAuthStore } from "../../src/stores/authStore";
import { useScenarioStore } from "../../src/stores/scenarioStore";
import { colors } from "../../src/theme/colors";

/** Number of free scenarios the mock completion state marks as done. */
const MOCK_COMPLETED_FREE_COUNT = 3;

/** Manifest icon names mapped onto their Ionicons glyphs (SN-030). */
const PACK_ICONS: Record<string, ComponentProps<typeof Ionicons>["name"]> = {
  briefcase: "briefcase",
  home: "home",
  map: "map",
  book: "book",
};

function packIcon(icon: string): ComponentProps<typeof Ionicons>["name"] {
  return PACK_ICONS[icon] ?? "book";
}

/**
 * Level badge from the catalog difficulty (SN-039): the mobile
 * Scenario payload carries `difficulty`, not the backend `level`
 * column, so sprout/branch/bloom mirror the difficulty tones.
 */
function levelTone(difficulty: number | null): {
  label: string;
  text: string;
  background: string;
} {
  if (difficulty === null || difficulty <= 2) {
    return { label: "Sprout", text: colors.success, background: colors.successSoft };
  }
  if (difficulty <= 3) {
    return {
      label: "Branch",
      text: colors.auroraTeal,
      background: colors.auroraTealSoft,
    };
  }
  return {
    label: "Bloom",
    text: colors.warmCoral,
    background: colors.warmCoralSoft,
  };
}

type ScenarioStatus = "completed" | "locked" | "available";

function statusIcon(status: ScenarioStatus): JSX.Element {
  if (status === "completed") {
    return <CheckCircle2 color={colors.success} size={22} />;
  }
  if (status === "locked") {
    return <Lock color={colors.textTertiary} size={20} />;
  }
  return (
    <View style={styles.playCircle}>
      <Play color={colors.auroraTeal} size={13} />
    </View>
  );
}

export default function PackDetailScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const params = useLocalSearchParams<{ id?: string }>();
  const packId = params.id ?? "";

  const [packs, setPacks] = useState<ContentPack[]>([]);
  const [packsFailed, setPacksFailed] = useState(false);

  const user = useAuthStore((state) => state.user);
  const scenarios = useScenarioStore((state) => state.scenarios);
  const isLoadingScenarios = useScenarioStore((state) => state.isLoading);
  const catalogLanguage = useScenarioStore((state) => state.language);
  const loadScenarios = useScenarioStore((state) => state.load);

  const isPremiumUser = user?.subscription_tier === "premium";

  // Pack metadata is static manifest data (SN-030): fetch once on mount
  // and degrade to an error note when offline.
  useEffect(() => {
    let cancelled = false;
    fetchPacks()
      .then((manifestPacks) => {
        if (!cancelled) {
          setPacks(manifestPacks);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPacksFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // The scenario catalog follows the account's content language (SN-020),
  // same lazy-load contract as the Learn tab.
  const preferredLanguage = user?.preferred_language ?? "en";
  useEffect(() => {
    if (scenarios.length === 0 || catalogLanguage !== preferredLanguage) {
      void loadScenarios(preferredLanguage);
    }
  }, [scenarios.length, catalogLanguage, preferredLanguage, loadScenarios]);

  const pack = useMemo(
    () => packs.find((candidate) => candidate.id === packId) ?? null,
    [packs, packId],
  );

  // Exact pack membership first (SN-035), with the category + language
  // fallback for catalogs cached before pack ids shipped. The null pack
  // branch keeps this memo hook-order safe before the loading gate.
  const packScenarios = useMemo(
    () =>
      scenarios.filter((scenario) => {
        if (scenario.pack_id) {
          return scenario.pack_id === packId;
        }
        if (pack === null) {
          return false;
        }
        return (
          scenario.category === pack.category &&
          (scenario.target_language ?? "")
            .toLowerCase()
            .startsWith(pack.language.toLowerCase())
        );
      }),
    [scenarios, packId, pack],
  );

  // Mock completion state (SN-039): the first 3 free scenarios are done.
  const { completedIds, firstAvailable } = useMemo(() => {
    const free = packScenarios.filter(
      (scenario) => !isLockedForCaller(scenario, isPremiumUser),
    );
    const completed = new Set(
      free
        .slice(0, MOCK_COMPLETED_FREE_COUNT)
        .map((scenario) => scenario.id),
    );
    return { completedIds: completed, firstAvailable: free[0] ?? null };
  }, [packScenarios, isPremiumUser]);

  const completedCount = completedIds.size;

  // All hooks above run before this gate so their order never shifts
  // between the loading and loaded renders.
  if (pack === null) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
        {packsFailed ? (
          <View style={styles.centeredNote}>
            <Text style={styles.noteTitle}>Pack unavailable</Text>
            <Text style={styles.noteBody}>
              Pack details need a connection — try again once you're back
              online.
            </Text>
          </View>
        ) : (
          <ActivityIndicator
            color={colors.auroraTeal}
            style={styles.listSpinner}
          />
        )}
      </View>
    );
  }

  const statusFor = (scenario: Scenario): ScenarioStatus => {
    if (isLockedForCaller(scenario, isPremiumUser)) {
      return "locked";
    }
    return completedIds.has(scenario.id) ? "completed" : "available";
  };

  const handleScenarioPress = (scenario: Scenario): void => {
    if (statusFor(scenario) === "locked") {
      return;
    }
    router.push(`/session/${scenario.id}`);
  };

  const handleActionPress = (): void => {
    if (firstAvailable !== null) {
      router.push(`/session/${firstAvailable.id}`);
    }
  };

  const heroHeight = Math.round(windowHeight * 0.3);

  const header = (
    <View>
      <View
        style={[
          styles.hero,
          {
            height: heroHeight,
            backgroundColor: pack.theme_color,
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <View style={styles.heroInner}>
          <View style={styles.heroIconWell}>
            <Ionicons name={packIcon(pack.icon)} size={34} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>{pack.title}</Text>
          <Text style={styles.heroDescription}>{pack.description}</Text>
        </View>
      </View>

      <View style={styles.progressOverlap}>
        <GlassCard style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressCount}>
              {completedCount} of {packScenarios.length} Scenarios Completed
            </Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${
                    packScenarios.length === 0
                      ? 0
                      : Math.round((completedCount / packScenarios.length) * 100)
                  }%`,
                },
              ]}
            />
          </View>
        </GlassCard>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={packScenarios}
        keyExtractor={(scenario) => scenario.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        ListHeaderComponent={
          isLoadingScenarios && scenarios.length === 0 ? (
            <View>
              {header}
              <ActivityIndicator
                color={colors.auroraTeal}
                style={styles.listSpinner}
              />
            </View>
          ) : (
            header
          )
        }
        renderItem={({ item }) => {
          const status = statusFor(item);
          const tone = levelTone(item.difficulty);
          return (
            <GlassCard style={styles.rowCard}>
              <Pressable
                style={styles.rowPressable}
                accessibilityLabel={
                  status === "locked"
                    ? `Premium scenario: ${item.title}`
                    : status === "completed"
                      ? `Completed scenario: ${item.title}`
                      : `Start scenario: ${item.title}`
                }
                accessibilityState={{ disabled: status === "locked" }}
                disabled={status === "locked"}
                onPress={() => {
                  handleScenarioPress(item);
                }}
              >
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View
                    style={[styles.levelBadge, { backgroundColor: tone.background }]}
                  >
                    <Text style={[styles.levelText, { color: tone.text }]}>
                      {tone.label}
                    </Text>
                  </View>
                </View>
                {statusIcon(status)}
              </Pressable>
            </GlassCard>
          );
        }}
        ListEmptyComponent={
          isLoadingScenarios && scenarios.length === 0 ? null : (
            <View style={styles.centeredNote}>
              <Text style={styles.noteBody}>
                {scenarios.length === 0
                  ? "Scenarios need a connection on first launch — they'll appear once you're back online."
                  : "No scenarios in this pack yet — try another one."}
              </Text>
            </View>
          )
        }
      />

      <View
        style={[
          styles.actionBar,
          { paddingBottom: insets.bottom + 16, paddingTop: insets.bottom > 0 ? 8 : 12 },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            firstAvailable === null && styles.actionButtonDisabled,
            pressed && styles.actionButtonPressed,
          ]}
          accessibilityLabel={
            completedCount > 0 ? "Continue Learning" : "Start Pack"
          }
          disabled={firstAvailable === null}
          onPress={handleActionPress}
        >
          <Play color="#FFFFFF" size={18} />
          <Text style={styles.actionButtonText}>
            {completedCount > 0 ? "Continue Learning" : "Start Pack"}
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
  hero: {
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  heroInner: {
    alignItems: "center",
    gap: 10,
    paddingTop: 24,
  },
  heroIconWell: {
    width: 72,
    height: 72,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  heroDescription: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  progressOverlap: {
    marginTop: -40,
    paddingHorizontal: 20,
  },
  progressCard: {
    padding: 16,
    gap: 10,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  progressTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  progressCount: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.nightSkyDeep,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.auroraTeal,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  listSpinner: {
    paddingVertical: 16,
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
    gap: 6,
  },
  rowTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  levelBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  levelText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  playCircle: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.auroraTealSoft,
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
  actionButtonDisabled: {
    opacity: 0.4,
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
