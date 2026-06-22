import { FitnessWorkoutActivity } from "@/features/fitness/live/FitnessWorkoutActivity.ios";
import type {
  FitnessLiveActivityState,
  FitnessWorkoutActivityHandle,
} from "@/features/fitness/live/workoutActivityTypes";

export async function startWorkoutLiveActivity(state: FitnessLiveActivityState): Promise<FitnessWorkoutActivityHandle | null> {
  const activity = FitnessWorkoutActivity.start(state, `familyos://fitness/session/${state.sessionId}`);

  return {
    async end(finalState) {
      await activity.end("immediate", finalState, new Date());
    },
    async update(nextState) {
      await activity.update(nextState);
    },
  };
}
