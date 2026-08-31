/**
 * CanadaReady™ Scorecard screen (SN-048): a beautiful, branded snapshot
 * of the learner's speaking readiness. Renders the badge hero, a score
 * ring/bar, six band bars with CLB-inspired hints, a stats grid, and
 * the mandatory disclaimer footer. A sticky bottom button either
 * triggers the PDF export (premium users, through expo-file-system +
 * expo-sharing) or opens the PaywallModal (free tier).
 */
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Download,
  Flame,
  Lock,
  RefreshCw,
  Trophy,
  Zap,
} from "lucide-react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { GlassCard } from "../src/components/GlassCard";
import { PaywallModal } from "../src/components/PaywallModal";
import {
  fetchScorecard,
  fetchScorecardPdf,
  type Scorecard,
} from "../src/api/client";
import { trackEvent } from "../lib/analytics";
import { useAuthStore } from "../src/stores/authStore";
import { colors } from "../src/theme/colors";

const BAND_BAR_COLORS = [
  colors.auroraTeal,
  colors.success,
  colors.warmCoral,
  "#A78BFA",
  "#F472B6",
  "#34D399",
];

export default function ScorecardScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const isPremium = user?.subscription_tier === "premium";

  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [failed, setFailed] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);

  // ------------------------------------------------------------------
  // Load
  // ------------------------------------------------------------------
  const load = useCallback(async () => {
    setFailed(false);
    setScorecard(null);
    try {
      const data = await fetchScorecard();
      setScorecard(data);
      trackEvent("Scorecard Viewed");
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // ------------------------------------------------------------------
  // Export PDF
  // ------------------------------------------------------------------
  const handleExport = useCallback(async (): Promise<void> => {
    if (!isPremium) {
      setPaywallVisible(true);
      return;
    }
    if (isExporting) {
      return;
    }
    setIsExporting(true);
    try {
      const base64 = await fetchScorecardPdf();
      const filename = `sonolo-scorecard-${Date.now()}.pdf`;
      const uri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(uri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Export your CanadaReady™ Scorecard",
      });
      trackEvent("Scorecard PDF Exported");
    } catch {
      // Silent failure — the share sheet is a best-effort UX.
    } finally {
      setIsExporting(false);
    }
  }, [isPremium, isExporting]);

  // ------------------------------------------------------------------
  // Loading / error states
  // ------------------------------------------------------------------
  if (failed) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
        <View style={styles.centeredNote}>
          <Text style={styles.noteTitle}>Scorecard unavailable</Text>
          <Text style={styles.noteBody}>
            Your scorecard needs a connection — pull to retry once you're
            back online.
          </Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => {
              void load();
            }}
          >
            <RefreshCw color={colors.auroraTeal} size={16} />
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (scorecard === null) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
        <ActivityIndicator color={colors.auroraTeal} style={styles.spinner} />
      </View>
    );
  }

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  const badgeColor =
    scorecard.badge.code === "canada-ready"
      ? colors.success
      : scorecard.badge.code === "confident-colleague"
        ? colors.auroraTeal
        : colors.warmCoral;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Badge hero */}
        <View style={styles.hero}>
          <View
            style={[styles.badgeIconWell, { backgroundColor: `${badgeColor}E6` }]}
          >
            <Trophy color="#FFFFFF" size={30} />
          </View>
          <Text style={styles.badgeTitle}>{scorecard.badge.title}</Text>
          <Text style={styles.badgeTagline}>{scorecard.badge.tagline}</Text>
        </View>

        {/* CanadaReady score callout */}
        <GlassCard style={styles.scoreCallout}>
          <Text style={styles.scoreLabel}>CanadaReady™ Score</Text>
          <Text style={[styles.scoreValue, { color: badgeColor }]}>
            {scorecard.canada_ready_score}
            <Text style={styles.scoreDenom}> / 100</Text>
          </Text>
        </GlassCard>

        {/* Six band bars */}
        <View style={styles.bandsSection}>
          <Text style={styles.sectionTitle}>Speaking Readiness</Text>
          {scorecard.bands.map((band, index) => (
            <View key={band.code} style={styles.bandRow}>
              <View style={styles.bandLabelRow}>
                <Text style={styles.bandLabel}>{band.label}</Text>
                <Text style={styles.bandHint}>{band.clb_hint}</Text>
              </View>
              <View style={styles.bandBarTrack}>
                <View
                  style={[
                    styles.bandBarFill,
                    {
                      width: `${Math.max(2, band.score)}%`,
                      backgroundColor:
                        BAND_BAR_COLORS[index % BAND_BAR_COLORS.length],
                    },
                  ]}
                />
              </View>
              <Text style={styles.bandScore}>{band.score}</Text>
            </View>
          ))}
        </View>

        {/* Stats grid */}
        <GlassCard style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Your stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Zap color={colors.auroraTeal} size={18} />
              <Text style={styles.statValue}>
                {scorecard.stats.sessions_completed}
              </Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <RefreshCw color={colors.auroraTeal} size={18} />
              <Text style={styles.statValue}>
                {scorecard.stats.speaking_minutes}
              </Text>
              <Text style={styles.statLabel}>Speaking min</Text>
            </View>
            <View style={styles.statItem}>
              <Flame color={colors.warmCoral} size={18} />
              <Text style={styles.statValue}>
                {scorecard.stats.streak_current}
              </Text>
              <Text style={styles.statLabel}>Streak days</Text>
            </View>
            <View style={styles.statItem}>
              <Trophy color={colors.success} size={18} />
              <Text style={styles.statValue}>
                {scorecard.stats.total_xp}
              </Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
          </View>
        </GlassCard>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>{scorecard.disclaimer}</Text>
      </ScrollView>

      {/* Sticky bottom action */}
      <View
        style={[
          styles.actionBar,
          {
            paddingBottom: insets.bottom + 16,
            paddingTop: insets.bottom > 0 ? 8 : 12,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            isExporting && styles.actionButtonDisabled,
            pressed && styles.actionButtonPressed,
          ]}
          accessibilityLabel={
            isPremium ? "Export PDF" : "Unlock PDF export"
          }
          disabled={isExporting}
          onPress={() => {
            void handleExport();
          }}
        >
          {isExporting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : isPremium ? (
            <>
              <Download color="#FFFFFF" size={18} />
              <Text style={styles.actionButtonText}>Export PDF</Text>
            </>
          ) : (
            <>
              <Lock color="#FFFFFF" size={18} />
              <Text style={styles.actionButtonText}>Unlock PDF Export</Text>
            </>
          )}
        </Pressable>
      </View>

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
    gap: 16,
  },
  hero: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  badgeIconWell: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  badgeTagline: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  scoreCallout: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 20,
  },
  scoreLabel: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  scoreValue: {
    fontSize: 44,
    fontWeight: "800",
  },
  scoreDenom: {
    fontSize: 18,
    fontWeight: "600",
  },
  bandsSection: {
    gap: 8,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  bandRow: {
    gap: 3,
  },
  bandLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bandLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  bandHint: {
    color: colors.textTertiary,
    fontSize: 11,
  },
  bandBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(148, 163, 184, 0.2)",
    overflow: "hidden",
    marginBottom: 2,
  },
  bandBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  bandScore: {
    color: colors.textTertiary,
    fontSize: 11,
    textAlign: "right",
  },
  statsCard: {
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    color: colors.textTertiary,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  disclaimer: {
    color: colors.textTertiary,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    fontStyle: "italic",
    paddingHorizontal: 20,
  },
  centeredNote: {
    alignItems: "center",
    gap: 10,
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
    opacity: 0.7,
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