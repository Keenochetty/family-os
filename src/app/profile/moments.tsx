import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { MomentsScreen } from "@/features/moments";

export default function MomentsRoute(): JSX.Element {
  return (
    <PageShell title="Moments">
      <MomentsScreen />
    </PageShell>
  );
}
