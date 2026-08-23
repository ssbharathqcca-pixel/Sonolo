/**
 * Post-session feedback (SN-015): renders the real gamification result
 * from /sessions/complete — XP, streak, badges, the 6-dimension skill
 * radar, and daily quest progress. Falls back to sample data when the
 * screen is opened without a stored result (deep link / dev).
 */

import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, ChevronRight, Flame, Sparkles, Trophy } from "lucide-react-native";
import Svg, { Circle, Line, Polygon, Text as SvgText } from "react-native-svg";

import { GlassCard } from "../../src/components/GlassCard";
import { useScenarioStore } from "../../src/stores/scenarioStore";
import { useSessionResultStore } from "../../src/stores/sessionResultStore";
import { colors } from "../../src/theme/colors";

const SAMPLE_SCORES: Record<string, number> = {
  fluency: 78,
  pronunciation: 82,
  grammar: 64,
  vocabulary: 71,
  coherence: 74,
  task_completion: 88,
};
const DIMENSION_LABELS: Record<string, string> = {
  fluency: "Fluency",
  pronunciation: "Pronounce",
  grammar: "Grammar",
  vocabulary: "Vocab",
  coherence: "Coherence",
  task_completion: "Task Comp.",
};
const DIMENSION_KEYS = [
  "fluency",
  "pronunciation",
  "grammar",
  "vocabulary",
  "coherence",
  "task_completion",
] as const;

const CHART_SIZE = 300;
const CHART_CENTER = CHART_SIZE / 2;
const CHART_RADIUS = 92;
const LABEL_RADIUS = 116;

function vertex(index: number, radius: number): { x: number; y: number } {
  const angle = ((-90 + index * 60) * Math.PI) / 180;
  return {
    x: CHART_CENTER + radius * Math.cos(angle),
    y: CHART_CENTER + radius * Math.sin(angle),
  };
}

function ringPoints(radius: number): string {
  return DIMENSION_KEYS.map((_, index) => {
    const point = vertex(index, radius);
    return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
  }).join(" ");
}

function SkillRadar({ scores }: { scores: Record<string, number> }): JSX.Element {
  const scorePoints = DIMENSION_KEYS.map((key, index) => {
    const point = vertex(index, (CHART_RADIUS * (scores[key] ?? 0)) / 100);
    return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
  }).join(" ");

  return (
    <Svg
      viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
      style={styles.radar}
      accessibilityLabel="Radar chart of speaking skill scores"
    >
      {[0.33, 0.66, 1].map((scale) => (
        <Polygon
          key={scale}
          points={ringPoints(CHART_RADIUS * scale)}
          fill="none"
          stroke={colors.glassBorder}
          strokeWidth={1}
        />
      ))}
      {DIMENSION_KEYS.map((key, index) => {
        const point = vertex(index, CHART_RADIUS);
        return (
          <Line
            key={key}
            x1={CHART_CENTER}
            y1={CHART_CENTER}
            x2={point.x}
            y2={point.y}
            stroke={colors.glassBorder}
            strokeWidth={1}
          />
        );
      })}
      <Polygon
        points={scorePoints}
        fill={colors.auroraTealSoft}
        stroke={colors.auroraTeal}
        strokeWidth={2}
      />
      {DIMENSION_KEYS.map((key, index) => {
        const point = vertex(index, (CHART_RADIUS * (scores[key] ?? 0)) / 100);
        return (
          <Circle key={key} cx={point.x} cy={point.y} r={4} fill={colors.auroraTeal} />
        );
      })}
      {DIMENSION_KEYS.map((key, index) => {
        const point = vertex(index, LABEL_RADIUS);
        return (
          <SvgText
            key={key}
            x={point.x}
            y={point.y}
            fill={colors.textSecondary}
            fontSize={11}
            fontWeight="600"
            textAnchor="middle"
          >
            {DIMENSION_LABELS[key]}
          </SvgText>
        );
      })}
    </Svg>
  );
}

export default function FeedbackScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const result = useSessionResultStore((state) => state.lastResult);
  const selected = useScenarioStore((state) => state.selected);

  const scores: Record<string, number> =
    result !== null
      ? Object.fromEntries(
          result.skills.map((skill) => [skill.dimension, skill.new_score]),
        )
      : SAMPLE_SCORES;
  const overall = Math.round(
    DIMENSION_KEYS.reduce((sum, key) => sum + (scores[key] ?? 0), 0) /
      DIMENSION_KEYS.length,
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.kicker}>
        {result !== null ? "Session complete" : "Sample report"}
      </Text>
      <Text style={styles.heading}>
        {selected?.title ?? "Voice session"}
      </Text>
      {params.id !== undefined && result !== null ? (
        <Text style={styles.sessionId}>#{params.id.slice(0, 8)}</Text>
      ) : null}

      <View style={styles.summaryRow}>
        <GlassCard style={styles.summaryCard}>
          <Sparkles color={colors.warmCoral} size={20} />
          <Text style={styles.xpValue}>
            +{result?.xp.total_xp ?? 0} XP
          </Text>
          <Text style={styles.summaryLabel}>
            {result !== null
              ? `${result.xp.session_xp} session + ${result.xp.quest_xp} quest`
              : "Finish a session to earn"}
          </Text>
        </GlassCard>
        <GlassCard style={styles.summaryCard}>
          <Flame color={colors.warmCoral} size={20} />
          <Text style={styles.streakValue}>{result?.streak_current ?? 0}</Text>
          <Text style={styles.summaryLabel}>
            day streak (best {result?.streak_longest ?? 0})
          </Text>
        </GlassCard>
      </View>

      <GlassCard style={styles.radarCard}>
        <Text style={styles.cardTitle}>Speaking readiness</Text>
        <SkillRadar scores={scores} />
        <View style={styles.dimensionList}>
          {DIMENSION_KEYS.map((key) => (
            <View key={key} style={styles.dimensionRow}>
              <Text style={styles.dimensionLabel}>{DIMENSION_LABELS[key]}</Text>
              <View style={styles.dimensionTrack}>
                <View
                  style={[styles.dimensionFill, { width: `${scores[key] ?? 0}%` }]}
                />
              </View>
              <Text style={styles.dimensionScore}>{Math.round(scores[key] ?? 0)}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.overallLine}>
          Overall {overall} · Level {result?.xp.level ?? 1} ·{" "}
          {result?.xp.progress_to_next_level ?? 0}/100 to next level
        </Text>
      </GlassCard>

      {result !== null && result.quests.length > 0 ? (
        <GlassCard style={styles.listCard}>
          <Text style={styles.cardTitle}>Today's quests</Text>
          {result.quests.map((quest) => (
            <View key={quest.code} style={styles.questRow}>
              <Check
                color={quest.completed ? colors.success : colors.textTertiary}
                size={16}
              />
              <View style={styles.questInfo}>
                <Text style={styles.questTitle}>{quest.title}</Text>
                <Text style={styles.questMeta}>
                  {quest.progress_count}/{quest.target_count} · +{quest.reward_xp} XP
                </Text>
              </View>
            </View>
          ))}
        </GlassCard>
      ) : null}

      {result !== null && result.newly_awarded_badges.length > 0 ? (
        <GlassCard style={styles.listCard}>
          <View style={styles.listHeader}>
            <Trophy color={colors.warning} size={18} />
            <Text style={styles.cardTitle}>New badges</Text>
          </View>
          {result.newly_awarded_badges.map((badge) => (
            <View key={badge.code} style={styles.questRow}>
              <ChevronRight color={colors.auroraTeal} size={16} />
              <View style={styles.questInfo}>
                <Text style={styles.questTitle}>{badge.title}</Text>
                <Text style={styles.questMeta}>{badge.description}</Text>
              </View>
            </View>
          ))}
        </GlassCard>
      ) : null}

      <Pressable
        style={styles.doneButton}
        onPress={() => {
          router.navigate("/");
        }}
        accessibilityLabel="Back to home"
      >
        <Text style={styles.doneButtonText}>Done</Text>
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
    paddingHorizontal: 20,
    gap: 16,
  },
  kicker: {
    color: colors.auroraTeal,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },
  sessionId: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  xpValue: {
    color: colors.warmCoral,
    fontSize: 24,
    fontWeight: "800",
  },
  streakValue: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  radarCard: {
    gap: 8,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  radar: {
    width: "100%",
    height: 300,
    alignSelf: "center",
  },
  dimensionList: {
    gap: 10,
    marginTop: 4,
  },
  dimensionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dimensionLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    width: 74,
  },
  dimensionTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.nightSkyDeep,
    overflow: "hidden",
  },
  dimensionFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.auroraTeal,
  },
  dimensionScore: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    width: 26,
    textAlign: "right",
  },
  overallLine: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
  listCard: {
    gap: 12,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  questRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  questInfo: {
    flex: 1,
    gap: 2,
  },
  questTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  questMeta: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  doneButton: {
    backgroundColor: colors.auroraTeal,
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 8,
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
