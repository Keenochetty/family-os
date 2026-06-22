import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { FitnessTodayScreen } from "@/features/fitness/screens/FitnessTodayScreen";

export default function FitnessExploreRoute(): JSX.Element {
  return (
    <PageShell title="Fitness">
      <FitnessTodayScreen initialTab="explore" />
    </PageShell>
  );
}
