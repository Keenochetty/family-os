import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { getFitnessTheme, type FitnessThemeMode } from '../../theme/fitnessTheme';

type Props = {
  value: number;
  label: string;
  themeMode: FitnessThemeMode;
  size?: number;
};

function arcPath(size: number, start: number, sweep: number) {
  const inset = size * 0.12;
  return Skia.PathBuilder.Make()
    .addArc({ x: inset, y: inset, width: size - inset * 2, height: size - inset * 2 }, start, sweep)
    .detach();
}

export function ReadinessGauge({ value, label, themeMode, size = 124 }: Props) {
  const theme = getFitnessTheme(themeMode);
  const progress = Math.max(0, Math.min(value / 100, 1));
  const track = useMemo(() => arcPath(size, 200, 140), [size]);
  const active = useMemo(() => arcPath(size, 200, 140 * progress), [progress, size]);

  return (
    <View style={{ width: size, height: size * 0.78 }}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Path path={track} style="stroke" strokeWidth={10} strokeCap="round" color={theme.track} />
        <Path path={active} style="stroke" strokeWidth={10} strokeCap="round" color={theme.gold} />
      </Canvas>
      <View style={styles.center}>
        <Text className="text-[30px] font-bold tabular-nums text-foreground">{value}</Text>
        <Text className="text-[11px] font-semibold" style={{ color: theme.gold }}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
});
