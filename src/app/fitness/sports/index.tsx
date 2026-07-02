import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { SportsScreen } from "@/features/sports";

export default function SportsRoute(): JSX.Element {
  return (
    <PageShell title="Sports">
      <SportsScreen />
    </PageShell>
  );
}
