import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { ProfileScreen } from "@/features/profile";

export default function ProfileRoute(): JSX.Element {
  return (
    <PageShell title="Profile">
      <ProfileScreen />
    </PageShell>
  );
}
