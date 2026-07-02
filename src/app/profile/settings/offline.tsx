import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { OfflineSettingsScreen } from "@/features/data-management";

export default function OfflineSettingsRoute(): JSX.Element {
  return (
    <PageShell title="Offline settings">
      <OfflineSettingsScreen />
    </PageShell>
  );
}
