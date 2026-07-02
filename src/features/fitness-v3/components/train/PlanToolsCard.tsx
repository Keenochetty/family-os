import { Text, View } from 'react-native';
import { Card } from 'heroui-native';

const tools = [
  ['Adjust Plan', 'Update timeline or intensity'],
  ['Substitute Exercises', 'Find better alternatives'],
  ['Deload Week', 'Schedule a recovery week'],
  ['Downloaded Workouts', 'Offline availability'],
];

export function PlanToolsCard() {
  return (
    <Card className="rounded-[18px] border border-border">
      <Card.Body className="gap-2 p-3">
        <Text className="text-[11px] font-bold uppercase text-muted">Plan tools</Text>
        <View className="gap-1">
          {tools.map(([title, detail]) => (
            <View key={title} className="min-h-12 flex-row items-center border-b border-border py-2 last:border-b-0">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">{title}</Text>
                <Text className="text-[10px] text-muted">{detail}</Text>
              </View>
              <Text className="text-muted">{'>'}</Text>
            </View>
          ))}
        </View>
      </Card.Body>
    </Card>
  );
}
