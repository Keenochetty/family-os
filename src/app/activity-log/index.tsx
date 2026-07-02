import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { ActivityLogScreen } from "@/features/privacy";

export default function ActivityLogRoute(): JSX.Element {
  return (
    <PageShell title="Activity log">
      <ActivityLogScreen />
    </PageShell>
  );
}
