import { Text, View } from 'react-native';
import { Card } from 'heroui-native';
import { getFitnessTheme, type FitnessThemeMode } from '../../theme/fitnessTheme';

export function PlanProgressCard({ themeMode }: { themeMode: FitnessThemeMode }) {
  const theme = getFitnessTheme(themeMode);
  return (
    <Card className="rounded-[18px] border border-border">
      <Card.Body className="gap-3 p-3">
        <View className="flex-row justify-between">
          <View>
            <Text className="text-[10px] uppercase text-muted">Plan progress</Text>
            <Text className="mt-1 text-sm font-bold text-foreground">Foundation Phase - Week 2 of 8</Text>
          </View>
          <Text className="text-sm font-bold text-foreground">38%</Text>
        </View>
        <View className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: theme.track }}>
          <View className="h-full rounded-full" style={{ width: '38%', backgroundColor: theme.teal }} />
        </View>
        <Text className="text-[10px] text-muted">3 of 8 planned workouts complete</Text>
      </Card.Body>
    </Card>
  );
}
