import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { PrivacyReviewScreen } from "@/features/privacy";

export default function PrivacyReviewRoute(): JSX.Element {
  return (
    <PageShell title="Privacy review">
      <PrivacyReviewScreen />
    </PageShell>
  );
}
