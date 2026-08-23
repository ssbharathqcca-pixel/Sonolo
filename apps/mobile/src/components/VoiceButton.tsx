/**
 * The central Sonolo voice control.
 *
 * A 72px glass circle with four states — IDLE, LISTENING, THINKING, and
 * SPEAKING — driven by React Native Reanimated for scale pulses and
 * animated glow halos. No audio is captured yet; the parent screen owns
 * the state machine and passes it down.
 */
import { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type AccessibilityProps,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Mic, Sparkles, Volume2 } from "lucide-react-native";
import { colors } from "../theme/colors";

export type VoiceButtonState = "idle" | "listening" | "thinking" | "speaking";

interface StateVisual {
  backgroundColor: string;
  borderColor: string;
  iconColor: string;
  glowColor: string;
  icon: typeof Mic;
  a11yLabel: string;
}

const STATE_VISUALS: Record<VoiceButtonState, StateVisual> = {
  idle: {
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    iconColor: colors.textPrimary,
    glowColor: colors.glowTeal,
    icon: Mic,
    a11yLabel: "Start speaking",
  },
  listening: {
    backgroundColor: colors.warmCoral,
    borderColor: "rgba(249, 115, 22, 0.65)",
    iconColor: "#FFFFFF",
    glowColor: colors.glowCoral,
    icon: Mic,
    a11yLabel: "Listening. Tap to continue.",
  },
  thinking: {
    backgroundColor: colors.glass,
    borderColor: "rgba(14, 165, 233, 0.55)",
    iconColor: colors.auroraTeal,
    glowColor: colors.glowTeal,
    icon: Sparkles,
    a11yLabel: "Sonolo is thinking",
  },
  speaking: {
    backgroundColor: colors.auroraTeal,
    borderColor: "rgba(14, 165, 233, 0.65)",
    iconColor: "#FFFFFF",
    glowColor: colors.glowTeal,
    icon: Volume2,
    a11yLabel: "Sonolo is speaking",
  },
};

const STATE_CAPTIONS: Record<VoiceButtonState, string> = {
  idle: "Tap to speak",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking…",
};

export function voiceButtonCaption(state: VoiceButtonState): string {
  return STATE_CAPTIONS[state];
}

export interface VoiceButtonProps extends AccessibilityProps {
  state: VoiceButtonState;
  onPress: () => void;
  /** Diameter of the button in pixels. Defaults to 72. */
  size?: number;
}

const PULSE = Easing.inOut(Easing.quad);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function VoiceButton({
  state,
  onPress,
  size = 72,
}: VoiceButtonProps): JSX.Element {
  const visual = STATE_VISUALS[state];
  const Icon = visual.icon;

  const stateScale = useSharedValue(1);
  const pressScale = useSharedValue(1);
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const iconRotation = useSharedValue(0);

  useEffect(() => {
    switch (state) {
      case "idle": {
        stateScale.value = withTiming(1, { duration: 220 });
        glowScale.value = withTiming(1.15, { duration: 220 });
        glowOpacity.value = withTiming(0.12, { duration: 220 });
        iconRotation.value = withTiming(0, { duration: 220 });
        break;
      }
      case "listening": {
        stateScale.value = withRepeat(
          withSequence(
            withTiming(1.07, { duration: 620, easing: PULSE }),
            withTiming(1, { duration: 620, easing: PULSE }),
          ),
          -1,
        );
        glowOpacity.value = withRepeat(
          withSequence(
            withTiming(0.55, { duration: 700 }),
            withTiming(0.2, { duration: 700 }),
          ),
          -1,
        );
        glowScale.value = withRepeat(
          withSequence(
            withTiming(1.9, { duration: 1300, easing: Easing.out(Easing.quad) }),
            withTiming(1, { duration: 0 }),
          ),
          -1,
        );
        break;
      }
      case "thinking": {
        stateScale.value = withRepeat(
          withSequence(
            withTiming(1.04, { duration: 900, easing: PULSE }),
            withTiming(1, { duration: 900, easing: PULSE }),
          ),
          -1,
        );
        glowOpacity.value = withTiming(0.35, { duration: 300 });
        glowScale.value = withRepeat(
          withTiming(1.6, { duration: 1000, easing: Easing.out(Easing.quad) }),
          -1,
          true,
        );
        iconRotation.value = withRepeat(
          withTiming(360, { duration: 1800, easing: Easing.linear }),
          -1,
        );
        break;
      }
      case "speaking": {
        stateScale.value = withRepeat(
          withSequence(
            withTiming(1.05, { duration: 380, easing: PULSE }),
            withTiming(1, { duration: 380, easing: PULSE }),
          ),
          -1,
        );
        glowOpacity.value = withRepeat(
          withSequence(
            withTiming(0.5, { duration: 450 }),
            withTiming(0.25, { duration: 450 }),
          ),
          -1,
        );
        glowScale.value = withTiming(1.7, { duration: 300 });
        iconRotation.value = withTiming(0, { duration: 200 });
        break;
      }
    }
    return () => {
      cancelAnimation(stateScale);
      cancelAnimation(pressScale);
      cancelAnimation(glowScale);
      cancelAnimation(glowOpacity);
      cancelAnimation(iconRotation);
    };
  }, [state, stateScale, pressScale, glowScale, glowOpacity, iconRotation]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: stateScale.value * pressScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  const halo = size * 1.15;

  return (
    <View
      style={{ width: halo, height: halo, alignItems: "center", justifyContent: "center" }}
    >
      <Animated.View
        style={[
          styles.glow,
          glowStyle,
          {
            width: halo,
            height: halo,
            borderRadius: halo / 2,
            backgroundColor: visual.glowColor,
          },
        ]}
      />
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={visual.a11yLabel}
        onPress={onPress}
        onPressIn={() => {
          pressScale.value = withTiming(0.93, { duration: 90 });
        }}
        onPressOut={() => {
          pressScale.value = withTiming(1, { duration: 140 });
        }}
        style={[
          styles.button,
          buttonStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: visual.backgroundColor,
            borderColor: visual.borderColor,
          },
        ]}
      >
        <Animated.View style={iconStyle}>
          <Icon color={visual.iconColor} size={Math.round(size * 0.42)} />
        </Animated.View>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: "absolute",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
