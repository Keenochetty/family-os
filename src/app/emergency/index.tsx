import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { EmergencyProfileScreen } from "@/features/data-management";

export default function EmergencyProfileRoute(): JSX.Element {
  return (
    <PageShell title="Emergency profile">
      <EmergencyProfileScreen />
    </PageShell>
  );
}
