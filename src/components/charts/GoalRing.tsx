import type { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useHealthOSTheme } from "@/components/ui/theme";
import { typography } from "@/theme";

import { ChartFrame } from "./ChartFrame";
import type { ChartBaseProps } from "./chartTypes";
import { chartAccent } from "./chartUtils";

type GoalRingProps = ChartBaseProps & {
  goal: number;
  value: number;
};

export function GoalRing({ goal, realm = "hydration", value, ...frameProps }: GoalRingProps): JSX.Element {
  const theme = useHealthOSTheme();
  const accent = chartAccent(realm);
  const progress = Math.max(0, Math.min(1, value / Math.max(goal, 1)));
  const circumference = 2 * Math.PI * 48;

  return (
    <ChartFrame {...frameProps} realm={realm}>
      <View style={styles.ringWrap}>
        <Svg height={128} viewBox="0 0 128 128" width={128}>
          <Circle cx={64} cy={64} fill="none" r={48} stroke={theme.colors.surfaceAlt} strokeWidth={14} />
          <Circle
            cx={64}
            cy={64}
            fill="none"
            r={48}
            stroke={accent}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            strokeWidth={14}
            transform="rotate(-90 64 64)"
          />
        </Svg>
        <View style={styles.ringCenter}>
          <Text style={[styles.ringValue, { color: theme.colors.textPrimary }]}>{Math.round(progress * 100)}%</Text>
          <Text style={[styles.ringLabel, { color: theme.colors.textSecondary }]}>{value}/{goal}</Text>
        </View>
      </View>
    </ChartFrame>
  );
}

const styles = StyleSheet.create({
  ringCenter: {
    alignItems: "center",
    position: "absolute",
  },
  ringLabel: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  ringValue: {
    fontSize: typography.title2.fontSize,
    fontWeight: "800",
    lineHeight: typography.title2.lineHeight,
  },
  ringWrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 132,
  },
});
