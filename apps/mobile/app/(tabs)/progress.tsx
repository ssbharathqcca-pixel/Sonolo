/**
 * Progress — weekly practice minutes, streak, and CanadaReady trend.
 */
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Flame, TrendingUp } from "lucide-react-native";
import { GlassCard } from "../../src/components/GlassCard";
import { colors } from "../../src/theme/colors";

interface PracticeDay {
  day: string;
  minutes: number;
}

const WEEK_MINUTES: PracticeDay[] = [
  { day: "Mon", minutes: 6 },
  { day: "Tue", minutes: 9 },
  { day: "Wed", minutes: 4 },
  { day: "Thu", minutes: 11 },
  { day: "Fri", minutes: 8 },
  { day: "Sat", minutes: 2 },
  { day: "Sun", minutes: 7 },
];

const MAX_BAR_MINUTES = 12;
const BAR_TRACK_HEIGHT = 100;
const STREAK_DAYS = 12;
const SCORE_GAIN_THIS_WEEK = 2;

const totalMinutes = WEEK_MINUTES.reduce(
  (sum, day) => sum + day.minutes,
  0,
);

function WeekBar({ day, index }: { day: PracticeDay; index: number }): JSX.Element {
  const height = useSharedValue(0);

  useEffect(() => {
    height.value = withDelay(
      index * 70,
      withTiming(
        6 + (day.minutes / MAX_BAR_MINUTES) * (BAR_TRACK_HEIGHT - 10),
        { duration: 500, easing: Easing.out(Easing.quad) },
      ),
    );
  }, [height, index, day.minutes]);

  const style = useAnimatedStyle(() => ({ height: height.value }));

  return (
    <View style={styles.barColumn}>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, style]} />
      </View>
      <Text style={styles.barLabel}>{day.day}</Text>
    </View>
  );
}

export default function ProgressScreen(): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: 120 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Progress</Text>

      <View style={styles.summaryRow}>
        <GlassCard style={styles.summaryCard}>
          <Flame color={colors.warmCoral} size={20} />
          <Text style={styles.summaryValue}>{STREAK_DAYS} days</Text>
          <Text style={styles.summaryLabel}>Streak</Text>
        </GlassCard>
        <GlassCard style={styles.summaryCard}>
          <TrendingUp color={colors.auroraTeal} size={20} />
          <Text style={styles.summaryValue}>{totalMinutes} min</Text>
          <Text style={styles.summaryLabel}>This week</Text>
        </GlassCard>
        <GlassCard style={styles.summaryCard}>
          <Text style={styles.summaryGain}>+{SCORE_GAIN_THIS_WEEK}</Text>
          <Text style={styles.summaryLabel}>CanadaReady</Text>
        </GlassCard>
      </View>

      <GlassCard style={styles.chartCard}>
        <Text style={styles.cardTitle}>Practice minutes</Text>
        <Text style={styles.cardSubtitle}>Consistency beats intensity.</Text>
        <View style={styles.chartRow}>
          {WEEK_MINUTES.map((day, index) => (
            <WeekBar key={day.day} day={day} index={index} />
          ))}
        </View>
      </GlassCard>

      <GlassCard style={styles.streakCard}>
        <Text style={styles.cardTitle}>Longest streak yet</Text>
        <Text style={styles.streakText}>
          One 3-minute session keeps the flame alive. Miss a day and Sonolo
          rebuilds your quest list around what you practiced last.
        </Text>
      </GlassCard>
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
  heading: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    padding: 16,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  summaryGain: {
    color: colors.success,
    fontSize: 20,
    fontWeight: "800",
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  chartCard: {
    gap: 6,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  cardSubtitle: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  barColumn: {
    alignItems: "center",
    gap: 6,
  },
  barTrack: {
    height: BAR_TRACK_HEIGHT,
    justifyContent: "flex-end",
  },
  barFill: {
    width: 16,
    borderRadius: 8,
    backgroundColor: colors.auroraTeal,
  },
  barLabel: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: "600",
  },
  streakCard: {
    gap: 8,
  },
  streakText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
