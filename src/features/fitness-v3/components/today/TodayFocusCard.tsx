import { Image, Text, View } from 'react-native';
import { Button, Card, Chip } from 'heroui-native';
import { AttentionCue } from '../common/AttentionCue';
import { getFitnessTheme, type FitnessThemeMode } from '../../theme/fitnessTheme';

type Props = {
  themeMode: FitnessThemeMode;
  imageUri?: string;
  onStart: () => void;
  onAdjust: () => void;
};

export function TodayFocusCard({ themeMode, imageUri, onStart, onAdjust }: Props) {
  const theme = getFitnessTheme(themeMode);

  return (
    <Card className="overflow-hidden rounded-[24px] border border-border">
      <View className="relative aspect-[16/9] bg-[#1C262B]">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            resizeMode="cover"
            className="size-full"
            accessibilityLabel="Upper Push workout preview"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-xs text-muted">16:9 workout image slot</Text>
          </View>
        )}
        <View className="absolute inset-0 justify-end bg-black/25 p-4">
          <Chip size="sm" className="self-start">TODAY FOCUS</Chip>
          <Text className="mt-2 text-[25px] font-bold text-white">Upper Push</Text>
          <Text className="text-sm text-white/80">Strength - 45 min - 6 exercises</Text>
        </View>
      </View>

      <Card.Body className="gap-3">
        <Text className="text-sm leading-5 text-muted">
          Selected because your lower body is recovering and this session fits your available time.
        </Text>
        <View className="flex-row gap-2">
          <AttentionCue active colour={theme.accent}>
            <Button className="flex-1" style={{ backgroundColor: theme.accent }} onPress={onStart}>
              <Button.Label className="text-white">Start Workout</Button.Label>
            </Button>
          </AttentionCue>
          <Button variant="outline" onPress={onAdjust}>Adjust</Button>
        </View>
      </Card.Body>
    </Card>
  );
}
