import { useState } from "react";

import { accountTypeOptions } from "@/features/onboarding/onboardingData";
import { OnboardingScaffold, SelectableCard } from "@/features/onboarding/OnboardingScaffold";

export default function AccountTypeScreen() {
  const [selected, setSelected] = useState(accountTypeOptions[0].id);

  return (
    <OnboardingScaffold nextHref="/onboarding/region-language" stepLabel="Profile type" title="How will you use Health OS?" subtitle="This only shapes setup. Permissions are still explicit and private by default.">
      {accountTypeOptions.map((option) => (
        <SelectableCard key={option.id} title={option.title} description={option.description} selected={selected === option.id} onPress={() => setSelected(option.id)} />
      ))}
    </OnboardingScaffold>
  );
}
