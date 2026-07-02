import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { SubscriptionScreen } from "@/features/subscription";

export default function PlanRoute(): JSX.Element {
  return (
    <PageShell title="Plan">
      <SubscriptionScreen />
    </PageShell>
  );
}
