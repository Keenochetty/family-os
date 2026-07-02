import { Pressable, Text, View } from 'react-native';
import { getFitnessTheme, type FitnessThemeMode } from '../../theme/fitnessTheme';

type Day = {
  day: string;
  date: number;
  state: 'complete' | 'selected' | 'planned' | 'rest';
};

type Props = {
  days: Day[];
  themeMode: FitnessThemeMode;
  onSelect?: (date: number) => void;
};

export function FitnessWeekStrip({ days, themeMode, onSelect }: Props) {
  const theme = getFitnessTheme(themeMode);

  return (
    <View className="flex-row justify-between">
      {days.map((item) => {
        const selected = item.state === 'selected';
        return (
          <Pressable
            key={`${item.day}-${item.date}`}
            onPress={() => onSelect?.(item.date)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            className="items-center gap-1"
            style={{ minWidth: 36, minHeight: 48 }}
          >
            <Text className="text-[10px] text-muted">{item.day}</Text>
            <View
              className="size-8 items-center justify-center rounded-full"
              style={{
                backgroundColor: selected ? theme.accent : 'transparent',
                borderWidth: item.state === 'planned' ? 1 : 0,
                borderColor: theme.line,
              }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: selected ? '#FFFFFF' : theme.text }}
              >
                {item.date}
              </Text>
            </View>
            <View
              className="size-1 rounded-full"
              style={{
                backgroundColor:
                  item.state === 'complete'
                    ? theme.green
                    : item.state === 'rest'
                      ? theme.teal
                      : 'transparent',
              }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
