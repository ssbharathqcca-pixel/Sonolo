/**
 * Learn — the scenario pack catalog feeding the speaking loop.
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronRight } from "lucide-react-native";
import { GlassCard } from "../../src/components/GlassCard";
import { DIFFICULTY_COLORS, QUESTS, type Quest } from "../../src/data/quests";
import { colors } from "../../src/theme/colors";

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

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: 120 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Learn</Text>
      <Text style={styles.subheading}>
        Short, real-life scenarios. Speak them until they feel boring — that's
        fluency.
      </Text>
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
