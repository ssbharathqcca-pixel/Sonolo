/**
 * Onboarding step 3 — ready to start (SN-040).
 *
 * Summarizes the pack recommended from the chosen goal + language and
 * completes onboarding. The goal→pack map mirrors the manifest: career
 * and health map to the EN or Quebec FR packs, settlement to the
 * life-pack, and housing has no FR pack yet, so that combination falls
 * back to the Learn library. "Start Learning" persists completion and
 * lands on the Pack Detail screen when a pack exists.
 */

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Play, Sparkles } from "lucide-react-native";

import { GlassCard } from "../../src/components/GlassCard";
import { fetchPacks, type ContentPack } from "../../src/api/client";
import { useAuthStore } from "../../src/stores/authStore";
import { colors } from "../../src/theme/colors";

/** Onboarding goal the user is assumed to pick when none is present. */
const DEFAULT_GOAL = "settlement";

/** Goal id → manifest pack id per content language (SN-040). */
const GOAL_PACK_IDS: Record<string, { en: string | null; fr: string | null }> = {
  career: { en: "workplace-english-v1", fr: "quebec-workplace-v1" },
  health: { en: "healthcare-english-v1", fr: "quebec-healthcare-v1" },
  housing: { en: "housing-english-v1", fr: null },
  settlement: { en: "canadian-life-v1", fr: "quebec-life-v1" },
};

const GOAL_LABELS: Record<string, string> = {
  career: "Career & Workplace",
  health: "Health & Wellness",
  housing: "Housing & Renting",
  settlement: "Daily Settlement",
};

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  fr: "Français",
};

/** Manifest icon names mapped onto their Ionicons glyphs (SN-030). */
function packIcon(icon: string): "briefcase" | "home" | "map" | "book" {
  const icons: Record<string, "briefcase" | "home" | "map" | "book"> = {
    briefcase: "briefcase",
    home: "home",
    map: "map",
    book: "book",
  };
  return icons[icon] ?? "book";
}

export default function ReadyScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ goal?: string }>();
  const storedGoal = useAuthStore((state) => state.onboardingGoal);
  const language = useAuthStore((state) => state.user?.preferred_language ?? "en");
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);

  const goal = params.goal ?? storedGoal ?? DEFAULT_GOAL;

  const [recommended, setRecommended] = useState<ContentPack | null>(null);
  const [packsLoaded, setPacksLoaded] = useState(false);
  const [starting, setStarting] = useState(false);

  // The recommended pack is live manifest data (SN-030): fetch once on
  // mount and degrade to a generic summary when offline or unmapped.
  useEffect(() => {
    let cancelled = false;
    const mappedId = GOAL_PACK_IDS[goal]?.[language] ?? null;
    if (mappedId === null) {
      setPacksLoaded(true);
      return;
    }
    fetchPacks()
      .then((packs) => {
        if (!cancelled) {
          setRecommended(packs.find((pack) => pack.id === mappedId) ?? null);
          setPacksLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPacksLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [goal, language]);

  const start = async (): Promise<void> => {
    if (starting) {
      return;
    }
    setStarting(true);
    await completeOnboarding();
    // The app stack mounts once onboarding completes; land directly on
    // the recommended pack when one exists, else the Learn library.
    if (recommended !== null) {
      router.replace(`/pack/${recommended.id}`);
    } else {
      router.replace("/(tabs)/learn");
    }
  };

  const goalLabel = GOAL_LABELS[goal] ?? "Your focus";
  const languageLabel = LANGUAGE_LABELS[language] ?? language.toUpperCase();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.celebrationWell}>
        <Sparkles color={colors.auroraTeal} size={22} />
      </View>
      <Text style={styles.headline}>Your journey is ready.</Text>
      <Text style={styles.subheadline}>
        We picked a starting pack around {goalLabel} in {languageLabel}.
      </Text>

      {!packsLoaded ? (
        <ActivityIndicator
          color={colors.auroraTeal}
          style={styles.spinner}
        />
      ) : (
        <GlassCard style={styles.recommendCard}>
          <View style={styles.recommendHeader}>
            <View
              style={[
                styles.recommendIconWell,
                recommended !== null
                  ? { backgroundColor: `${recommended.theme_color}33` }
                  : null,
              ]}
            >
              <Ionicons
                name={packIcon(recommended?.icon ?? "book")}
                size={26}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.recommendInfo}>
              <Text style={styles.recommendKicker}>Recommended for you</Text>
              <Text style={styles.recommendTitle}>
                {recommended?.title ?? goalLabel}
              </Text>
            </View>
          </View>
          <Text style={styles.recommendDetail}>
            {recommended?.description ??
              "We'll curate scenarios around your focus as you learn."}
          </Text>
          <View style={styles.chipRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{goalLabel}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{languageLabel}</Text>
            </View>
          </View>
        </GlassCard>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.cta,
          starting && styles.ctaDisabled,
          pressed && styles.ctaPressed,
        ]}
        accessibilityLabel="Start Learning"
        accessibilityState={{ busy: starting, disabled: starting }}
        disabled={starting}
        onPress={() => {
          void start();
        }}
      >
        {starting ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Play color="#FFFFFF" size={18} />
        )}
        <Text style={styles.ctaText}>Start Learning</Text>
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
  celebrationWell: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: colors.auroraTealSoft,
  },
  headline: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  subheadline: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 8,
  },
  spinner: {
    paddingVertical: 32,
  },
  recommendCard: {
    gap: 14,
    padding: 18,
  },
  recommendHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  recommendIconWell: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  recommendInfo: {
    flex: 1,
    gap: 2,
  },
  recommendKicker: {
    color: colors.auroraTeal,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  recommendTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  recommendDetail: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.nightSkyDeep,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.auroraTeal,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  ctaDisabled: {
    opacity: 0.7,
  },
  ctaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
