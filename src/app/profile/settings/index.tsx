import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { SettingsScreen } from "@/features/profile";

export default function SettingsRoute(): JSX.Element {
  return (
    <PageShell title="Settings">
      <SettingsScreen />
    </PageShell>
  );
}
