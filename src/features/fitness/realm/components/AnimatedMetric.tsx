import { useEffect, type JSX } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { fitnessMotion } from "@/features/fitness/realm/motion/fitnessMotion";
import type { FitnessRealmTheme } from "@/features/fitness/realm/theme/fitnessRealmTheme";

type AnimatedMetricProps = {
  accent?: string;
  detail?: string;
  label: string;
  theme: FitnessRealmTheme;
  value: string;
};

export function AnimatedMetric({ accent, detail, label, theme, value }: AnimatedMetricProps): JSX.Element {
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = 0.35;
    translateY.value = 4;
    opacity.value = withTiming(1, { duration: fitnessMotion.duration.standard });
    translateY.value = withTiming(0, { duration: fitnessMotion.duration.standard });
  }, [opacity, translateY, value]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={[styles.metric, { backgroundColor: theme.surface1, borderColor: theme.line }]}>
      <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
      <Animated.Text style={[styles.value, { color: accent ?? theme.text }, animatedStyle]}>{value}</Animated.Text>
      {detail ? <Text style={[styles.detail, { color: theme.textMuted }]}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  detail: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16,
  },
  metric: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    minHeight: 112,
    padding: 16,
  },
  value: {
    fontSize: 30,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    letterSpacing: -0.8,
    lineHeight: 36,
    marginTop: 8,
  },
});
