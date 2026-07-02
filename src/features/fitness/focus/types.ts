export type FocusMode = "guided" | "compact";

export type WorkoutPhase =
  | "preparing"
  | "active-set"
  | "timed-work"
  | "resting"
  | "paused"
  | "exercise-complete"
  | "workout-complete"
  | "restored-session"
  | "offline"
  | "persistence-error"
  | "sensor-unavailable"
  | "sensor-stale"
  | "caution"
  | "pain-reported";

export type FeelingState = "strong" | "expected" | "low-energy" | "sore";

export type EffortFeedback = "too-easy" | "good" | "too-hard" | "pain";

export type SetKind = "planned" | "repeat" | "progression" | "back-off" | "custom";

export type WorkoutSet = {
  id: string;
  kind: SetKind;
  plannedWeightKg?: number;
  plannedReps?: number;
  chosenWeightKg?: number;
  chosenReps?: number;
  completedWeightKg?: number;
  completedReps?: number;
  rpe?: number;
  completed: boolean;
};

export type WorkoutExercise = {
  id: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  cue: string;
  mediaUri?: string;
  restSeconds: number;
  sets: WorkoutSet[];
};

export type WorkoutSession = {
  id: string;
  title: string;
  phase: WorkoutPhase;
  focusMode: FocusMode;
  exerciseIndex: number;
  setIndex: number;
  startedAt: number;
  accumulatedPausedMs: number;
  restStartedAt?: number;
  restDurationSeconds?: number;
  exercises: WorkoutExercise[];
  feeling?: FeelingState;
  feedback?: EffortFeedback;
  notes?: string;
};
