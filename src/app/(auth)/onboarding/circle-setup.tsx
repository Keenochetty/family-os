import { HealthCard } from "@/components/ui";
import { OnboardingScaffold, OnboardingTextField } from "@/features/onboarding/OnboardingScaffold";

export default function CircleSetupScreen() {
  return (
    <OnboardingScaffold nextHref="/onboarding/avatar" primaryLabel="Create private circle" stepLabel="Family circle" title="Set up your first circle" subtitle="Start with a private household circle. Invites, roles, permissions, and expiry come later.">
      <OnboardingTextField label="Circle name" value="Household" />
      <OnboardingTextField label="Your role" value="Owner" />
      <HealthCard privacy="private" title="Sharing default" description="No records, documents, child data, AI chats, or Moments are shared when this circle is created." />
      <HealthCard privacy="private" title="Backend TODO" description="Create circle ownership, member roles, permission sets, invite expiry, and audit events server-side." />
    </OnboardingScaffold>
  );
}
