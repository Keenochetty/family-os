import { useEffect, type JSX, type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";

import { attentionRules, fitnessMotion } from "@/features/fitness/realm/motion/fitnessMotion";
import { useFitnessAttention } from "@/features/fitness/realm/motion/FitnessAttentionProvider";
import { useReducedFitnessMotion } from "@/features/fitness/realm/motion/useReducedFitnessMotion";
import type { AttentionReason } from "@/features/fitness/realm/types";

type AttentionCueProps = {
  children: ReactNode;
  colour: string;
  enabled: boolean;
  id: string;
  reason: AttentionReason;
  style?: StyleProp<ViewStyle>;
};

export function AttentionCue({ children, colour, enabled, id, reason, style }: AttentionCueProps): JSX.Element {
  const scale = useSharedValue(1);
  const haloScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0);
  const reducedMotion = useReducedFitnessMotion();
  const attention = useFitnessAttention();
  const { activeId, clear, request } = attention;
  const isActive = enabled && activeId === id;

  useEffect(() => {
    if (enabled) {
      request(id, reason);
    }
  }, [enabled, id, reason, request]);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    if (reducedMotion) {
      haloOpacity.value = withSequence(
        withTiming(0.12, { duration: fitnessMotion.duration.micro }),
        withTiming(0, { duration: fitnessMotion.duration.micro }),
      );

      const timeout = setTimeout(() => clear(id), 460);
      return () => clearTimeout(timeout);
    }

    scale.value = withDelay(
      attentionRules.firstCueDelayMs,
      withRepeat(
        withSequence(
          withTiming(attentionRules.pulseScale, { duration: fitnessMotion.duration.micro, easing: fitnessMotion.easing.enter }),
          withTiming(1, { duration: fitnessMotion.duration.standard, easing: fitnessMotion.easing.standard }),
        ),
        attentionRules.maxPulses,
        false,
      ),
    );
    haloScale.value = withDelay(
      attentionRules.firstCueDelayMs,
      withRepeat(
        withSequence(withTiming(attentionRules.haloScale, { duration: fitnessMotion.duration.standard }), withTiming(1, { duration: fitnessMotion.duration.micro })),
        attentionRules.maxPulses,
        false,
      ),
    );
    haloOpacity.value = withDelay(
      attentionRules.firstCueDelayMs,
      withRepeat(
        withSequence(withTiming(attentionRules.haloOpacity, { duration: fitnessMotion.duration.micro }), withTiming(0, { duration: fitnessMotion.duration.standard })),
        attentionRules.maxPulses,
        false,
      ),
    );

    const timeout = setTimeout(() => clear(id), 1300);

    return () => {
      clearTimeout(timeout);
      cancelAnimation(scale);
      cancelAnimation(haloScale);
      cancelAnimation(haloOpacity);
    };
  }, [clear, haloOpacity, haloScale, id, isActive, reducedMotion, scale]);

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const haloStyle = useAnimatedStyle(() => ({
    opacity: haloOpacity.value,
    transform: [{ scale: haloScale.value }],
  }));

  return (
    <View style={[styles.wrapper, style]}>
      <Animated.View pointerEvents="none" style={[styles.halo, { backgroundColor: colour, borderColor: colour }, haloStyle]} />
      <Animated.View style={contentStyle}>{children}</Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  halo: {
    backgroundColor: "transparent",
    borderRadius: 20,
    borderWidth: 1,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  wrapper: {
    position: "relative",
  },
});
