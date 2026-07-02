import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
<<<<<<< Updated upstream

export default function HomeScreen(): JSX.Element {
  return <PageShell />;
=======
import { SmartDailyHeader } from "@/components/SmartDailyHeader";
import { HomeDashboard } from "@/features/home/HomeDashboard";

export default function HomeScreen(): JSX.Element {
  return (
    <PageShell>
      <SmartDailyHeader
        context={{
          enabledModules: ["babyChild", "cycle", "family", "pregnancy"],
        }}
      >
        <HomeDashboard />
      </SmartDailyHeader>
    </PageShell>
  );
>>>>>>> Stashed changes
}
