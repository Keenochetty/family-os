import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { FitnessRealmRoute } from "@/features/fitness-v3/FitnessRealmRoute";

export default function FitnessProgressRoute(): JSX.Element {
  return (
    <PageShell>
      <FitnessRealmRoute initialTab="progress" />
    </PageShell>
  );
}
