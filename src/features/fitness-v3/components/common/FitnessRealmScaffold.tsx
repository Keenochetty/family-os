import { Text, View } from 'react-native';
import type { PropsWithChildren } from 'react';
import { FitnessRealmTabs } from './FitnessRealmTabs';
import { FitnessWeekStrip } from './FitnessWeekStrip';
import type { FitnessTab } from '../../types';
import type { FitnessThemeMode } from '../../theme/fitnessTheme';

type Props = PropsWithChildren<{
  title: string;
  subtitle?: string;
  activeTab: FitnessTab;
  onTabChange: (tab: FitnessTab) => void;
  themeMode: FitnessThemeMode;
  weekDays?: React.ComponentProps<typeof FitnessWeekStrip>['days'];
}>;

export function FitnessRealmScaffold({
  title,
  subtitle,
  activeTab,
  onTabChange,
  themeMode,
  weekDays,
  children,
}: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="gap-3 border-b border-border px-4 pb-3 pt-2">
        <View>
          <Text className="text-[27px] font-bold tracking-tight text-foreground">{title}</Text>
          {subtitle ? <Text className="text-xs text-muted">{subtitle}</Text> : null}
        </View>
        {weekDays ? <FitnessWeekStrip days={weekDays} themeMode={themeMode} /> : null}
        <FitnessRealmTabs value={activeTab} onChange={onTabChange} />
      </View>
      {children}
    </View>
  );
}
