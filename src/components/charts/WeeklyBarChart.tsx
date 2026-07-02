import type { JSX } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

import { ChartFrame } from "./ChartFrame";
import type { ChartBaseProps, ChartPoint } from "./chartTypes";
import { chartAccent, extent, normalize } from "./chartUtils";

type WeeklyBarChartProps = ChartBaseProps & {
  data: ChartPoint[];
};

export function WeeklyBarChart({ data, onLongPressPoint, realm = "fitness", ...frameProps }: WeeklyBarChartProps): JSX.Element {
  const values = data.map((point) => point.value);
  const { min, max } = extent(values);
  const accent = chartAccent(realm);
  const bars = data.map((point, index) => {
    const height = 10 + normalize(point.value, min, max) * 88;
    const x = 18 + index * 39;
    return { ...point, height, x, y: 118 - height };
  });

  return (
    <ChartFrame {...frameProps} empty={data.length === 0} realm={realm}>
      <View style={styles.chart}>
        <Svg height={140} viewBox="0 0 300 140" width="100%">
          {bars.map((bar) => (
            <Rect key={bar.id} fill={accent} height={bar.height} opacity={0.82} rx={8} width={22} x={bar.x} y={bar.y} />
          ))}
        </Svg>
        <View style={StyleSheet.absoluteFill}>
          {bars.map((bar) => (
            <Pressable key={bar.id} onLongPress={() => onLongPressPoint?.(bar.id)} style={[styles.hitBar, { left: bar.x - 8 }]} />
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
  hitBar: {
    bottom: 0,
    position: "absolute",
    top: 0,
    width: 38,
  },
});
