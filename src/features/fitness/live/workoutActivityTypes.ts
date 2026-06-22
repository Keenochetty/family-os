export type FitnessWorkoutActivityPhase = "work" | "rest" | "paused" | "complete";

export type FitnessLiveActivityState = {
  elapsedSeconds: number;
  exerciseIndex: number;
  exerciseName: string;
  exerciseTotal: number;
  heartRate?: number;
  heartRateFreshness?: "live" | "stale" | "unavailable";
  phase: FitnessWorkoutActivityPhase;
  remainingSeconds?: number;
  setIndex: number;
  setTotal: number;
  sessionId: string;
  workoutId: string;
  workoutName: string;
};

export type FitnessWorkoutActivityHandle = {
  end: (finalState: FitnessLiveActivityState) => Promise<void>;
  update: (state: FitnessLiveActivityState) => Promise<void>;
};
