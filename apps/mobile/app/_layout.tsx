/**
 * Sonolo root layout: theme providers plus auth gating.
 *
 * The auth store hydrates from the device keychain once on mount; a
 * splash screen holds the fort until it finishes (no flicker). Once
 * hydrated, unauthenticated users see only the (auth) stack, and
 * authenticated users see only the app — session and feedback screens
 * included, so deep links can't bypass the gate.
 */

import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAuthStore } from "../src/stores/authStore";
import { colors } from "../src/theme/colors";
import { ThemeProvider } from "../src/theme/ThemeProvider";

function SplashScreen(): JSX.Element {
  return (
    <View style={styles.splash}>
      <Text style={styles.splashWordmark}>Sonolo</Text>
      <ActivityIndicator color={colors.auroraTeal} size="large" />
    </View>
  );
}

export default function RootLayout(): JSX.Element {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <SplashScreen />
      </SafeAreaProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {isAuthenticated ? (
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.nightSky },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="session/[id]"
              options={{ animation: "slide_from_bottom" }}
            />
            <Stack.Screen
              name="feedback/[id]"
              options={{ animation: "slide_from_bottom" }}
            />
          </Stack>
        ) : (
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.nightSky },
            }}
          >
            <Stack.Screen name="(auth)" />
          </Stack>
        )}
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.nightSky,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  splashWordmark: {
    color: colors.textPrimary,
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
