/**
 * Sonolo root layout: theme provider, safe-area plumbing, and the root
 * stack. Session and feedback screens present as slides from the bottom.
 */
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../src/theme/colors";
import { ThemeProvider } from "../src/theme/ThemeProvider";

export default function RootLayout(): JSX.Element {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StatusBar style="light" />
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
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
