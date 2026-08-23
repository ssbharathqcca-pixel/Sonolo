/**
 * Onboarding stack (SN-017): shown instead of the tabs until a new
 * user has picked a goal and confirmed microphone access.
 */

import { Stack } from "expo-router";

import { colors } from "../../src/theme/colors";

export default function OnboardingLayout(): JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.nightSky },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="mic-check" />
    </Stack>
  );
}
