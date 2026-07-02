import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { ArticlesSourcesScreen } from "@/features/articles";

export default function ArticlesSourcesRoute(): JSX.Element {
  return (
    <PageShell title="Articles and sources">
      <ArticlesSourcesScreen />
    </PageShell>
  );
}
