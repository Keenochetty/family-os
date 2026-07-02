import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import type { FitnessRealmDataState, FitnessTab } from '../types';
import type { FitnessThemeMode } from '../theme/fitnessTheme';
import { weekDays, todayMetrics } from '../data/mockData';
import { FitnessRealmScaffold } from '../components/common/FitnessRealmScaffold';
import { FitnessRealmStateBlock } from '../components/common/FitnessRealmStateBlock';
import { EntranceSection } from '../components/common/EntranceSection';
import { MetricCard } from '../components/common/MetricCard';
import { TodayFocusCard } from '../components/today/TodayFocusCard';
import { ReadinessCard } from '../components/today/ReadinessCard';
import { PlanProgressCard } from '../components/today/PlanProgressCard';
import { MuscleLoadPreviewCard } from '../components/today/MuscleLoadPreviewCard';
import { AchievementPreviewCard } from '../components/today/AchievementPreviewCard';
import { AdjustTodaySheet } from '../components/today/AdjustTodaySheet';

type Props = {
  themeMode: FitnessThemeMode;
  onTabChange: (tab: FitnessTab) => void;
  onStartWorkout: () => void;
  state?: FitnessRealmDataState;
};

export function FitnessTodayScreen({ themeMode, onTabChange, onStartWorkout, state = 'normal' }: Props) {
  const [adjustOpen, setAdjustOpen] = useState(false);
  const blockingState = state !== 'normal' && state !== 'partial' ? state : null;

  return (
    <FitnessRealmScaffold
      title="Fitness"
      subtitle="Foundation Builder"
      activeTab="today"
      onTabChange={onTabChange}
      themeMode={themeMode}
      weekDays={weekDays}
    >
      {blockingState ? (
        <ScrollView contentContainerClassName="gap-3 px-4 pb-36 pt-3" showsVerticalScrollIndicator={false}>
          <FitnessRealmStateBlock mode={blockingState} themeMode={themeMode} />
        </ScrollView>
      ) : (
      <ScrollView contentContainerClassName="gap-3 px-4 pb-36 pt-3" showsVerticalScrollIndicator={false}>
        {state === 'partial' ? <FitnessRealmStateBlock mode="partial" themeMode={themeMode} /> : null}
        <EntranceSection index={0}>
          <TodayFocusCard
            themeMode={themeMode}
            onStart={onStartWorkout}
            onAdjust={() => setAdjustOpen(true)}
          />
        </EntranceSection>

        <EntranceSection index={1}>
          <ReadinessCard themeMode={themeMode} />
        </EntranceSection>

        <EntranceSection index={2} className="flex-row flex-wrap gap-2">
          {todayMetrics.map((item) => (
            <View key={item.id} className="w-[48.8%]">
              <MetricCard {...item} themeMode={themeMode} />
            </View>
          ))}
        </EntranceSection>

        <EntranceSection index={3}>
          <PlanProgressCard themeMode={themeMode} />
        </EntranceSection>

        <EntranceSection index={4} className="flex-row gap-2">
          <MuscleLoadPreviewCard themeMode={themeMode} />
          <AchievementPreviewCard themeMode={themeMode} />
        </EntranceSection>
      </ScrollView>
      )}

      {blockingState ? null : (
        <AdjustTodaySheet
          open={adjustOpen}
          onOpenChange={setAdjustOpen}
          onSelect={() => setAdjustOpen(false)}
        />
      )}
    </FitnessRealmScaffold>
  );
}
