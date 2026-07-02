import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { DataSourcesScreen } from "@/features/devices";

export default function DataSourcesRoute(): JSX.Element {
  return (
    <PageShell title="Data sources">
      <DataSourcesScreen />
    </PageShell>
  );
}
