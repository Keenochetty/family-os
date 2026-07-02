import { HealthCard } from "@/components/ui";
import { defaultLocalizationPreferences, defaultRegionalHealthProfile } from "@/features/onboarding/onboardingData";
import { OnboardingScaffold, OnboardingTextField } from "@/features/onboarding/OnboardingScaffold";

export default function RegionLanguageScreen() {
  const units = defaultLocalizationPreferences.units;

  return (
    <OnboardingScaffold nextHref="/onboarding/health-goals" stepLabel="Localization" title="Region, language, and units" subtitle="Health OS uses these preferences for display units and country-aware health source routing.">
      <OnboardingTextField label="Country" value={defaultRegionalHealthProfile.regionName} />
      <OnboardingTextField label="Language" value={defaultLocalizationPreferences.language} />
      <OnboardingTextField label="AI language" value={defaultLocalizationPreferences.aiLanguage} />
      <HealthCard privacy="private" title="Unit preview" description={`Weight ${units.weight}, height ${units.height}, distance ${units.distance}, water ${units.water}, temperature ${units.temperature}, time ${units.timeFormat}.`} />
      <HealthCard privacy="private" title="Video language note" description="Some public creator videos may be in English. Captions or alternate audio depend on creator availability." />
    </OnboardingScaffold>
  );
}
