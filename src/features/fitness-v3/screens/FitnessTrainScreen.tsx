import { ScrollView, View } from 'react-native';
import { useState } from 'react';
import { Tabs } from 'heroui-native';
import type { FitnessRealmDataState, FitnessTab } from '../types';
import type { FitnessThemeMode } from '../theme/fitnessTheme';
import { weekDays, upcomingWorkouts } from '../data/mockData';
import { FitnessRealmScaffold } from '../components/common/FitnessRealmScaffold';
import { FitnessRealmStateBlock } from '../components/common/FitnessRealmStateBlock';
import { EntranceSection } from '../components/common/EntranceSection';
import { CurrentPlanCard } from '../components/train/CurrentPlanCard';
import { WeeklyScheduleCard } from '../components/train/WeeklyScheduleCard';
import { WorkoutRow } from '../components/train/WorkoutRow';
import { PlanToolsCard } from '../components/train/PlanToolsCard';

type WorkoutTab = 'upcoming' | 'completed';

type Props = {
  themeMode: FitnessThemeMode;
  onTabChange: (tab: FitnessTab) => void;
  state?: FitnessRealmDataState;
};

export function FitnessTrainScreen({ themeMode, onTabChange, state = 'normal' }: Props) {
  const [workoutTab, setWorkoutTab] = useState<WorkoutTab>('upcoming');
  const blockingState = state !== 'normal' && state !== 'partial' ? state : null;

  return (
    <FitnessRealmScaffold
      title="Train"
      subtitle="Your programme and schedule"
      activeTab="train"
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
          <CurrentPlanCard themeMode={themeMode} />
        </EntranceSection>
        <EntranceSection index={1}>
          <WeeklyScheduleCard themeMode={themeMode} />
        </EntranceSection>
        <EntranceSection index={2}>
          <Tabs value={workoutTab} onValueChange={(value) => setWorkoutTab(value as WorkoutTab)} variant="secondary">
            <Tabs.List>
              <Tabs.Indicator />
              <Tabs.Trigger value="upcoming" className="flex-1">
                <Tabs.Label>Upcoming</Tabs.Label>
              </Tabs.Trigger>
              <Tabs.Trigger value="completed" className="flex-1">
                <Tabs.Label>Completed</Tabs.Label>
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="upcoming">
              <View className="mt-3 gap-2">
                {upcomingWorkouts.map((item) => (
                  <WorkoutRow key={item.id} item={item} themeMode={themeMode} />
                ))}
              </View>
            </Tabs.Content>
            <Tabs.Content value="completed">
              <View className="mt-3 gap-2">
                <WorkoutRow
                  themeMode={themeMode}
                  item={{ ...upcomingWorkouts[0], id: 'complete-1', dateLabel: 'Last Monday', status: 'complete' }}
                />
              </View>
            </Tabs.Content>
          </Tabs>
        </EntranceSection>
        <EntranceSection index={3}>
          <PlanToolsCard />
        </EntranceSection>
      </ScrollView>
      )}
    </FitnessRealmScaffold>
  );
}
