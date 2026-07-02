import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { DataExportScreen } from "@/features/data-management";

export default function DataExportRoute(): JSX.Element {
  return (
    <PageShell title="Export data">
      <DataExportScreen />
    </PageShell>
  );
}
