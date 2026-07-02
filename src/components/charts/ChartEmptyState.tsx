import type { JSX } from "react";

import { EmptyState } from "@/components/ui";

export function ChartEmptyState(): JSX.Element {
  return <EmptyState title="No chart data" message="Add a private record to build this chart." />;
}
