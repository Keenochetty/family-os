import { defaultTopRealms } from "@/features/onboarding/onboardingData";
import { OnboardingScaffold, RealmPreviewCard } from "@/features/onboarding/OnboardingScaffold";

export default function TopRealmsScreen() {
  return (
    <OnboardingScaffold nextHref="/onboarding/permissions-preview" stepLabel="Top 4" title="Your first health realms" subtitle="These are mock previews. You can replace, reorder, or make realms private later.">
      {defaultTopRealms.map((realm) => (
        <RealmPreviewCard key={realm.key} realm={realm.key} title={realm.name} description={realm.description} />
      ))}
    </OnboardingScaffold>
  );
}
