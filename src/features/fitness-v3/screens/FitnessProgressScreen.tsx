import { ScrollView, View } from 'react-native';
import { useState } from 'react';
import { Tabs } from 'heroui-native';
import type { FitnessRealmDataState, FitnessTab, ProgressSection } from '../types';
import type { FitnessThemeMode } from '../theme/fitnessTheme';
import { progressMetrics } from '../data/mockData';
import { FitnessRealmScaffold } from '../components/common/FitnessRealmScaffold';
import { FitnessRealmStateBlock } from '../components/common/FitnessRealmStateBlock';
import { EntranceSection } from '../components/common/EntranceSection';
import { MetricCard } from '../components/common/MetricCard';
import { TrainingTrendCard } from '../components/progress/TrainingTrendCard';
import { MuscleLoadCard } from '../components/progress/MuscleLoadCard';
import { RecentRecordsCard } from '../components/progress/RecentRecordsCard';
import { MomentumCard } from '../components/progress/MomentumCard';

type Props = {
  themeMode: FitnessThemeMode;
  onTabChange: (tab: FitnessTab) => void;
  state?: FitnessRealmDataState;
};

const sections: ProgressSection[] = ['overview', 'strength', 'cardio', 'body', 'health'];

export function FitnessProgressScreen({ themeMode, onTabChange, state = 'normal' }: Props) {
  const [section, setSection] = useState<ProgressSection>('overview');
  const blockingState = state !== 'normal' && state !== 'partial' ? state : null;

  return (
    <FitnessRealmScaffold
      title="Progress"
      subtitle="Trends, records and useful insight"
      activeTab="progress"
      onTabChange={onTabChange}
      themeMode={themeMode}
    >
      {blockingState ? (
        <ScrollView contentContainerClassName="gap-3 px-4 pb-36 pt-3" showsVerticalScrollIndicator={false}>
          <FitnessRealmStateBlock mode={blockingState} themeMode={themeMode} />
        </ScrollView>
      ) : (
      <ScrollView contentContainerClassName="gap-3 px-4 pb-36 pt-3" showsVerticalScrollIndicator={false}>
        {state === 'partial' ? <FitnessRealmStateBlock mode="partial" themeMode={themeMode} /> : null}
        <EntranceSection index={0}>
          <Tabs value={section} onValueChange={(value) => setSection(value as ProgressSection)} variant="primary">
            <Tabs.List>
              <Tabs.ScrollView>
                <Tabs.Indicator />
                {sections.map((section) => (
                  <Tabs.Trigger key={section} value={section}>
                    <Tabs.Label className="capitalize text-xs">{section}</Tabs.Label>
                  </Tabs.Trigger>
                ))}
              </Tabs.ScrollView>
            </Tabs.List>
          </Tabs>
        </EntranceSection>

        <EntranceSection index={1} className="flex-row flex-wrap gap-2">
          {progressMetrics.map((item) => (
            <View key={item.id} className="w-[48.8%]">
              <MetricCard {...item} themeMode={themeMode} />
            </View>
          ))}
        </EntranceSection>

        <EntranceSection index={2}>
          <TrainingTrendCard themeMode={themeMode} />
        </EntranceSection>

        <EntranceSection index={3}>
          <MuscleLoadCard themeMode={themeMode} />
        </EntranceSection>

        <EntranceSection index={4}>
          <RecentRecordsCard />
        </EntranceSection>

        <EntranceSection index={5}>
          <MomentumCard themeMode={themeMode} />
        </EntranceSection>
      </ScrollView>
      )}
    </FitnessRealmScaffold>
  );
}
