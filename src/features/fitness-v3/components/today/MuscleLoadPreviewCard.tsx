import { Text, View } from 'react-native';
import { Card } from 'heroui-native';
import { getFitnessTheme, type FitnessThemeMode } from '../../theme/fitnessTheme';

export function MuscleLoadPreviewCard({ themeMode }: { themeMode: FitnessThemeMode }) {
  const theme = getFitnessTheme(themeMode);
  return (
    <Card className="min-h-36 flex-1 rounded-[18px] border border-border">
      <Card.Body className="gap-2 p-3">
        <Text className="text-[10px] uppercase text-muted">Muscle load</Text>
        <Text className="text-sm font-bold text-foreground">Upper Body</Text>
        <View className="flex-1 items-center justify-center rounded-[12px]" style={{ backgroundColor: theme.surface2 }}>
          <Text className="text-[10px] text-muted">Male/female SVG slot</Text>
        </View>
        <Text className="text-[11px] font-semibold" style={{ color: theme.warning }}>Moderate</Text>
      </Card.Body>
    </Card>
  );
}
