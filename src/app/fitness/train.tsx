import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { FitnessTodayScreen } from "@/features/fitness/screens/FitnessTodayScreen";

export default function FitnessTrainRoute(): JSX.Element {
  return (
    <PageShell title="Fitness">
      <FitnessTodayScreen initialTab="train" />
    </PageShell>
  );
}
