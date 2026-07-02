import { View } from 'react-native';
import { BottomSheet, Button } from 'heroui-native';

const actions = [
  ['Less time', "Shorten today's workout"],
  ['Different equipment', 'Use what you have'],
  ['Feeling sore', 'Reduce load or change muscles'],
  ['Lower energy', 'Use a lower-impact version'],
  ['Travelling', 'Hotel or minimal-equipment version'],
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: string) => void;
};

export function AdjustTodaySheet({ open, onOpenChange, onSelect }: Props) {
  return (
    <BottomSheet isOpen={open} onOpenChange={onOpenChange}>
      <BottomSheet.Portal unstable_accessibilityContainerViewIsModal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          detached
          bottomInset={12}
          className="mx-4"
          backgroundClassName="rounded-[30px]"
        >
          <BottomSheet.Close />
          <BottomSheet.Title>Adjust today</BottomSheet.Title>
          <BottomSheet.Description>
            Life happens. Review a suggested change before applying it.
          </BottomSheet.Description>
          <View className="mt-5 gap-2">
            {actions.map(([title, detail]) => (
              <Button
                key={title}
                variant="secondary"
                className="min-h-14 justify-start"
                onPress={() => onSelect(title)}
              >
                <View className="items-start">
                  <Button.Label className="font-bold">{title}</Button.Label>
                  <Button.Label className="text-xs opacity-65">{detail}</Button.Label>
                </View>
              </Button>
            ))}
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
