import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { ConnectedDevicesScreen } from "@/features/devices";

export default function ConnectedDevicesRoute(): JSX.Element {
  return (
    <PageShell title="Connected devices">
      <ConnectedDevicesScreen />
    </PageShell>
  );
}
