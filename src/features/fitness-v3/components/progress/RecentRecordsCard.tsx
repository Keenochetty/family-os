import { Text, View } from 'react-native';
import { Card } from 'heroui-native';

const records = [
  ['Bench Press', '60 kg x 8', 'Jun 20'],
  ['Squat', '80 kg x 6', 'Jun 20'],
];

export function RecentRecordsCard() {
  return (
    <Card className="rounded-[18px] border border-border">
      <Card.Body className="gap-3 p-3">
        <Text className="text-[11px] font-bold uppercase text-muted">Recent PRs</Text>
        <View className="flex-row gap-2">
          {records.map(([title, value, date]) => (
            <View key={title} className="flex-1 rounded-[14px] border border-border p-3">
              <Text className="text-[11px] font-semibold text-foreground">{title}</Text>
              <Text className="mt-1 text-sm font-bold text-foreground">{value}</Text>
              <Text className="text-[9px] text-muted">{date}</Text>
            </View>
          ))}
        </View>
      </Card.Body>
    </Card>
  );
}
