/**
 * Login screen: glass card credentials form with gentle error states
 * and a loading indicator on the primary button.
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
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import { GlassCard } from "../../src/components/GlassCard";
import { GlassTextInput } from "../../src/components/GlassTextInput";
import { useAuthStore } from "../../src/stores/authStore";
import { colors } from "../../src/theme/colors";

export default function LoginScreen(): JSX.Element {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (): Promise<void> => {
    setError(null);
    if (email.trim() === "" || password === "") {
      setError("Please enter your email and password.");
      return;
    }
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Login failed. Please try again.",
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
        <Text style={styles.wordmark}>Sonolo</Text>
        <Text style={styles.tagline}>Speak Canadian English, confidently.</Text>

        <Animated.View entering={FadeInDown.springify().damping(18)}>
          <GlassCard style={styles.card}>
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
              placeholder="Your password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
            />

            {error !== null ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={() => {
                void handleLogin();
              }}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Log in"
              accessibilityState={{ disabled: isLoading, busy: isLoading }}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Log in</Text>
              )}
            </Pressable>
          </GlassCard>
        </Animated.View>

        <Pressable
          onPress={() => {
            router.push("/(auth)/register");
          }}
          accessibilityRole="link"
          accessibilityLabel="Create a new Sonolo account"
        >
          <Text style={styles.footerText}>
            New to Sonolo?{" "}
            <Text style={styles.footerLink}>Create an account</Text>
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
    gap: 20,
  },
  wordmark: {
    color: colors.textPrimary,
    fontSize: 40,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 8,
  },
  card: {
    gap: 16,
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
