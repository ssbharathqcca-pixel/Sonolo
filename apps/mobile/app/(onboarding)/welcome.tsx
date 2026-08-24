/**
 * Onboarding step 1 — brand introduction (SN-017).
 *
 * Three value rows, one tap to continue. Copy stays inside the legal
 * redlines: CLB is referenced only as "CLB-inspired" coaching levels,
 * with no claims of affiliation with IELTS, CELPIP, TEF, TCF, or IRCC.
 */

import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowRight, Mic, Target, TrendingUp } from "lucide-react-native";

import { GlassCard } from "../../src/components/GlassCard";
import { colors } from "../../src/theme/colors";

const VALUE_PROPS = [
  {
    icon: Mic,
    title: "Speak real scenarios",
    detail:
      "Coffee runs, appointments, stand-ups — practice out loud in two-minute sessions.",
  },
  {
    icon: TrendingUp,
    title: "See yourself improve",
    detail:
      "Every session updates your six skill scores and CanadaReady™ composite.",
  },
  {
    icon: Target,
    title: "Aim at your goal",
    detail:
      "Set a CLB-inspired target and Sonolo builds daily quests around it.",
  },
];

export default function WelcomeScreen(): JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.wordmark}>Sonolo</Text>
      <Text style={styles.tagline}>Sound like you belong.</Text>

      <View style={styles.props}>
        {VALUE_PROPS.map((prop) => {
          const Icon = prop.icon;
          return (
            <GlassCard key={prop.title} style={styles.propCard}>
              <View style={styles.iconWell}>
                <Icon color={colors.auroraTeal} size={20} />
              </View>
              <View style={styles.propInfo}>
                <Text style={styles.propTitle}>{prop.title}</Text>
                <Text style={styles.propDetail}>{prop.detail}</Text>
              </View>
            </GlassCard>
          );
        })}
      </View>

      <Pressable
        style={styles.cta}
        accessibilityLabel="Get started with onboarding"
        onPress={() => {
          router.push("./goals");
        }}
      >
        <Text style={styles.ctaText}>Get started</Text>
        <ArrowRight color="#FFFFFF" size={18} />
      </Pressable>

      <Text style={styles.finePrint}>
        Coaching levels are CLB-inspired and for practice only — Sonolo is not
        affiliated with any testing body or government program.
      </Text>
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
  wordmark: {
    color: colors.textPrimary,
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: 1,
    textAlign: "center",
  },
  tagline: {
    color: colors.auroraTeal,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  props: {
    gap: 12,
  },
  propCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  iconWell: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.auroraTealSoft,
  },
  propInfo: {
    flex: 1,
    gap: 2,
  },
  propTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  propDetail: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.auroraTeal,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  finePrint: {
    color: colors.textTertiary,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});
