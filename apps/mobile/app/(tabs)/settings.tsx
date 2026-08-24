/**
 * Settings — minimal authenticated settings screen (SN-020). Shows the
 * signed-in account and the content-language selector: picking English
 * or Français persists to the backend and refetches the scenario
 * catalog so Learn matches immediately.
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, Languages, UserRound } from "lucide-react-native";

import { GlassCard } from "../../src/components/GlassCard";
import {
  getApiErrorMessage,
  type PreferredLanguage,
} from "../../src/api/client";
import { useAuthStore } from "../../src/stores/authStore";
import { useScenarioStore } from "../../src/stores/scenarioStore";
import { colors } from "../../src/theme/colors";

const LANGUAGE_OPTIONS: Array<{
  value: PreferredLanguage;
  label: string;
  subtitle: string;
}> = [
  { value: "en", label: "English", subtitle: "Practice scenarios in English" },
  { value: "fr", label: "Français", subtitle: "Scénarios pratiques en français" },
];

export default function SettingsScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const setPreferredLanguage = useAuthStore(
    (state) => state.setPreferredLanguage,
  );
  const loadScenarios = useScenarioStore((state) => state.load);

  const [savingLanguage, setSavingLanguage] =
    useState<PreferredLanguage | null>(null);
  const [languageError, setLanguageError] = useState<string | null>(null);

  const currentLanguage = user?.preferred_language ?? "en";

  const handleSelect = async (language: PreferredLanguage): Promise<void> => {
    if (language === currentLanguage || savingLanguage !== null) {
      return;
    }
    setSavingLanguage(language);
    setLanguageError(null);
    try {
      await setPreferredLanguage(language);
      // Persisted — refresh the catalog so Learn switches right away.
      await loadScenarios(language);
    } catch (error) {
      setLanguageError(
        error instanceof Error
          ? error.message
          : getApiErrorMessage(error),
      );
    } finally {
      setSavingLanguage(null);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: 120 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Settings</Text>
      <Text style={styles.subheading}>
        Your account and the language you practice in.
      </Text>

      <GlassCard style={styles.sectionCard}>
        <View style={styles.accountRow}>
          <View style={styles.avatarWell}>
            <UserRound color={colors.auroraTeal} size={22} />
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{user?.name ?? "Learner"}</Text>
            <Text style={styles.accountEmail} numberOfLines={1}>
              {user?.email ?? ""}
            </Text>
          </View>
          <View style={styles.planChip}>
            <Text style={styles.planChipText}>
              {user?.subscription_tier === "premium" ? "Premium" : "Free"}
            </Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <View style={styles.languageHeader}>
          <View style={styles.iconWell}>
            <Languages color={colors.auroraTeal} size={18} />
          </View>
          <Text style={styles.languageTitle}>Practice language</Text>
        </View>
        <View style={styles.optionsGroup}>
          {LANGUAGE_OPTIONS.map((option) => {
            const isActive = option.value === currentLanguage;
            const isSaving = option.value === savingLanguage;
            return (
              <Pressable
                key={option.value}
                accessibilityLabel={`Practice language: ${option.label}`}
                accessibilityState={{ selected: isActive }}
                onPress={() => {
                  void handleSelect(option.value);
                }}
                style={[styles.optionRow, isActive && styles.optionRowActive]}
              >
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
                {isSaving ? (
                  <ActivityIndicator color={colors.auroraTeal} size="small" />
                ) : isActive ? (
                  <View style={styles.checkWell}>
                    <Check color={colors.auroraTeal} size={16} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
        {languageError ? (
          <Text style={styles.errorText}>{languageError}</Text>
        ) : null}
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
  sectionCard: {
    padding: 14,
    gap: 12,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWell: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.auroraTealSoft,
  },
  accountInfo: {
    flex: 1,
    gap: 2,
  },
  accountName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  accountEmail: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  planChip: {
    borderRadius: 999,
    backgroundColor: colors.glassHighlight,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  planChipText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  languageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWell: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.auroraTealSoft,
  },
  languageTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  optionsGroup: {
    gap: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  optionRowActive: {
    backgroundColor: colors.auroraTealSoft,
    borderColor: colors.auroraTeal,
  },
  optionInfo: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  optionSubtitle: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  checkWell: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.nightSkyDeep,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    lineHeight: 17,
  },
});
