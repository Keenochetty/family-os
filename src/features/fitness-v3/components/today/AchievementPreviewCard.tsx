import { Text, View } from 'react-native';
import { Card } from 'heroui-native';
import { getFitnessTheme, type FitnessThemeMode } from '../../theme/fitnessTheme';

export function AchievementPreviewCard({ themeMode }: { themeMode: FitnessThemeMode }) {
  const theme = getFitnessTheme(themeMode);
  return (
    <Card className="min-h-36 flex-1 rounded-[18px] border border-border">
      <Card.Body className="gap-2 p-3">
        <Text className="text-[10px] uppercase text-muted">Achievement</Text>
        <View className="flex-row items-center gap-3">
          <View
            className="size-12 items-center justify-center rounded-[14px] border"
            style={{ borderColor: theme.gold, backgroundColor: `${theme.gold}18` }}
          >
            <Text className="text-xl">*</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-foreground">3 Week Streak</Text>
            <Text className="text-[10px] text-muted">Kept it up</Text>
          </View>
        </View>
      </Card.Body>
    </Card>
  );
}
