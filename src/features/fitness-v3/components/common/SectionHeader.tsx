import { Text, View } from 'react-native';
import { Button } from 'heroui-native';

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-[17px] font-bold text-foreground">{title}</Text>
      {actionLabel ? (
        <Button size="sm" variant="ghost" onPress={onAction}>
          <Button.Label className="text-xs">{actionLabel}</Button.Label>
        </Button>
      ) : null}
    </View>
  );
}
