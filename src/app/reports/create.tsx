import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { CreateReportScreen } from "@/features/data-management";

export default function CreateReportRoute(): JSX.Element {
  return (
    <PageShell title="Create report">
      <CreateReportScreen />
    </PageShell>
  );
}
