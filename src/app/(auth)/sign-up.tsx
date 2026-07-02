import { HealthCard } from "@/components/ui";
import { OnboardingScaffold, OnboardingTextField } from "@/features/onboarding/OnboardingScaffold";

export default function SignUpScreen() {
  return (
    <OnboardingScaffold nextHref="/verify-phone" primaryLabel="Create account" stepLabel="Account" title="Create your private account" subtitle="Your account protects health records, family sharing, AI chats, documents, scans, and Moments.">
      <OnboardingTextField label="Name" value="Keeno" />
      <OnboardingTextField label="Email" value="keeno@example.com" />
      <OnboardingTextField label="Phone number" value="+27 82 000 0000" />
      <HealthCard privacy="private" title="Why phone is required" description="Phone verification helps protect family invites, caregiver access, and account recovery. It is not used to share health data automatically." />
    </OnboardingScaffold>
  );
}
