import { HealthCard } from "@/components/ui";
import { OnboardingScaffold } from "@/features/onboarding/OnboardingScaffold";

export default function WelcomeScreen() {
  return (
    <OnboardingScaffold
      nextHref="/sign-up"
      primaryLabel="Start setup"
      stepLabel="Health OS"
      title="Your family health OS"
      subtitle="A calm place for health, care, records, AI help, and family moments. Private by default, shared only by choice."
    >
      <HealthCard title="What happens next" privacy="private" description="Create an account, verify your phone, choose your region and units, then set your first four health realms." />
      <HealthCard title="Already have an account?" privacy="private" description="Use Sign in to continue without showing private records before authentication." />
    </OnboardingScaffold>
  );
}
