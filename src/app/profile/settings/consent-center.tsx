import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { ConsentCenterScreen } from "@/features/privacy";

export default function ProfileConsentCenterRoute(): JSX.Element {
  return (
    <PageShell title="Consent center">
      <ConsentCenterScreen />
    </PageShell>
  );
}
