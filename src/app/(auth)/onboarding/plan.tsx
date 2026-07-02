import { useState } from "react";

import { onboardingPlans } from "@/features/onboarding/onboardingData";
import { OnboardingScaffold, SelectableCard } from "@/features/onboarding/OnboardingScaffold";

export default function PlanScreen() {
  const [selected, setSelected] = useState(onboardingPlans[0].id);

  return (
    <OnboardingScaffold nextHref="/onboarding/complete" primaryLabel="Continue with plan" stepLabel="Plan" title="Choose a starting plan" subtitle="Plan gates should show safe previews only and never leak private health or family data.">
      {onboardingPlans.map((plan) => (
        <SelectableCard key={plan.id} title={plan.title} description={plan.description} selected={selected === plan.id} onPress={() => setSelected(plan.id)} />
      ))}
    </OnboardingScaffold>
  );
}
