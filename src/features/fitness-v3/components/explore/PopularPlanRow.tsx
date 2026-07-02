import { Text, View } from 'react-native';
import { Card } from 'heroui-native';

export function PopularPlanRow({ title, detail }: { title: string; detail: string }) {
  return (
    <Card className="rounded-[14px] border border-border">
      <Card.Body className="flex-row items-center gap-3 p-3">
        <View className="size-12 rounded-[12px] bg-[#1C262B]" />
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground">{title}</Text>
          <Text className="text-[10px] text-muted">{detail}</Text>
        </View>
        <Text className="text-muted">{'>'}</Text>
      </Card.Body>
    </Card>
  );
}
