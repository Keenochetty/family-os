export type FitnessGoal = "general-health" | "weight-loss" | "strength" | "muscle-gain" | "endurance" | "mobility" | "recovery";

export type FitnessRealmTab = "today" | "train" | "explore" | "progress";

export type ReadinessState = "ready" | "adjust" | "recover" | "unknown";

export type WorkoutScheduleState = "planned" | "complete" | "moved" | "rest" | "recovery" | "missed" | "flex";

export type AttentionReason = "first-primary-action" | "new-recommendation" | "state-change" | "completion" | "warning" | "none";

export type FitnessProgramme = {
  daysPerWeek: number;
  goal: string;
  id: string;
  imageUri?: string;
  level: "beginner" | "intermediate" | "advanced";
  minutesPerSession: number;
  title: string;
  weeks: number;
};
