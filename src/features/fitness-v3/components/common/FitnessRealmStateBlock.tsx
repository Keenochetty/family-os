import { Text, View } from 'react-native';
import { Button, Card } from 'heroui-native';

import type { FitnessRealmDataState } from '../../types';
import { getFitnessTheme, type FitnessThemeMode } from '../../theme/fitnessTheme';

const stateCopy: Record<Exclude<FitnessRealmDataState, 'normal'>, { action?: string; detail: string; title: string; tone: 'accent' | 'danger' | 'teal' }> = {
  empty: {
    action: 'Browse plans',
    detail: 'No fitness plan is selected yet. Choose a programme to create the first workout schedule.',
    title: 'No fitness plan yet',
    tone: 'accent',
  },
  error: {
    action: 'Try again',
    detail: 'Fitness data could not be prepared. The saved local workout route is still available.',
    title: 'Fitness data unavailable',
    tone: 'danger',
  },
  loading: {
    detail: 'Preparing your workout plan, readiness summary, and progress insight.',
    title: 'Loading fitness realm',
    tone: 'teal',
  },
  offline: {
    action: 'Use saved data',
    detail: 'Showing local plan details. Device metrics and cloud sync will refresh when connection returns.',
    title: 'Offline mode',
    tone: 'teal',
  },
  partial: {
    action: 'Review sources',
    detail: 'Some device metrics are missing or stale. Workout plan and local history remain usable.',
    title: 'Partial data',
    tone: 'accent',
  },
};

type FitnessRealmStateBlockProps = {
  mode: Exclude<FitnessRealmDataState, 'normal'>;
  themeMode: FitnessThemeMode;
};

export function FitnessRealmStateBlock({ mode, themeMode }: FitnessRealmStateBlockProps) {
  const theme = getFitnessTheme(themeMode);
  const copy = stateCopy[mode];
  const colour = copy.tone === 'danger' ? theme.danger : copy.tone === 'teal' ? theme.teal : theme.accent;

  return (
    <Card className="rounded-[18px] border border-border">
      <Card.Body className="gap-3 p-4">
        <View className="flex-row items-center gap-3">
          <View className="size-3 rounded-full" style={{ backgroundColor: colour }} />
          <View className="flex-1">
            <Text className="text-base font-bold text-foreground">{copy.title}</Text>
            <Text className="mt-1 text-xs leading-5 text-muted">{copy.detail}</Text>
          </View>
        </View>
        {copy.action ? (
          <Button size="sm" variant="outline">
            <Button.Label>{copy.action}</Button.Label>
          </Button>
        ) : null}
      </Card.Body>
    </Card>
  );
}
