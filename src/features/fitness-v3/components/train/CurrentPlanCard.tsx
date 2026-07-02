import { Text, View } from 'react-native';
import { Button, Card, Chip } from 'heroui-native';
import { getFitnessTheme, type FitnessThemeMode } from '../../theme/fitnessTheme';

export function CurrentPlanCard({ themeMode }: { themeMode: FitnessThemeMode }) {
  const theme = getFitnessTheme(themeMode);
  return (
    <Card className="rounded-[20px] border border-border">
      <Card.Body className="gap-3 p-4">
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="text-[10px] uppercase" style={{ color: theme.accent }}>Current plan</Text>
            <Text className="mt-1 text-lg font-bold text-foreground">Foundation Builder</Text>
            <Text className="text-xs text-muted">Phase 1 - Build Consistency</Text>
          </View>
          <Button size="sm" variant="outline">Change</Button>
        </View>
        <View className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: theme.track }}>
          <View className="h-full w-[38%] rounded-full" style={{ backgroundColor: theme.accent }} />
        </View>
        <View className="flex-row justify-between">
          <Text className="text-[11px] text-muted">Week 2 of 8</Text>
          <Chip size="sm" variant="secondary">38%</Chip>
        </View>
      </Card.Body>
    </Card>
  );
}
