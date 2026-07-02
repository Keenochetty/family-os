import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { DataImportScreen } from "@/features/data-management";

export default function DataImportRoute(): JSX.Element {
  return (
    <PageShell title="Import data">
      <DataImportScreen />
    </PageShell>
  );
}
