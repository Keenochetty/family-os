import { requireNativeModule } from "expo-modules-core";

export type AndroidWorkoutActivityState = {
  completedSets: number;
  elapsedSeconds: number;
  exerciseName: string;
  heartRate?: number;
  phase: "work" | "rest" | "paused" | "complete";
  remainingSeconds?: number;
  sessionId: string;
  totalSets: number;
  workoutName: string;
};

type ExpoWorkoutActivityModule = {
  startWorkoutActivity: (state: AndroidWorkoutActivityState) => Promise<void>;
  stopWorkoutActivity: () => Promise<void>;
  updateWorkoutActivity: (state: AndroidWorkoutActivityState) => Promise<void>;
};

const ExpoWorkoutActivity = requireNativeModule<ExpoWorkoutActivityModule>("ExpoWorkoutActivity");

export function startWorkoutActivity(state: AndroidWorkoutActivityState): Promise<void> {
  return ExpoWorkoutActivity.startWorkoutActivity(state);
}

export function updateWorkoutActivity(state: AndroidWorkoutActivityState): Promise<void> {
  return ExpoWorkoutActivity.updateWorkoutActivity(state);
}

export function stopWorkoutActivity(): Promise<void> {
  return ExpoWorkoutActivity.stopWorkoutActivity();
}
