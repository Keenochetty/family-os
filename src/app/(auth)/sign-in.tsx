import { ActionButton, HealthCard } from "@/components/ui";
import { OnboardingScaffold, OnboardingTextField } from "@/features/onboarding/OnboardingScaffold";

export default function SignInScreen() {
  return (
    <OnboardingScaffold nextHref="/" primaryLabel="Continue to Home" stepLabel="Secure access" title="Sign in" subtitle="Mock sign-in UI only. Private routes still need real server-side auth before backend data is shown.">
      <OnboardingTextField label="Email or phone" value="keeno@example.com" />
      <OnboardingTextField label="Password" value="********" />
      <HealthCard privacy="private" title="Security TODO" description="Add real authentication, session storage, passkey/2FA support, and server-side validation later." />
      <ActionButton label="Create account instead" variant="secondary" />
    </OnboardingScaffold>
  );
}
