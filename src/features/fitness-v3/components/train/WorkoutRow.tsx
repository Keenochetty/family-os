import { Text, View } from 'react-native';
import { Card } from 'heroui-native';
import type { WorkoutItem } from '../../types';
import { getFitnessTheme, type FitnessThemeMode } from '../../theme/fitnessTheme';

export function WorkoutRow({ item, themeMode }: { item: WorkoutItem; themeMode: FitnessThemeMode }) {
  const theme = getFitnessTheme(themeMode);
  return (
    <Card className="rounded-[14px] border border-border" variant="default">
      <Card.Body className="flex-row items-center gap-3 p-3">
        <View className="size-11 items-center justify-center rounded-[12px]" style={{ backgroundColor: theme.surface3 }}>
          <Text className="text-[9px] text-muted">MAP</Text>
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-foreground">{item.title}</Text>
          <Text className="text-[10px] text-muted">{item.dateLabel} - {item.durationMin} min</Text>
        </View>
        <Text style={{ color: item.status === 'complete' ? theme.green : theme.accent }}>{'>'}</Text>
      </Card.Body>
    </Card>
  );
}
