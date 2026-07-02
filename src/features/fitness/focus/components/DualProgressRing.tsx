import { useEffect, useMemo, type JSX } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Canvas, Path } from "@shopify/react-native-skia";
import { useSharedValue, withTiming } from "react-native-reanimated";

import type { WorkoutPhase } from "@/features/fitness/focus/types";
import { fitnessFocusMotion, type FitnessFocusTheme } from "@/features/fitness/focus/theme/fitnessFocusTheme";

type DualProgressRingProps = {
  phase: WorkoutPhase;
  phaseProgress: number;
  primaryText: string;
  secondaryText?: string;
  size?: number;
  tertiaryText?: string;
  theme: FitnessFocusTheme;
  workoutProgress: number;
};

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function polar(cx: number, cy: number, radius: number, angle: number): { x: number; y: number } {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function arcPath(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polar(cx, cy, radius, endAngle);
  const end = polar(cx, cy, radius, startAngle);
  const sweep = endAngle - startAngle;
  const largeArc = sweep <= 180 ? 0 : 1;

  return [`M ${start.x} ${start.y}`, `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`].join(" ");
}

function phaseColor(phase: WorkoutPhase, theme: FitnessFocusTheme): string {
  if (phase === "resting") {
    return theme.rest;
  }

  if (phase === "preparing") {
    return theme.achievement;
  }

  if (phase === "workout-complete" || phase === "exercise-complete") {
    return theme.success;
  }

  if (phase === "pain-reported" || phase === "caution") {
    return theme.danger;
  }

  if (phase === "paused") {
    return theme.textMuted;
  }

  return theme.accent;
}

function phaseLabel(phase: WorkoutPhase): string {
  if (phase === "resting") {
    return "REST";
  }

  if (phase === "paused") {
    return "PAUSED";
  }

  if (phase === "workout-complete") {
    return "DONE";
  }

  if (phase === "pain-reported") {
    return "REVIEW";
  }

  return "WORK";
}

export function DualProgressRing({
  phase,
  phaseProgress,
  primaryText,
  secondaryText,
  size = 300,
  tertiaryText,
  theme,
  workoutProgress,
}: DualProgressRingProps): JSX.Element {
  const outer = useSharedValue(0);
  const inner = useSharedValue(0);
  const phaseTone = phaseColor(phase, theme);

  useEffect(() => {
    outer.value = withTiming(clamp(workoutProgress), { duration: fitnessFocusMotion.mode });
  }, [outer, workoutProgress]);

  useEffect(() => {
    inner.value = withTiming(clamp(phaseProgress), { duration: fitnessFocusMotion.quick });
  }, [inner, phaseProgress]);

  const geometry = useMemo(() => {
    const center = size / 2;

    return {
      innerTrack: arcPath(center, center, size * 0.285, -140, 140),
      outerTrack: arcPath(center, center, size * 0.39, -140, 140),
    };
  }, [size]);

  return (
    <View
      accessibilityLabel={`${primaryText}. Workout ${Math.round(clamp(workoutProgress) * 100)} percent complete.`}
      accessibilityRole="progressbar"
      accessibilityValue={{ max: 100, min: 0, now: Math.round(clamp(workoutProgress) * 100) }}
      style={{ height: size, width: size }}
    >
      <Canvas style={StyleSheet.absoluteFill}>
        <Path color={theme.ringTrack} path={geometry.outerTrack} strokeCap="round" strokeWidth={18} style="stroke" />
        <Path color={theme.accent} end={outer} path={geometry.outerTrack} strokeCap="round" strokeWidth={18} style="stroke" />
        <Path color={theme.ringTrack} path={geometry.innerTrack} strokeCap="round" strokeWidth={7} style="stroke" />
        <Path color={phaseTone} end={inner} path={geometry.innerTrack} strokeCap="round" strokeWidth={7} style="stroke" />
      </Canvas>
      <View pointerEvents="none" style={styles.center}>
        <Text style={[styles.phase, { color: phaseTone }]}>{phaseLabel(phase)}</Text>
        <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.primary, { color: theme.text }]}>
          {primaryText}
        </Text>
        {secondaryText ? <Text style={[styles.secondary, { color: theme.textMuted }]}>{secondaryText}</Text> : null}
        {tertiaryText ? <Text style={[styles.tertiary, { color: theme.text }]}>{tertiaryText}</Text> : null}
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
    paddingHorizontal: 58,
    position: "absolute",
    right: 0,
    top: 0,
  },
  phase: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.7,
    lineHeight: 16,
  },
  primary: {
    fontSize: 48,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    letterSpacing: -1.4,
    lineHeight: 54,
    marginTop: 6,
    textAlign: "center",
  },
  secondary: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 2,
    textAlign: "center",
  },
  tertiary: {
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 17,
    marginTop: 4,
    textAlign: "center",
  },
});
