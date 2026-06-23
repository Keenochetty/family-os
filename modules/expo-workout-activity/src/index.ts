import { requireOptionalNativeModule } from "expo-modules-core";

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

const ExpoWorkoutActivity = requireOptionalNativeModule<ExpoWorkoutActivityModule>("ExpoWorkoutActivity");

export function startWorkoutActivity(state: AndroidWorkoutActivityState): Promise<void> {
  if (!ExpoWorkoutActivity) {
    return Promise.resolve();
  }

  return ExpoWorkoutActivity.startWorkoutActivity(state);
}

export function updateWorkoutActivity(state: AndroidWorkoutActivityState): Promise<void> {
  if (!ExpoWorkoutActivity) {
    return Promise.resolve();
  }

  return ExpoWorkoutActivity.updateWorkoutActivity(state);
}

export function stopWorkoutActivity(): Promise<void> {
  if (!ExpoWorkoutActivity) {
    return Promise.resolve();
  }

  return ExpoWorkoutActivity.stopWorkoutActivity();
}
