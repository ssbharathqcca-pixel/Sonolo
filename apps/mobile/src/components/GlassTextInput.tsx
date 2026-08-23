/**
 * Glassmorphic text input with a Reanimated focus effect: the border and
 * label glow to Aurora Teal while focused.
 */

import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors } from "../theme/colors";

interface GlassTextInputProps extends TextInputProps {
  label: string;
}

export function GlassTextInput({
  label,
  style,
  onFocus,
  onBlur,
  ...rest
}: GlassTextInputProps): JSX.Element {
  const focus = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [colors.glassBorder, colors.auroraTeal],
    ),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      focus.value,
      [0, 1],
      [colors.textTertiary, colors.auroraTeal],
    ),
  }));

  return (
    <Animated.View style={styles.wrapper}>
      <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
      <Animated.View style={[styles.field, containerStyle]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textTertiary}
          onFocus={(event) => {
            focus.value = withTiming(1, { duration: 150 });
            onFocus?.(event);
          }}
          onBlur={(event) => {
            focus.value = withTiming(0, { duration: 250 });
            onBlur?.(event);
          }}
          {...rest}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  field: {
    backgroundColor: colors.glass,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 16,
    paddingVertical: 14,
  },
});
