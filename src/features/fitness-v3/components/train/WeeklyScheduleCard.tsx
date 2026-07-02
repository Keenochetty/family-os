import { Text, View } from 'react-native';
import { Card } from 'heroui-native';
import { getFitnessTheme, type FitnessThemeMode } from '../../theme/fitnessTheme';
import { weekDays } from '../../data/mockData';

export function WeeklyScheduleCard({ themeMode }: { themeMode: FitnessThemeMode }) {
  const theme = getFitnessTheme(themeMode);
  return (
    <Card className="rounded-[18px] border border-border">
      <Card.Body className="gap-3 p-3">
        <Text className="text-[11px] font-bold uppercase text-muted">Weekly schedule</Text>
        <View className="flex-row justify-between">
          {weekDays.map((day) => (
            <View key={`${day.day}-${day.date}`} className="items-center gap-1">
              <Text className="text-[9px] text-muted">{day.day}</Text>
              <View
                className="size-8 items-center justify-center rounded-full"
                style={{
                  backgroundColor: day.state === 'selected' ? theme.accent : 'transparent',
                  borderColor: theme.line,
                  borderWidth: day.state === 'planned' ? 1 : 0,
                }}
              >
                <Text
                  className="text-[11px] font-semibold"
                  style={{ color: day.state === 'selected' ? '#FFF' : theme.text }}
                >
                  {day.date}
                </Text>
              </View>
              <Text
                className="text-[10px]"
                style={{
                  color:
                    day.state === 'complete'
                      ? theme.green
                      : day.state === 'rest'
                        ? theme.teal
                        : theme.subtle,
                }}
              >
                {day.state === 'complete' ? 'OK' : day.state === 'rest' ? '-' : '*'}
              </Text>
            </View>
          ))}
        </View>
      </Card.Body>
    </Card>
  );
}
