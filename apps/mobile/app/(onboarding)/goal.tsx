/**
 * Onboarding step 2 — goal selection (SN-040).
 *
 * Four content-focus cards map to the manifest pack categories: career
 * (workplace), health (healthcare), housing, and settlement. Picking
 * one persists the choice device-side via SecureStore so the ready
 * screen can recommend the right pack; the flow then advances.
 */

import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check } from "lucide-react-native";

import { GlassCard } from "../../src/components/GlassCard";
import { useAuthStore } from "../../src/stores/authStore";
import { colors } from "../../src/theme/colors";

interface GoalOption {
  id: string;
  title: string;
  detail: string;
  /** Ionicons glyph used for the card icon. */
  icon: "briefcase" | "medkit" | "home" | "map";
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: "career",
    title: "Career & Workplace",
    detail: "Interviews, meetings, and workplace confidence.",
    icon: "briefcase",
  },
  {
    id: "health",
    title: "Health & Wellness",
    detail: "Doctors, pharmacies, and appointments.",
    icon: "medkit",
  },
  {
    id: "housing",
    title: "Housing & Renting",
    detail: "Apartments, leases, and landlord conversations.",
    icon: "home",
  },
  {
    id: "settlement",
    title: "Daily Settlement",
    detail: "Everyday life: banks, transit, and neighbours.",
    icon: "map",
  },
];

export default function GoalScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setOnboardingGoal = useAuthStore((state) => state.setOnboardingGoal);
  const [saving, setSaving] = useState<string | null>(null);

  const choose = async (option: GoalOption): Promise<void> => {
    if (saving !== null) {
      return;
    }
    setSaving(option.id);
    try {
      await setOnboardingGoal(option.id);
      router.push({ pathname: "./ready", params: { goal: option.id } });
    } catch {
      // SecureStore write failure is non-fatal (goal is ephemeral).
      router.push({ pathname: "./ready", params: { goal: option.id } });
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.headline}>What is your main focus?</Text>

      <View style={styles.options}>
        {GOAL_OPTIONS.map((option) => {
          const busy = saving === option.id;
          return (
            <Pressable
              key={option.id}
              accessibilityLabel={`Select goal ${option.title}`}
              accessibilityState={{ busy, disabled: saving !== null }}
              disabled={saving !== null}
              onPress={() => {
                void choose(option);
              }}
              style={({ pressed }) => [
                pressed && styles.cardPressed,
              ]}
            >
              <GlassCard style={styles.goalCard}>
                <View style={styles.iconWell}>
                  <Ionicons name={option.icon} size={24} color="#FFFFFF" />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>{option.title}</Text>
                  <Text style={styles.goalDetail}>{option.detail}</Text>
                </View>
                {busy ? (
                  <ActivityIndicator color={colors.auroraTeal} size="small" />
                ) : (
                  <View style={styles.checkWell}>
                    <Check color={colors.auroraTeal} size={16} />
                  </View>
                )}
              </GlassCard>
            </Pressable>
          );
        })}
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
    paddingHorizontal: 24,
    gap: 16,
  },
  headline: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 4,
  },
  options: {
    gap: 12,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  iconWell: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  goalInfo: {
    flex: 1,
    gap: 3,
  },
  goalTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  goalDetail: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  checkWell: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.auroraTealSoft,
  },
});