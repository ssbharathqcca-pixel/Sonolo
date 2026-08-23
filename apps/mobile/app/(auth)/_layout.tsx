/**
 * Auth stack: Login first, Register slides in from the right.
 */

import { Stack } from "expo-router";

import { colors } from "../../src/theme/colors";

export default function AuthLayout(): JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.nightSky },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen
        name="register"
        options={{ animation: "slide_from_right" }}
      />
    </Stack>
  );
}
