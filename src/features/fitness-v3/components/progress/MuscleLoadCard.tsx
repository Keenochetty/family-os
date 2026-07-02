import { Text, View } from 'react-native';
import { Button, Card } from 'heroui-native';
import type { FitnessThemeMode } from '../../theme/fitnessTheme';
import { getFitnessTheme } from '../../theme/fitnessTheme';

export function MuscleLoadCard({ themeMode }: { themeMode: FitnessThemeMode }) {
  const theme = getFitnessTheme(themeMode);
  return (
    <Card className="rounded-[20px] border border-border">
      <Card.Body className="gap-3 p-3">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[10px] uppercase text-muted">Muscle map</Text>
            <Text className="text-sm font-bold text-foreground">This week load</Text>
          </View>
          <Button size="sm" variant="outline">View details</Button>
        </View>
        <View className="h-48 items-center justify-center rounded-[16px]" style={{ backgroundColor: theme.surface2 }}>
          <Text className="text-xs text-muted">Male and female front/back SVG wrapper</Text>
        </View>
        <View className="flex-row gap-4">
          <Legend colour={theme.accent} label="High" />
          <Legend colour={theme.teal} label="Moderate" />
          <Legend colour={theme.gold} label="Low" />
        </View>
      </Card.Body>
    </Card>
  );
}

function Legend({ colour, label }: { colour: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1">
      <View className="size-2 rounded-sm" style={{ backgroundColor: colour }} />
      <Text className="text-[10px] text-muted">{label}</Text>
    </View>
  );
}
