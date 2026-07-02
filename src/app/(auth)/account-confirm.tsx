import { detectedAccountDetails } from "@/features/onboarding/onboardingData";
import { OnboardingScaffold, OnboardingTextField } from "@/features/onboarding/OnboardingScaffold";

export default function AccountConfirmScreen() {
  return (
    <OnboardingScaffold nextHref="/onboarding/account-type" primaryLabel="Confirm details" stepLabel="Detected details" title="Check your details" subtitle="Confirm or edit detected profile details before Health OS creates your private profile.">
      <OnboardingTextField label="Display name" value={detectedAccountDetails.displayName} />
      <OnboardingTextField label="Email" value={detectedAccountDetails.email} />
      <OnboardingTextField label="Phone" value={detectedAccountDetails.phone} />
    </OnboardingScaffold>
  );
}
