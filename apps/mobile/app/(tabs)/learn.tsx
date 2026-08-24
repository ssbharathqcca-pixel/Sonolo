/**
 * Learn — today's daily quests with live progress (SN-017) plus the
 * scenario pack catalog feeding the speaking loop.
 */
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { CheckCircle2, ChevronRight, Target } from "lucide-react-native";

import { GlassCard } from "../../src/components/GlassCard";
import {
  fetchTodayQuests,
  type QuestResult,
} from "../../src/api/client";
import { DIFFICULTY_COLORS, QUESTS, type Quest } from "../../src/data/quests";
import { colors } from "../../src/theme/colors";

function QuestProgressBar({ percent }: { percent: number }): JSX.Element {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(
      150,
      withTiming(percent, { duration: 600, easing: Easing.out(Easing.quad) }),
    );
  }, [percent, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <View style={styles.barTrack}>
      <Animated.View style={[styles.barFill, fillStyle]} />
    </View>
  );
}

function DailyQuestCard({ quest }: { quest: QuestResult }): JSX.Element {
  const percent = Math.min(
    100,
    Math.round((quest.progress_count / Math.max(1, quest.target_count)) * 100),
  );

  return (
    <GlassCard style={styles.questCard}>
      <View style={styles.questHeader}>
        <View style={styles.questIconWell}>
          <Target color={colors.auroraTeal} size={18} />
        </View>
        <View style={styles.questInfo}>
          <Text style={styles.questTitle}>{quest.title}</Text>
          <Text style={styles.questMeta} numberOfLines={1}>
            {quest.description}
          </Text>
        </View>
        {quest.completed ? (
          <CheckCircle2 color={colors.success} size={20} />
        ) : (
          <View style={styles.xpChip}>
            <Text style={styles.xpChipText}>+{quest.reward_xp} XP</Text>
          </View>
        )}
      </View>
      <QuestProgressBar percent={percent} />
      <Text style={styles.questProgressText}>
        {quest.completed
          ? "Done — reward earned"
          : `${quest.progress_count} of ${quest.target_count}`}
      </Text>
    </GlassCard>
  );
}

function PackCard({ quest }: { quest: Quest }): JSX.Element {
  const router = useRouter();
  const Icon = quest.icon;
  const tone = DIFFICULTY_COLORS[quest.difficulty];

  return (
    <GlassCard style={styles.packCard}>
      <Pressable
        style={styles.packPressable}
        accessibilityLabel={`Start scenario pack: ${quest.title}`}
        onPress={() =>
          router.push({ pathname: "/session/[id]", params: { id: quest.id } })
        }
      >
        <View style={styles.packIconWell}>
          <Icon color={colors.auroraTeal} size={22} />
        </View>
        <View style={styles.packInfo}>
          <Text style={styles.packTitle}>{quest.title}</Text>
          <Text style={styles.packMeta}>
            {quest.minutes} min · +{quest.xp} XP
          </Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: tone.background }]}>
          <Text style={[styles.difficultyText, { color: tone.text }]}>
            {quest.difficulty}
          </Text>
        </View>
        <ChevronRight color={colors.textTertiary} size={18} />
      </Pressable>
    </GlassCard>
  );
}

export default function LearnScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const [quests, setQuests] = useState<QuestResult[] | null>(null);
  const [questsUnavailable, setQuestsUnavailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadQuests = useCallback(async (): Promise<void> => {
    try {
      const response = await fetchTodayQuests();
      setQuests(response.quests);
      setQuestsUnavailable(false);
    } catch {
      // Daily quests are live data; without a connection we say so and
      // keep the rest of the screen usable.
      setQuestsUnavailable(true);
    }
  }, []);

  useEffect(() => {
    void loadQuests();
  }, [loadQuests]);

  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await loadQuests();
    setRefreshing(false);
  }, [loadQuests]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: 120 },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            void onRefresh();
          }}
          tintColor={colors.auroraTeal}
        />
      }
    >
      <Text style={styles.heading}>Learn</Text>
      <Text style={styles.subheading}>
        Short, real-life scenarios. Speak them until they feel boring — that's
        fluency.
      </Text>

      {quests === null && !questsUnavailable ? (
        <ActivityIndicator
          color={colors.auroraTeal}
          style={styles.questsSpinner}
        />
      ) : null}

      {quests !== null && quests.length > 0 ? (
        <View style={styles.questsSection}>
          <Text style={styles.sectionTitle}>Today's quests</Text>
          {quests.map((quest) => (
            <DailyQuestCard key={quest.code} quest={quest} />
          ))}
        </View>
      ) : null}

      {questsUnavailable ? (
        <Text style={styles.offlineNote}>
          Quests need a connection — they'll reappear when you're back online.
        </Text>
      ) : null}

      <Text style={styles.sectionTitle}>Scenario packs</Text>
      {QUESTS.map((quest) => (
        <PackCard key={quest.id} quest={quest} />
      ))}
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
    gap: 14,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "700",
  },
  subheading: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  questsSpinner: {
    paddingVertical: 12,
  },
  questsSection: {
    gap: 10,
  },
  questCard: {
    padding: 14,
    gap: 10,
  },
  questHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  questIconWell: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.auroraTealSoft,
  },
  questInfo: {
    flex: 1,
    gap: 2,
  },
  questTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  questMeta: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  xpChip: {
    borderRadius: 999,
    backgroundColor: colors.auroraTealSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  xpChipText: {
    color: colors.auroraTeal,
    fontSize: 11,
    fontWeight: "700",
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
  questProgressText: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: "600",
  },
  offlineNote: {
    color: colors.textTertiary,
    fontSize: 13,
    lineHeight: 18,
  },
  packCard: {
    padding: 14,
  },
  packPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  packIconWell: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.auroraTealSoft,
  },
  packInfo: {
    flex: 1,
    gap: 2,
  },
  packTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  packMeta: {
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
});
