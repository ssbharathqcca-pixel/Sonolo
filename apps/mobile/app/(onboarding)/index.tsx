/**
 * Onboarding step 1 — primary language (SN-040).
 *
 * Two large glass cards pick the content language. The choice persists
 * to the backend via authStore.setPreferredLanguage (SN-020) so the
 * catalog, quests, and the recommended pack follow it; only then does
 * the flow advance to the goal step. A failed save keeps the user on
 * the screen with the backend's message so the preference can't be
 * silently lost.
 */

import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check } from "lucide-react-native";

import { GlassCard } from "../../src/components/GlassCard";
import type { PreferredLanguage } from "../../src/api/client";
import { useAuthStore } from "../../src/stores/authStore";
import { colors } from "../../src/theme/colors";

const LANGUAGES: Array<{
  id: PreferredLanguage;
  label: string;
  detail: string;
}> = [
  {
    id: "en",
    label: "English",
    detail: "Workplace, housing, and everyday life in English.",
  },
  {
    id: "fr",
    label: "Français",
    detail: "Le travail, le logement et la vie quotidienne en français.",
  },
];

export default function LanguageScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setPreferredLanguage = useAuthStore(
    (state) => state.setPreferredLanguage,
  );
  const setPendingPreferredLanguage = useAuthStore(
    (state) => state.setPendingPreferredLanguage,
  );
  const [saving, setSaving] = useState<PreferredLanguage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const choose = async (language: PreferredLanguage): Promise<void> => {
    if (saving !== null) {
      return;
    }
    setSaving(language);
    setError(null);

    if (!isAuthenticated) {
      // Unauthenticated: ZERO authenticated calls. Persist choice locally and navigate unconditionally.
      try {
        await setPendingPreferredLanguage(language);
      } catch {
        // Non-fatal
      }
      router.push("/(auth)/register");
      return;
    }

    try {
      await setPreferredLanguage(language);
      router.push("./goal");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Couldn't save your language — try again.",
      );
      setSaving(null);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.headline}>Welcome to Sonolo.</Text>
      <Text style={styles.subheadline}>
        Sound like you belong. Choose your primary language.
      </Text>

      <View style={styles.options}>
        {LANGUAGES.map((language) => {
          const busy = saving === language.id;
          return (
            <Pressable
              key={language.id}
              accessibilityLabel={`Choose ${language.label}`}
              accessibilityState={{ busy, disabled: saving !== null }}
              disabled={saving !== null}
              onPress={() => {
                void choose(language.id);
              }}
              style={({ pressed }) => [
                pressed && styles.cardPressed,
              ]}
            >
              <GlassCard style={styles.languageCard}>
                <View style={styles.iconWell}>
                  <Ionicons name="globe-outline" size={28} color="#FFFFFF" />
                </View>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageTitle}>{language.label}</Text>
                  <Text style={styles.languageDetail}>{language.detail}</Text>
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

      {error !== null ? <Text style={styles.errorText}>{error}</Text> : null}
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
  options: {
    gap: 14,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  languageCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
  },
  iconWell: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  languageInfo: {
    flex: 1,
    gap: 3,
  },
  languageTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  languageDetail: {
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
  errorText: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 4,
  },
});
