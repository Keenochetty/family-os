import { Text, View } from 'react-native';
import { Card } from 'heroui-native';
import { ReadinessGauge } from './ReadinessGauge';
import type { FitnessThemeMode } from '../../theme/fitnessTheme';

const factors = [
  ['Energy', '4/5'],
  ['Sleep', '3/5'],
  ['Soreness', '2/5'],
  ['Stress', '2/5'],
];

export function ReadinessCard({ themeMode }: { themeMode: FitnessThemeMode }) {
  return (
    <Card className="rounded-[18px] border border-border">
      <Card.Body className="flex-row items-center gap-3 p-3">
        <ReadinessGauge value={75} label="Good" themeMode={themeMode} />
        <View className="flex-1 gap-2">
          {factors.map(([label, value]) => (
            <View key={label} className="flex-row items-center justify-between">
              <Text className="text-[11px] text-muted">{label}</Text>
              <Text className="text-[11px] font-semibold text-foreground">{value}</Text>
            </View>
          ))}
          <Text className="mt-1 text-[10px] leading-4 text-muted">
            Ready to train. Keep today at moderate intensity.
          </Text>
        </View>
      </Card.Body>
    </Card>
  );
}
