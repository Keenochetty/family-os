import { HealthCard } from "@/components/ui";
import { OnboardingScaffold, OnboardingTextField } from "@/features/onboarding/OnboardingScaffold";

export default function VerifyPhoneScreen() {
  return (
    <OnboardingScaffold nextHref="/account-confirm" primaryLabel="Verify code" stepLabel="Phone verification" title="Confirm your number" subtitle="Enter the mock code sent to your phone. Real SMS verification will be handled by the backend later.">
      <OnboardingTextField label="Verification code" value="123456" />
      <HealthCard privacy="private" title="Server TODO" description="Validate phone codes server-side, rate-limit attempts, and store consent/audit records for family invite safety." />
    </OnboardingScaffold>
  );
}
