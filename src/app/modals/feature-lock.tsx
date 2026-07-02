import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { UpgradeSheetScreen } from "@/features/subscription";

export default function FeatureLockRoute(): JSX.Element {
  return (
    <PageShell title="Feature lock">
      <UpgradeSheetScreen />
    </PageShell>
  );
}
