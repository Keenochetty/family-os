import { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import {
  Canvas,
  Circle,
  Group,
  Line,
  LinearGradient,
  RoundedRect,
  vec,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import type { TrendPoint } from '../../types';
import { getFitnessTheme, type FitnessThemeMode } from '../../theme/fitnessTheme';

type Props = {
  data: TrendPoint[];
  themeMode: FitnessThemeMode;
  goalValue?: number;
  valueFormatter?: (value: number) => string;
  interpretation: string;
};

const CHART_HEIGHT = 188;
const TOP = 20;
const BOTTOM = 22;
const SIDE = 8;

export function TrainingTrendChart({
  data,
  themeMode,
  goalValue,
  valueFormatter = (value) => Math.round(value).toLocaleString(),
  interpretation,
}: Props) {
  const theme = getFitnessTheme(themeMode);
  const [width, setWidth] = useState(0);
  const [selected, setSelected] = useState(Math.max(0, data.length - 1));
  const selectedIndex = Math.max(0, Math.min(selected, data.length - 1));

  const validValues = useMemo(
    () => data.flatMap((point) => (typeof point.value === 'number' ? [point.value] : [])),
    [data],
  );

  const maximum = Math.max(goalValue ?? 0, ...validValues, 1) * 1.12;
  const average =
    validValues.length > 0
      ? validValues.reduce((sum, value) => sum + value, 0) / validValues.length
      : 0;

  const usableWidth = Math.max(0, width - SIDE * 2);
  const slot = data.length > 0 ? usableWidth / data.length : 0;
  const barWidth = Math.min(28, slot * 0.52);
  const plotHeight = CHART_HEIGHT - TOP - BOTTOM;

  const bars = useMemo(
    () =>
      data.map((point, index) => {
        const x = SIDE + slot * index + (slot - barWidth) / 2;
        const value = point.value;
        const height = typeof value === 'number' ? Math.max(3, (value / maximum) * plotHeight) : 9;
        return {
          x,
          y: TOP + plotHeight - height,
          width: barWidth,
          height,
          centerX: x + barWidth / 2,
          point,
          index,
        };
      }),
    [barWidth, data, maximum, plotHeight, slot],
  );

  const selectAt = useCallback(
    (x: number) => {
      if (!slot || !data.length) return;
      const index = Math.max(0, Math.min(data.length - 1, Math.floor((x - SIDE) / slot)));
      setSelected(index);
    },
    [data.length, slot],
  );

  const gesture = useMemo(
    () =>
      Gesture.Simultaneous(
        Gesture.Tap().onStart((event) => {
          runOnJS(selectAt)(event.x);
        }),
        Gesture.Pan()
          .minDistance(2)
          .onBegin((event) => runOnJS(selectAt)(event.x))
          .onUpdate((event) => runOnJS(selectAt)(event.x)),
      ),
    [selectAt],
  );

  const selectedBar = bars[selectedIndex];
  const goalY =
    goalValue && goalValue > 0
      ? TOP + plotHeight - (goalValue / maximum) * plotHeight
      : undefined;

  const tooltipLeft = selectedBar
    ? Math.max(8, Math.min(width - 132, selectedBar.centerX - 58))
    : 8;

  const total = validValues.reduce((sum, value) => sum + value, 0);

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  return (
    <View
      onLayout={onLayout}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={`Training trend. ${interpretation}`}
      className="gap-3"
    >
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-[10px] uppercase text-muted">Period total</Text>
          <Text className="text-xl font-bold tabular-nums text-foreground">
            {valueFormatter(total)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-[10px] uppercase text-muted">Average</Text>
          <Text className="text-sm font-bold tabular-nums" style={{ color: theme.teal }}>
            {valueFormatter(average)}
          </Text>
        </View>
      </View>

      <GestureDetector gesture={gesture}>
        <View style={{ height: CHART_HEIGHT }}>
          <Canvas style={StyleSheet.absoluteFill}>
            {[0, 0.5, 1].map((fraction) => {
              const y = TOP + plotHeight * fraction;
              return (
                <Line
                  key={fraction}
                  p1={vec(SIDE, y)}
                  p2={vec(width - SIDE, y)}
                  color={theme.line}
                  strokeWidth={1}
                />
              );
            })}

            {goalY !== undefined ? (
              <Line
                p1={vec(SIDE, goalY)}
                p2={vec(width - SIDE, goalY)}
                color={theme.teal}
                strokeWidth={1.5}
              />
            ) : null}

            {bars.map((bar) => {
              const active = bar.index === selected;
              const missing = typeof bar.point.value !== 'number';
              return (
                <Group key={bar.point.id}>
                  {active ? (
                    <Circle
                      cx={bar.centerX}
                      cy={bar.y + 5}
                      r={bar.width * 0.8}
                      color={`${theme.accent}24`}
                    />
                  ) : null}
                  <RoundedRect
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    r={bar.width / 2}
                    color={missing ? theme.surface3 : active ? theme.accent : `${theme.accent}9A`}
                    style={missing ? 'stroke' : 'fill'}
                    strokeWidth={missing ? 1 : undefined}
                  >
                    {!missing ? (
                      <LinearGradient
                        start={vec(bar.x, bar.y)}
                        end={vec(bar.x, bar.y + bar.height)}
                        colors={[
                          active ? theme.accent : `${theme.accent}CC`,
                          active ? theme.accentPressed : `${theme.accentPressed}8A`,
                        ]}
                      />
                    ) : null}
                  </RoundedRect>
                </Group>
              );
            })}
          </Canvas>

          {selectedBar ? (
            <View
              pointerEvents="none"
              style={[
                styles.tooltip,
                {
                  left: tooltipLeft,
                  top: Math.max(0, selectedBar.y - 44),
                  backgroundColor: theme.surface3,
                  borderColor: theme.line,
                },
              ]}
            >
              <Text className="text-[9px] text-muted">{selectedBar.point.label}</Text>
              <Text className="text-xs font-bold tabular-nums text-foreground">
                {typeof selectedBar.point.value === 'number'
                  ? valueFormatter(selectedBar.point.value)
                  : 'No data'}
              </Text>
            </View>
          ) : null}
        </View>
      </GestureDetector>

      <View className="flex-row justify-between px-1">
        {data.map((point) => (
          <Text
            key={point.id}
            className="text-[9px]"
            style={{ color: point.id === selectedBar?.point.id ? theme.accent : theme.muted }}
          >
            {point.label}
          </Text>
        ))}
      </View>

      <View className="rounded-[12px] px-3 py-2" style={{ backgroundColor: theme.surface2 }}>
        <Text className="text-[11px] leading-4 text-muted">{interpretation}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    width: 116,
    minHeight: 38,
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
});
