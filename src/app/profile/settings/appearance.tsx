import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { AppearanceScreen } from "@/features/profile";

export default function AppearanceRoute(): JSX.Element {
  return (
    <PageShell title="Appearance">
      <AppearanceScreen />
    </PageShell>
  );
}
