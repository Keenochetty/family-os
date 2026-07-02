import type { JSX } from "react";
import Svg, { Circle, Line } from "react-native-svg";

import { ChartFrame } from "./ChartFrame";
import type { ChartBaseProps, RangePoint } from "./chartTypes";
import { chartAccent, extent, normalize } from "./chartUtils";

type RangeChartProps = ChartBaseProps & {
  data: RangePoint[];
};

export function RangeChart({ data, realm = "vitals", ...frameProps }: RangeChartProps): JSX.Element {
  const allValues = data.flatMap((point) => [point.low, point.high, point.value ?? point.low]);
  const { min, max } = extent(allValues);
  const accent = chartAccent(realm);
  const points = data.map((point, index) => {
    const x = 24 + (index / Math.max(data.length - 1, 1)) * 252;
    return {
      ...point,
      x,
      highY: 118 - normalize(point.high, min, max) * 92,
      lowY: 118 - normalize(point.low, min, max) * 92,
      valueY: 118 - normalize(point.value ?? point.low, min, max) * 92,
    };
  });

  return (
    <ChartFrame {...frameProps} empty={data.length === 0} realm={realm}>
      <Svg height={140} viewBox="0 0 300 140" width="100%">
        {points.map((point) => (
          <Svg key={point.id}>
            <Line stroke={accent} strokeLinecap="round" strokeWidth={8} x1={point.x} x2={point.x} y1={point.lowY} y2={point.highY} />
            <Circle cx={point.x} cy={point.valueY} fill="#FFFFFF" r={5} stroke={accent} strokeWidth={3} />
          </Svg>
        ))}
      </Svg>
    </ChartFrame>
  );
}
