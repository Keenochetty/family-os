import { Text, View } from 'react-native';
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
import { Card } from 'heroui-native';
import { getFitnessTheme, type FitnessThemeMode } from '../../theme/fitnessTheme';

function momentumArcPath() {
  return Skia.PathBuilder.Make()
    .addArc({ height: 86, width: 86, x: 13, y: 13 }, -90, 310)
    .detach();
}

export function MomentumCard({ themeMode }: { themeMode: FitnessThemeMode }) {
  const theme = getFitnessTheme(themeMode);
  const arcPath = momentumArcPath();

  return (
    <Card className="rounded-[18px] border border-border">
      <Card.Body className="flex-row items-center gap-4 p-3">
        <View className="size-28">
          <Canvas style={{ width: 112, height: 112 }}>
            <Circle cx={56} cy={56} r={43} style="stroke" strokeWidth={11} color={theme.track} />
            <Path path={arcPath} style="stroke" strokeWidth={11} strokeCap="round" color={theme.teal} />
          </Canvas>
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-[27px] font-bold text-foreground">86</Text>
            <Text className="text-[10px] text-muted">Strong</Text>
          </View>
        </View>
        <View className="flex-1 gap-2">
          <Text className="text-sm font-bold text-foreground">Weekly Momentum</Text>
          <Text className="text-[10px] text-muted">Done: 3 of 3 workouts</Text>
          <Text className="text-[10px] text-muted">Done: 2 recovery days</Text>
          <Text className="text-[10px] text-muted">Done: Nutrition on track</Text>
          <Text className="text-[10px] text-muted">Done: Hydration goal met</Text>
        </View>
      </Card.Body>
    </Card>
  );
}
