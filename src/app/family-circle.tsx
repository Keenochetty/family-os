import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { FamilyScreen } from "@/features/family";

export default function FamilyCircleScreen(): JSX.Element {
<<<<<<< Updated upstream
  return <PageShell />;
=======
  return (
    <PageShell title="Family">
      <FamilyScreen />
    </PageShell>
  );
>>>>>>> Stashed changes
}
