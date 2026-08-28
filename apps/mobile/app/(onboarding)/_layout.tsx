/**
 * Onboarding stack (SN-040): language → goal → ready. Shown instead of
 * the tabs until a new user has picked a primary language and a goal;
 * the card-forward transitions keep the flow feeling like one surface.
 */

import { Stack } from "expo-router";

import { colors } from "../../src/theme/colors";

export default function OnboardingLayout(): JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.nightSky },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="ready" />
    </Stack>
  );
}
