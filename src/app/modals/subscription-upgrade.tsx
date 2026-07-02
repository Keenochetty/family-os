import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { UpgradeSheetScreen } from "@/features/subscription";

export default function SubscriptionUpgradeRoute(): JSX.Element {
  return (
    <PageShell title="Upgrade">
      <UpgradeSheetScreen />
    </PageShell>
  );
}
