import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { PrivacyDashboardScreen } from "@/features/privacy";

export default function PrivacySettingsRoute(): JSX.Element {
  return (
    <PageShell title="Privacy and sharing">
      <PrivacyDashboardScreen />
    </PageShell>
  );
}
