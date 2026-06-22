import { requireNativeModule } from "expo-modules-core";

import type {
  FitnessLiveActivityState,
  FitnessWorkoutActivityHandle,
} from "@/features/fitness/live/workoutActivityTypes";

type ExpoWorkoutActivityModule = {
  startWorkoutActivity: (state: FitnessLiveActivityState) => Promise<void>;
  stopWorkoutActivity: () => Promise<void>;
  updateWorkoutActivity: (state: FitnessLiveActivityState) => Promise<void>;
};

const ExpoWorkoutActivity = requireNativeModule<ExpoWorkoutActivityModule>("ExpoWorkoutActivity");

export async function startWorkoutLiveActivity(state: FitnessLiveActivityState): Promise<FitnessWorkoutActivityHandle | null> {
  await ExpoWorkoutActivity.startWorkoutActivity(state);

  return {
    async end(finalState) {
      await ExpoWorkoutActivity.updateWorkoutActivity(finalState);
      await ExpoWorkoutActivity.stopWorkoutActivity();
    },
    async update(nextState) {
      await ExpoWorkoutActivity.updateWorkoutActivity(nextState);
    },
  };
}
