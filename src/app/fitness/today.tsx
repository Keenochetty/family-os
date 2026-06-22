import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { FitnessTodayScreen } from "@/features/fitness/screens/FitnessTodayScreen";

export default function FitnessTodayRoute(): JSX.Element {
  return (
    <PageShell title="Fitness">
      <FitnessTodayScreen initialTab="today" />
    </PageShell>
  );
}
