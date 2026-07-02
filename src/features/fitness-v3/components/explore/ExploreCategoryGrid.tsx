import { Text, View } from 'react-native';
import { Card } from 'heroui-native';

const categories = [
  'Strength',
  'Hypertrophy',
  'Weight Loss',
  'Cardio',
  'Mobility',
  'Recovery',
  'Home Workouts',
  'Gym Workouts',
  'Running & Walks',
];

export function ExploreCategoryGrid() {
  return (
    <View className="flex-row flex-wrap gap-2">
      {categories.map((title) => (
        <Card key={title} className="w-[31.5%] overflow-hidden rounded-[14px] border border-border">
          <View className="aspect-[16/10] items-center justify-center bg-[#1C262B]">
            <Text className="text-[9px] text-muted">IMAGE</Text>
          </View>
          <Card.Body className="p-2">
            <Text className="text-[10px] font-semibold text-foreground" numberOfLines={1}>{title}</Text>
          </Card.Body>
        </Card>
      ))}
    </View>
  );
}
