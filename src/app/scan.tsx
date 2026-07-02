import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { ScanScreen as ScanScreenContent } from "@/features/scan";

export default function ScanScreen(): JSX.Element {
<<<<<<< Updated upstream
  return <PageShell />;
=======
  return (
    <PageShell title="Scan">
      <ScanScreenContent />
    </PageShell>
  );
>>>>>>> Stashed changes
}
