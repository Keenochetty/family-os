import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { NotificationsScreen } from "@/features/notifications";

export default function NotificationsRoute(): JSX.Element {
  return (
    <PageShell title="Notifications">
      <NotificationsScreen />
    </PageShell>
  );
}
