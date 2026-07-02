import type { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

import { useHealthOSTheme } from "@/components/ui/theme";
import { spacing, typography } from "@/theme";

import { ChartFrame } from "./ChartFrame";
import type { ChartBaseProps, TimelinePoint } from "./chartTypes";
import { chartAccent } from "./chartUtils";

type TimelineChartProps = ChartBaseProps & {
  data: TimelinePoint[];
};

export function TimelineChart({ data, realm = "pregnancy", ...frameProps }: TimelineChartProps): JSX.Element {
  const theme = useHealthOSTheme();
  const accent = chartAccent(realm);

  return (
    <ChartFrame {...frameProps} empty={data.length === 0} realm={realm}>
      <View style={styles.timeline}>
        <Svg height={42} viewBox="0 0 300 42" width="100%">
          <Line stroke={theme.colors.borderStrong} strokeLinecap="round" strokeWidth={4} x1={20} x2={280} y1={21} y2={21} />
          {data.map((point, index) => {
            const x = 20 + (index / Math.max(data.length - 1, 1)) * 260;
            return <Circle cx={x} cy={21} fill={accent} key={point.id} r={7} />;
          })}
        </Svg>
        {data.map((point) => (
          <View key={point.id} style={styles.timelineRow}>
            <Text style={[styles.timelineTitle, { color: theme.colors.textPrimary }]}>{point.title}</Text>
            {point.description ? <Text style={[styles.timelineText, { color: theme.colors.textSecondary }]}>{point.description}</Text> : null}
          </View>
        ))}
      </View>
    </ChartFrame>
  );
}

const styles = StyleSheet.create({
  timeline: {
    gap: spacing.sm,
  },
  timelineRow: {
    gap: spacing.xs,
  },
  timelineText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  timelineTitle: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
});
