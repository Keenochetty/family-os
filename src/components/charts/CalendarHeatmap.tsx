import type { JSX } from "react";
import Svg, { Rect } from "react-native-svg";

import { ChartFrame } from "./ChartFrame";
import type { ChartBaseProps, HeatmapPoint } from "./chartTypes";
import { chartAccent } from "./chartUtils";

type CalendarHeatmapProps = ChartBaseProps & {
  data: HeatmapPoint[];
};

export function CalendarHeatmap({ data, realm = "mentalHealth", ...frameProps }: CalendarHeatmapProps): JSX.Element {
  const accent = chartAccent(realm);

  return (
    <ChartFrame {...frameProps} empty={data.length === 0} realm={realm}>
      <Svg height={132} viewBox="0 0 300 132" width="100%">
        {data.slice(0, 35).map((point, index) => {
          const row = Math.floor(index / 7);
          const col = index % 7;
          return <Rect fill={accent} height={24} key={point.id} opacity={0.14 + Math.min(point.value, 1) * 0.76} rx={7} width={34} x={col * 41 + 8} y={row * 26 + 2} />;
        })}
      </Svg>
    </ChartFrame>
  );
}
