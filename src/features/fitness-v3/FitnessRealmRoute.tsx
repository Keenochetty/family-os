import { useRouter } from "expo-router";
import type { JSX } from "react";

import { FitnessRealm } from "@/features/fitness-v3/FitnessRealm";
import type { FitnessTab } from "@/features/fitness-v3/types";
import { useAppTheme } from "@/lib/theme";

const tabRoutes: Record<FitnessTab, "/fitness/today" | "/fitness/train" | "/fitness/explore" | "/fitness/progress"> = {
  explore: "/fitness/explore",
  progress: "/fitness/progress",
  today: "/fitness/today",
  train: "/fitness/train",
};

type FitnessRealmRouteProps = {
  initialTab?: FitnessTab;
};

export function FitnessRealmRoute({ initialTab = "today" }: FitnessRealmRouteProps): JSX.Element {
  const router = useRouter();
  const { isDark } = useAppTheme();

  return (
    <FitnessRealm
      initialTab={initialTab}
      onStartWorkout={() => router.push("/fitness/session/placeholder-session-upper-push")}
      onTabChange={(tab) => router.replace(tabRoutes[tab])}
      themeMode={isDark ? "dark" : "light"}
    />
  );
}
