import { ScrollView } from 'react-native';
import { Chip, SearchField } from 'heroui-native';
import type { FitnessRealmDataState, FitnessTab } from '../types';
import type { FitnessThemeMode } from '../theme/fitnessTheme';
import { recommendedProgrammes } from '../data/mockData';
import { FitnessRealmScaffold } from '../components/common/FitnessRealmScaffold';
import { FitnessRealmStateBlock } from '../components/common/FitnessRealmStateBlock';
import { EntranceSection } from '../components/common/EntranceSection';
import { SectionHeader } from '../components/common/SectionHeader';
import { ProgrammeDiscoveryCard } from '../components/explore/ProgrammeDiscoveryCard';
import { ExploreCategoryGrid } from '../components/explore/ExploreCategoryGrid';
import { PopularPlanRow } from '../components/explore/PopularPlanRow';

type Props = {
  themeMode: FitnessThemeMode;
  onTabChange: (tab: FitnessTab) => void;
  state?: FitnessRealmDataState;
};

const chips = ['For You', 'Strength', 'Cardio', 'Mobility', 'Beginner'];

export function FitnessExploreScreen({ themeMode, onTabChange, state = 'normal' }: Props) {
  const blockingState = state !== 'normal' && state !== 'partial' ? state : null;

  return (
    <FitnessRealmScaffold
      title="Explore"
      subtitle="Plans, workouts and exercises"
      activeTab="explore"
      onTabChange={onTabChange}
      themeMode={themeMode}
    >
      {blockingState ? (
        <ScrollView contentContainerClassName="gap-3 px-4 pb-36 pt-3" showsVerticalScrollIndicator={false}>
          <FitnessRealmStateBlock mode={blockingState} themeMode={themeMode} />
        </ScrollView>
      ) : (
      <ScrollView contentContainerClassName="gap-4 px-4 pb-36 pt-3" showsVerticalScrollIndicator={false}>
        {state === 'partial' ? <FitnessRealmStateBlock mode="partial" themeMode={themeMode} /> : null}
        <EntranceSection index={0}>
          <SearchField>
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search workouts, plans, exercises..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
        </EntranceSection>

        <EntranceSection index={1}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
            {chips.map((chip, index) => (
              <Chip key={chip} variant={index === 0 ? 'primary' : 'secondary'}>{chip}</Chip>
            ))}
          </ScrollView>
        </EntranceSection>

        <EntranceSection index={2} className="gap-2">
          <SectionHeader title="Recommended for you" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
            {recommendedProgrammes.map((item) => (
              <ProgrammeDiscoveryCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </EntranceSection>

        <EntranceSection index={3} className="gap-2">
          <SectionHeader title="Browse categories" />
          <ExploreCategoryGrid />
        </EntranceSection>

        <EntranceSection index={4} className="gap-2">
          <SectionHeader title="Popular plans" actionLabel="See all" />
          <PopularPlanRow title="Glute Growth Guide" detail="5 weeks - Intermediate" />
          <PopularPlanRow title="Lean & Strong" detail="6 weeks - Beginner" />
        </EntranceSection>
      </ScrollView>
      )}
    </FitnessRealmScaffold>
  );
}
