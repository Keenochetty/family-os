import { Tabs } from 'heroui-native';
import type { FitnessTab } from '../../types';

type Props = {
  value: FitnessTab;
  onChange: (value: FitnessTab) => void;
};

export function FitnessRealmTabs({ value, onChange }: Props) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onChange(next as FitnessTab)}
      variant="secondary"
    >
      <Tabs.List>
        <Tabs.Indicator />
        {(['today', 'train', 'explore', 'progress'] as FitnessTab[]).map((tab) => (
          <Tabs.Trigger key={tab} value={tab} className="flex-1">
            <Tabs.Label className="capitalize text-xs">{tab}</Tabs.Label>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
