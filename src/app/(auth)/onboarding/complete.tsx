import { HealthCard } from "@/components/ui";
import { OnboardingScaffold } from "@/features/onboarding/OnboardingScaffold";

export default function CompleteScreen() {
  return (
    <OnboardingScaffold nextHref="/" primaryLabel="Go to Home" stepLabel="Complete" title="Health OS is ready" subtitle="Your mock setup is complete. The next screen can show what matters today without becoming a dashboard dump.">
      <HealthCard privacy="private" title="Private by default" description="Your records, scans, AI chats, child data, and Moments stay private unless you explicitly share them." />
      <HealthCard privacy="private" title="Next build phase" description="Home and Smart Header can now use onboarding choices, Top 4 realms, privacy labels, and feature gates." />
    </OnboardingScaffold>
  );
}
