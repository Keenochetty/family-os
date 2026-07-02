import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { ArticleSheetScreen } from "@/features/articles";

export default function ArticleSheetRoute(): JSX.Element {
  return (
    <PageShell title="Article">
      <ArticleSheetScreen />
    </PageShell>
  );
}
