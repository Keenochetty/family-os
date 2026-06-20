import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { SmartDailyHeader } from "@/components/SmartDailyHeader";

export default function HomeScreen(): JSX.Element {
  return (
    <PageShell>
      <SmartDailyHeader />
    </PageShell>
  );
}
