import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { NotificationSettingsScreen } from "@/features/notifications";

export default function NotificationSettingsRoute(): JSX.Element {
  return (
    <PageShell title="Notifications">
      <NotificationSettingsScreen />
    </PageShell>
  );
}
