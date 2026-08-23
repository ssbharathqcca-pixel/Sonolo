/**
 * Register screen: glass card signup form with language chip pickers,
 * client-side validation matching the backend rules, and gentle errors.
 */

import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import { GlassCard } from "../../src/components/GlassCard";
import { GlassTextInput } from "../../src/components/GlassTextInput";
import { useAuthStore } from "../../src/stores/authStore";
import { colors } from "../../src/theme/colors";

const NATIVE_LANGUAGES: { code: string; label: string }[] = [
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "hi", label: "हिन्दी" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
];

const TARGET_LANGUAGES: { code: string; label: string }[] = [
  { code: "en-CA", label: "Canadian English" },
  { code: "fr-CA", label: "Canadian French" },
];

interface LanguageChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function LanguageChip({
  label,
  selected,
  onPress,
}: LanguageChipProps): JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.chipPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function RegisterScreen(): JSX.Element {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("hi");
  const [targetLanguage, setTargetLanguage] = useState("en-CA");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (): Promise<void> => {
    setError(null);
    if (name.trim() === "") {
      setError("Please tell us your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("That email doesn't look right.");
      return;
    }
    if (password.length < 8) {
      setError("Password needs at least 8 characters.");
      return;
    }
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        native_language: nativeLanguage,
        target_language: targetLanguage,
      });
      router.replace("/(tabs)");
    } catch (registerError) {
      setError(
        registerError instanceof Error
          ? registerError.message
          : "Couldn't create your account. Please try again.",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Create your account</Text>
        <Text style={styles.subheading}>
          Two minutes to your first conversation.
        </Text>

        <Animated.View entering={FadeInDown.springify().damping(18)}>
          <GlassCard style={styles.card}>
            <GlassTextInput
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoCapitalize="words"
              autoCorrect={false}
              textContentType="name"
            />
            <GlassTextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
            />
            <GlassTextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
            />

            <View style={styles.pickerBlock}>
              <Text style={styles.pickerLabel}>I speak</Text>
              <View style={styles.chipRow}>
                {NATIVE_LANGUAGES.map((language) => (
                  <LanguageChip
                    key={language.code}
                    label={language.label}
                    selected={nativeLanguage === language.code}
                    onPress={() => {
                      setNativeLanguage(language.code);
                    }}
                  />
                ))}
              </View>
            </View>

            <View style={styles.pickerBlock}>
              <Text style={styles.pickerLabel}>I want to learn</Text>
              <View style={styles.chipRow}>
                {TARGET_LANGUAGES.map((language) => (
                  <LanguageChip
                    key={language.code}
                    label={language.label}
                    selected={targetLanguage === language.code}
                    onPress={() => {
                      setTargetLanguage(language.code);
                    }}
                  />
                ))}
              </View>
            </View>

            {error !== null ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={() => {
                void handleRegister();
              }}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Create account"
              accessibilityState={{ disabled: isLoading, busy: isLoading }}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Create account</Text>
              )}
            </Pressable>
          </GlassCard>
        </Animated.View>

        <Pressable
          onPress={() => {
            router.back();
          }}
          accessibilityRole="link"
          accessibilityLabel="Go back to login"
        >
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLink}>Log in</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.nightSky,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 16,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  subheading: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
  },
  card: {
    gap: 16,
  },
  pickerBlock: {
    gap: 8,
  },
  pickerLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.nightSkyDeep,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: {
    borderColor: colors.auroraTeal,
    backgroundColor: colors.auroraTealSoft,
  },
  chipPressed: {
    opacity: 0.8,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: colors.auroraTeal,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: colors.auroraTeal,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
  footerLink: {
    color: colors.auroraTeal,
    fontWeight: "700",
  },
});
