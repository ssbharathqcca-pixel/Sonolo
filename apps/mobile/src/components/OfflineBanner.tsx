/**
 * Floating connectivity banner (SN-017).
 *
 * Mounted once in the root layout; fades in over whatever screen is
 * active while the API client reports network-level failures and fades
 * out on the first successful response. Non-interactive so it never
 * steals touches from the UI underneath.
 */

import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { WifiOff } from "lucide-react-native";

import { useNetworkStore } from "../stores/networkStore";
import { colors } from "../theme/colors";

export const OFFLINE_BANNER_MESSAGE =
  "You are offline. Progress will sync when reconnected";

export function OfflineBanner(): JSX.Element {
  const isOffline = useNetworkStore((state) => state.isOffline);
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(isOffline ? 1 : 0, { duration: 220 });
  }, [isOffline, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: (1 - opacity.value) * -8 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={[
        styles.banner,
        { bottom: insets.bottom + 16 },
        style,
      ]}
    >
      <WifiOff color={colors.warmCoral} size={16} />
      <Text style={styles.text}>{OFFLINE_BANNER_MESSAGE}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  text: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 17,
  },
});
