import { HealthCard } from "@/components/ui";
import { permissionPreviewItems } from "@/features/onboarding/onboardingData";
import { OnboardingScaffold, OnboardingNote } from "@/features/onboarding/OnboardingScaffold";

export default function PermissionsPreviewScreen() {
  return (
    <OnboardingScaffold nextHref="/onboarding/circle-setup" stepLabel="Permissions" title="Preview permissions" subtitle="Health OS explains permissions before requesting them. No real OS permissions are requested in this mock flow.">
      {permissionPreviewItems.map((item) => (
        <HealthCard key={item} privacy="private" title="Permission preview" description={item} />
      ))}
      <OnboardingNote title="Consent TODO" message="Store consent records server-side before enabling health data sync, contacts, camera scans, support sessions, or family sharing." />
    </OnboardingScaffold>
  );
}
