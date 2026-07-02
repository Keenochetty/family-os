import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { ReportsScreen } from "@/features/data-management";

export default function ReportsRoute(): JSX.Element {
  return (
    <PageShell title="Reports">
      <ReportsScreen />
    </PageShell>
  );
}
