import type { JSX } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle, Polyline } from "react-native-svg";

import { useHealthOSTheme } from "@/components/ui/theme";

import { ChartFrame } from "./ChartFrame";
import type { ChartBaseProps, ChartPoint } from "./chartTypes";
import { chartAccent, extent, normalize } from "./chartUtils";

type TrendLineChartProps = ChartBaseProps & {
  data: ChartPoint[];
};

export function TrendLineChart({ data, onLongPressPoint, realm = "vitals", ...frameProps }: TrendLineChartProps): JSX.Element {
  const theme = useHealthOSTheme();
  const values = data.map((point) => point.value);
  const { min, max } = extent(values);
  const accent = chartAccent(realm);
  const points = data.map((point, index) => {
    const x = 16 + (index / Math.max(data.length - 1, 1)) * 268;
    const y = 116 - normalize(point.value, min, max) * 88;
    return { ...point, x, y };
  });

  return (
    <ChartFrame {...frameProps} empty={data.length === 0} realm={realm}>
      <View style={styles.chart}>
        <Svg height={140} viewBox="0 0 300 140" width="100%">
          <Polyline fill="none" points={points.map((point) => `${point.x},${point.y}`).join(" ")} stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} />
          {points.map((point) => (
            <Circle key={point.id} cx={point.x} cy={point.y} fill={theme.colors.surface} r={6} stroke={accent} strokeWidth={3} />
          ))}
        </Svg>
        <View style={StyleSheet.absoluteFill}>
          {points.map((point) => (
            <Pressable
              accessibilityLabel={`${point.label}: ${point.value}${frameProps.unit ?? ""}`}
              key={point.id}
              onLongPress={() => onLongPressPoint?.(point.id)}
              style={[styles.hitPoint, { left: `${(point.x / 300) * 100}%`, top: point.y - 14 }]}
            />
          ))}
        </View>
      </View>
    </ChartFrame>
  );
}

const styles = StyleSheet.create({
  chart: {
    minHeight: 140,
    position: "relative",
  },
  hitPoint: {
    height: 28,
    marginLeft: -14,
    position: "absolute",
    width: 28,
  },
});
