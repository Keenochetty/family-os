import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { SupportSessionConsentScreen } from "@/features/privacy";

export default function SupportSessionRoute(): JSX.Element {
  return (
    <PageShell title="Support session">
      <SupportSessionConsentScreen />
    </PageShell>
  );
}
