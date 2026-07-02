import { Image, Text, View } from 'react-native';
import { Button, Card, Chip } from 'heroui-native';
import type { Programme } from '../../types';

type Props = {
  item: Programme;
  onOpen?: () => void;
};

export function ProgrammeDiscoveryCard({ item, onOpen }: Props) {
  return (
    <Card className="w-[210px] overflow-hidden rounded-[18px] border border-border">
      <View className="aspect-[4/5] bg-[#1C262B]">
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} resizeMode="cover" className="size-full" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-xs text-muted">4:5 programme image</Text>
          </View>
        )}
      </View>
      <Card.Body className="gap-2 p-3">
        <Chip size="sm" variant="secondary" className="self-start">{item.level}</Chip>
        <Text className="text-base font-bold text-foreground">{item.title}</Text>
        <Text className="text-[11px] leading-4 text-muted">{item.subtitle}</Text>
        <Text className="text-[10px] text-muted">
          {item.weeks} weeks - {item.daysPerWeek}x per week - {item.durationMin} min
        </Text>
        <Button size="sm" onPress={onOpen}>Open plan</Button>
      </Card.Body>
    </Card>
  );
}
