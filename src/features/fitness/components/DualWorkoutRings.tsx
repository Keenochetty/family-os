import { useEffect, type JSX } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";

import type { FitnessTheme } from "@/features/fitness/theme/fitnessTheme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type DualWorkoutRingsProps = {
  centerLabel: string;
  centerValue: string;
  innerLabel: string;
  innerProgress: number;
  outerLabel: string;
  outerProgress: number;
  size: number;
  theme: FitnessTheme;
};

function clampProgress(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function DualWorkoutRings({
  centerLabel,
  centerValue,
  innerLabel,
  innerProgress,
  outerLabel,
  outerProgress,
  size,
  theme,
}: DualWorkoutRingsProps): JSX.Element {
  const outer = useSharedValue(clampProgress(outerProgress));
  const inner = useSharedValue(clampProgress(innerProgress));
  const outerRadius = size / 2 - 10;
  const innerRadius = size / 2 - 25;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const innerCircumference = 2 * Math.PI * innerRadius;

  useEffect(() => {
    outer.value = withTiming(clampProgress(outerProgress), { duration: 260 });
  }, [outer, outerProgress]);

  useEffect(() => {
    inner.value = withTiming(clampProgress(innerProgress), { duration: 260 });
  }, [inner, innerProgress]);

  const outerAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: outerCircumference * (1 - outer.value),
  }));

  const innerAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: innerCircumference * (1 - inner.value),
  }));

  return (
    <View style={[styles.wrap, { height: size, width: size }]}>
      <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={outerRadius}
            stroke={theme.surface3}
            strokeWidth={10}
          />
          <AnimatedCircle
            animatedProps={outerAnimatedProps}
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={outerRadius}
            stroke={theme.accentStrong}
            strokeDasharray={outerCircumference}
            strokeLinecap="round"
            strokeWidth={10}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={innerRadius}
            stroke={theme.surface3}
            strokeWidth={8}
          />
          <AnimatedCircle
            animatedProps={innerAnimatedProps}
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={innerRadius}
            stroke={theme.info}
            strokeDasharray={innerCircumference}
            strokeLinecap="round"
            strokeWidth={8}
          />
        </G>
      </Svg>
      <View pointerEvents="none" style={styles.center}>
        <Text style={[styles.centerValue, { color: theme.text }]}>{centerValue}</Text>
        <Text style={[styles.centerLabel, { color: theme.textMuted }]}>{centerLabel}</Text>
      </View>
      <View style={styles.legend}>
        <Text numberOfLines={1} style={[styles.legendText, { color: theme.accentStrong }]}>
          {outerLabel}
        </Text>
        <Text numberOfLines={1} style={[styles.legendText, { color: theme.info }]}>
          {innerLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  centerLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 14,
  },
  centerValue: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.8,
    lineHeight: 35,
  },
  legend: {
    bottom: 11,
    left: 0,
    position: "absolute",
    right: 0,
  },
  legendText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 12,
    textAlign: "center",
  },
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});
