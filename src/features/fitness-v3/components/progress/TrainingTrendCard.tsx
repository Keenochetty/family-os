import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Card } from 'heroui-native';
import type { ChartRange } from '../../types';
import type { FitnessThemeMode } from '../../theme/fitnessTheme';
import { volume1Y, volume3M, volume4W, volume7D } from '../../data/mockData';
import { TrainingTrendChart } from '../charts/TrainingTrendChart';

const ranges: ChartRange[] = ['7D', '4W', '3M', '1Y'];

export function TrainingTrendCard({ themeMode }: { themeMode: FitnessThemeMode }) {
  const [range, setRange] = useState<ChartRange>('4W');

  const data = useMemo(() => {
    if (range === '7D') return volume7D;
    if (range === '3M') return volume3M;
    if (range === '1Y') return volume1Y;
    return volume4W;
  }, [range]);

  return (
    <Card className="rounded-[20px] border border-border">
      <Card.Body className="gap-4 p-3">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[10px] uppercase text-muted">Trend chart</Text>
            <Text className="text-sm font-bold text-foreground">Training volume</Text>
          </View>
          <View className="flex-row gap-1">
            {ranges.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={range === item ? 'primary' : 'ghost'}
                onPress={() => setRange(item)}
                className="min-w-10"
              >
                <Button.Label className="text-[10px]">{item}</Button.Label>
              </Button>
            ))}
          </View>
        </View>

        <TrainingTrendChart
          data={data}
          themeMode={themeMode}
          goalValue={range === '4W' ? 6500 : undefined}
          valueFormatter={(value) => `${Math.round(value).toLocaleString()} kg`}
          interpretation={
            range === '4W'
              ? 'Volume is 12% higher than the previous four weeks. Jun 22 was your strongest week.'
              : 'Use this view to compare training output across the selected period.'
          }
        />
      </Card.Body>
    </Card>
  );
}
