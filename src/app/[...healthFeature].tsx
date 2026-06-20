import type { JSX } from "react";
import { usePathname } from "expo-router";

import { HealthFeaturePlaceholderScreen } from "@/features/health/components/HealthFeaturePlaceholderScreen";
import { getHealthRealmConfigByRoute, getHealthRealmConfig } from "@/features/health/config/healthRealmRegistry";

export default function HealthFeaturePlaceholderRoute(): JSX.Element {
  const pathname = usePathname();
  const config = getHealthRealmConfigByRoute(pathname) ?? getHealthRealmConfig("health_overview");

  return <HealthFeaturePlaceholderScreen config={config} />;
}
