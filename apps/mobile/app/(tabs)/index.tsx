/**
 * Home — the daily driver: CanadaReady progress card, today's quest,
 * and the rest of the quest catalog.
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronRight,
  Clock,
  Flame,
  Play,
  Sparkles,
  Zap,
} from "lucide-react-native";
import { GlassCard } from "../../src/components/GlassCard";
import {
  DIFFICULTY_COLORS,
  QUESTS,
  type Quest,
} from "../../src/data/quests";
import { colors } from "../../src/theme/colors";

const CANADA_READY_SCORE = 62;
const CANADA_READY_LEVEL = "CEFR B1 · Conversational";
const CANADA_READY_NEXT = "8 points to B1+";
const STREAK_DAYS = 12;

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

function DifficultyBadge({ quest }: { quest: Quest }): JSX.Element {
  const tone = DIFFICULTY_COLORS[quest.difficulty];
  return (
    <View style={[styles.difficultyBadge, { backgroundColor: tone.background }]}>
      <Text style={[styles.difficultyText, { color: tone.text }]}>
        {quest.difficulty}
      </Text>
    </View>
  );
}

function QuestRow({ quest }: { quest: Quest }): JSX.Element {
  const router = useRouter();
  const Icon = quest.icon;
  return (
    <GlassCard style={styles.questRowCard}>
      <Pressable
        style={styles.questRowPressable}
        accessibilityLabel={`Start quest: ${quest.title}`}
        onPress={() =>
          router.push({ pathname: "/session/[id]", params: { id: quest.id } })
        }
      >
        <View style={styles.questRowIconWell}>
          <Icon color={colors.auroraTeal} size={20} />
        </View>
        <View style={styles.questRowInfo}>
          <Text style={styles.questRowTitle}>{quest.title}</Text>
          <Text style={styles.questRowMeta}>
            {quest.minutes} min · +{quest.xp} XP
          </Text>
        </View>
        <DifficultyBadge quest={quest} />
        <ChevronRight color={colors.textTertiary} size={18} />
      </Pressable>
    </GlassCard>
  );
}

export default function HomeScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const todayQuest = QUESTS[0];
  const moreQuests = QUESTS.slice(1);
  const TodayIcon = todayQuest.icon;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: 120 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>{greetingForNow()}</Text>
      <Text style={styles.brandLine}>Ready to speak some English?</Text>

      <GlassCard style={styles.scoreCard}>
        <View style={styles.scoreHeader}>
          <View style={styles.scoreHeaderLeft}>
            <Text style={styles.scoreKicker}>CanadaReady Score</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreValue}>{CANADA_READY_SCORE}</Text>
              <Text style={styles.scoreMax}>/ 100</Text>
            </View>
          </View>
          <View style={styles.streakChip}>
            <Flame color={colors.warmCoral} size={16} />
            <Text style={styles.streakText}>{STREAK_DAYS}-day streak</Text>
          </View>
        </View>
        <View style={styles.scoreTrack}>
          <View
            style={[styles.scoreFill, { width: `${CANADA_READY_SCORE}%` }]}
          />
        </View>
        <Text style={styles.scoreLevel}>
          {CANADA_READY_LEVEL} · {CANADA_READY_NEXT}
        </Text>
      </GlassCard>

      <GlassCard style={styles.todayCard}>
        <View style={styles.todayHeader}>
          <View style={styles.todayIconWell}>
            <TodayIcon color={colors.auroraTeal} size={24} />
          </View>
          <DifficultyBadge quest={todayQuest} />
        </View>
        <Text style={styles.todayKicker}>Today's quest</Text>
        <Text style={styles.todayTitle}>{todayQuest.title}</Text>
        <Text style={styles.todayScenario}>{todayQuest.scenario}</Text>
        <View style={styles.todayChips}>
          <View style={styles.chip}>
            <Clock color={colors.textSecondary} size={14} />
            <Text style={styles.chipText}>{todayQuest.minutes} min</Text>
          </View>
          <View style={styles.chip}>
            <Zap color={colors.warmCoral} size={14} />
            <Text style={styles.chipText}>+{todayQuest.xp} XP</Text>
          </View>
        </View>
        <Pressable
          style={styles.startButton}
          accessibilityLabel={`Start session: ${todayQuest.title}`}
          onPress={() =>
            router.push({
              pathname: "/session/[id]",
              params: { id: todayQuest.id },
            })
          }
        >
          <Play color="#FFFFFF" size={18} />
          <Text style={styles.startButtonText}>Start session</Text>
        </Pressable>
      </GlassCard>

      <Text style={styles.sectionTitle}>More quests</Text>
      {moreQuests.map((quest) => (
        <QuestRow key={quest.id} quest={quest} />
      ))}

      <View style={styles.footerNote}>
        <Sparkles color={colors.auroraTeal} size={16} />
        <Text style={styles.footerNoteText}>
          Two more sessions this week and your CanadaReady score levels up.
        </Text>
      </View>
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
  scoreCard: {
    gap: 14,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  scoreHeaderLeft: {
    gap: 6,
  },
  scoreKicker: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  scoreValue: {
    color: colors.textPrimary,
    fontSize: 44,
    fontWeight: "800",
  },
  scoreMax: {
    color: colors.textTertiary,
    fontSize: 15,
    fontWeight: "600",
  },
  streakChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.warmCoralSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  streakText: {
    color: colors.warmCoral,
    fontSize: 12,
    fontWeight: "700",
  },
  scoreTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.nightSkyDeep,
    overflow: "hidden",
  },
  scoreFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.auroraTeal,
  },
  scoreLevel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  todayCard: {
    gap: 10,
  },
  todayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todayIconWell: {
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
  todayChips: {
    flexDirection: "row",
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.nightSkyDeep,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
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
  questRowCard: {
    padding: 14,
  },
  questRowPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  questRowIconWell: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.auroraTealSoft,
  },
  questRowInfo: {
    flex: 1,
    gap: 2,
  },
  questRowTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  questRowMeta: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  difficultyBadge: {
    borderRadius: 999,
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
