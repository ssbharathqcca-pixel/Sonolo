/**
 * Post-session feedback — the report card.
 *
 * Renders the six speaking-readiness dimensions as a hexagon radar chart
 * (mock scores until the evaluation service lands), plus the wins and
 * growth edges from the session.
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, ChevronRight, Sparkles, Sprout, Trophy } from "lucide-react-native";
import Svg, { Circle, Line, Polygon, Text as SvgText } from "react-native-svg";
import { GlassCard } from "../../src/components/GlassCard";
import { FALLBACK_QUEST, getQuestById } from "../../src/data/quests";
import { colors } from "../../src/theme/colors";

interface SkillDimension {
  key: string;
  label: string;
  score: number;
}

const SKILL_DIMENSIONS: SkillDimension[] = [
  { key: "fluency", label: "Fluency", score: 78 },
  { key: "pronunciation", label: "Pronounce", score: 82 },
  { key: "grammar", label: "Grammar", score: 64 },
  { key: "vocabulary", label: "Vocab", score: 71 },
  { key: "coherence", label: "Coherence", score: 74 },
  { key: "taskCompletion", label: "Task Comp.", score: 88 },
];

const WINS = [
  { id: "w1", text: "Used \u201Cdouble-double\u201D like a regular." },
  { id: "w2", text: "Consistent, polite modals: \u201Ccould I get\u2026\u201D" },
  { id: "w3", text: "Clear, relaxed /r/ in \u201Corder\u201D." },
];

const GROWTH = [
  {
    id: "g1",
    text: "Swap \u201Cgood\u201D for \u201Cfantastic\u201D or \u201Csolid\u201D to sound more natural.",
  },
  {
    id: "g2",
    text: "Add question tags (\u201C\u2026cold today, eh?\u201D) to warm up small talk.",
  },
];

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
  return SKILL_DIMENSIONS.map((_, index) => {
    const point = vertex(index, radius);
    return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
  }).join(" ");
}

function scorePolygonPoints(): string {
  return SKILL_DIMENSIONS.map((dimension, index) => {
    const point = vertex(index, CHART_RADIUS * (dimension.score / 100));
    return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
  }).join(" ");
}

function SkillRadar(): JSX.Element {
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
      {SKILL_DIMENSIONS.map((dimension, index) => {
        const point = vertex(index, CHART_RADIUS);
        return (
          <Line
            key={dimension.key}
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
        points={scorePolygonPoints()}
        fill={colors.auroraTealSoft}
        stroke={colors.auroraTeal}
        strokeWidth={2}
      />
      {SKILL_DIMENSIONS.map((dimension, index) => {
        const point = vertex(index, CHART_RADIUS * (dimension.score / 100));
        return (
          <Circle
            key={dimension.key}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={colors.auroraTeal}
          />
        );
      })}
      {SKILL_DIMENSIONS.map((dimension, index) => {
        const point = vertex(index, LABEL_RADIUS);
        return (
          <SvgText
            key={dimension.key}
            x={point.x}
            y={point.y}
            fill={colors.textSecondary}
            fontSize={11}
            fontWeight="600"
            textAnchor="middle"
          >
            {dimension.label}
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
  const quest = getQuestById(params.id) ?? FALLBACK_QUEST;

  const overallScore = Math.round(
    SKILL_DIMENSIONS.reduce((sum, dimension) => sum + dimension.score, 0) /
      SKILL_DIMENSIONS.length,
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
      <Text style={styles.kicker}>Session complete</Text>
      <Text style={styles.heading}>{quest.title}</Text>

      <View style={styles.summaryRow}>
        <GlassCard style={styles.overallCard}>
          <Text style={styles.overallScore}>{overallScore}</Text>
          <Text style={styles.overallLabel}>Overall score</Text>
        </GlassCard>
        <GlassCard style={styles.xpCard}>
          <Sparkles color={colors.warmCoral} size={20} />
          <Text style={styles.xpValue}>+{quest.xp} XP</Text>
          <Text style={styles.xpLabel}>earned</Text>
        </GlassCard>
      </View>

      <GlassCard style={styles.radarCard}>
        <Text style={styles.cardTitle}>Speaking readiness</Text>
        <SkillRadar />
        <View style={styles.dimensionList}>
          {SKILL_DIMENSIONS.map((dimension) => (
            <View key={dimension.key} style={styles.dimensionRow}>
              <Text style={styles.dimensionLabel}>{dimension.label}</Text>
              <View style={styles.dimensionTrack}>
                <View
                  style={[styles.dimensionFill, { width: `${dimension.score}%` }]}
                />
              </View>
              <Text style={styles.dimensionScore}>{dimension.score}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <GlassCard style={styles.listCard}>
        <View style={styles.listHeader}>
          <Trophy color={colors.warning} size={18} />
          <Text style={styles.listTitle}>Wins</Text>
        </View>
        {WINS.map((win) => (
          <View key={win.id} style={styles.listRow}>
            <Check color={colors.success} size={16} />
            <Text style={styles.listText}>{win.text}</Text>
          </View>
        ))}
      </GlassCard>

      <GlassCard style={styles.listCard}>
        <View style={styles.listHeader}>
          <Sprout color={colors.success} size={18} />
          <Text style={styles.listTitle}>Growth edges</Text>
        </View>
        {GROWTH.map((edge) => (
          <View key={edge.id} style={styles.listRow}>
            <ChevronRight color={colors.auroraTeal} size={16} />
            <Text style={styles.listText}>{edge.text}</Text>
          </View>
        ))}
      </GlassCard>

      <Pressable
        style={styles.doneButton}
        onPress={() => router.navigate("/")}
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
  summaryRow: {
    flexDirection: "row",
    gap: 16,
  },
  overallCard: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  overallScore: {
    color: colors.textPrimary,
    fontSize: 40,
    fontWeight: "800",
  },
  overallLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  xpCard: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  xpValue: {
    color: colors.warmCoral,
    fontSize: 24,
    fontWeight: "800",
  },
  xpLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
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
  listCard: {
    gap: 12,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  listText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
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
