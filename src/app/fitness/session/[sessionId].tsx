import { useLocalSearchParams } from "expo-router";
import type { JSX } from "react";

import { WorkoutFocusScreen } from "@/features/fitness/focus";

export default function FitnessSessionRoute(): JSX.Element {
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();

  return <WorkoutFocusScreen sessionId={sessionId ?? "placeholder-session"} />;
}
