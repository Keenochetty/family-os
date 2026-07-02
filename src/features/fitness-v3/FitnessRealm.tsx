import { useState } from 'react';
import type { FitnessTab } from './types';
import type { FitnessThemeMode } from './theme/fitnessTheme';
import { FitnessTodayScreen } from './screens/FitnessTodayScreen';
import { FitnessTrainScreen } from './screens/FitnessTrainScreen';
import { FitnessExploreScreen } from './screens/FitnessExploreScreen';
import { FitnessProgressScreen } from './screens/FitnessProgressScreen';

type Props = {
  initialTab?: FitnessTab;
  onTabChange?: (tab: FitnessTab) => void;
  themeMode: FitnessThemeMode;
  onStartWorkout: () => void;
};

export function FitnessRealm({ initialTab = 'today', onTabChange, themeMode, onStartWorkout }: Props) {
  const [tab, setTab] = useState<FitnessTab>(initialTab);

  function handleTabChange(nextTab: FitnessTab) {
    setTab(nextTab);
    onTabChange?.(nextTab);
  }

  if (tab === 'train') {
    return <FitnessTrainScreen themeMode={themeMode} onTabChange={handleTabChange} />;
  }

  if (tab === 'explore') {
    return <FitnessExploreScreen themeMode={themeMode} onTabChange={handleTabChange} />;
  }

  if (tab === 'progress') {
    return <FitnessProgressScreen themeMode={themeMode} onTabChange={handleTabChange} />;
  }

  return (
    <FitnessTodayScreen
      themeMode={themeMode}
      onTabChange={handleTabChange}
      onStartWorkout={onStartWorkout}
    />
  );
}
