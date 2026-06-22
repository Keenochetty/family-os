export type FitnessTab = "today" | "train" | "explore" | "progress";

export type BodyMapVariant = "male" | "female";

export type BodyMapSide = "front" | "back";

export type MuscleHeatValue = {
  muscleId: string;
  load: 0 | 1 | 2 | 3 | 4;
  state?: "trained" | "sore" | "recovering" | "target";
};

export type FitnessWorkout = {
  id: string;
  planName: string;
  title: string;
  sessionLabel: string;
  durationMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  equipment: string[];
  muscles: string[];
  progressPercent: number;
  status: "scheduled" | "inProgress" | "completed" | "rest";
};

export type FitnessReadiness = {
  energy: number;
  sleep: number;
  soreness: number;
  stress: number;
  recommendation: string;
};

export type FitnessMetric = {
  label: string;
  value: string;
  detail: string;
  tone: "accent" | "success" | "recovery" | "info";
};

export type MoveFuelMetric = {
  label: string;
  value: string;
  detail: string;
  progressPercent: number;
  source: string;
  freshness: string;
  actions: string[];
};

export type FitnessTodayData = {
  selectedDateLabel: string;
  week: {
    day: string;
    date: string;
    state: "selected" | "today" | "scheduled" | "completed" | "rest";
  }[];
  workout: FitnessWorkout;
  readiness: FitnessReadiness;
  metrics: FitnessMetric[];
  move: MoveFuelMetric;
  fuel: MoveFuelMetric;
  muscleHeat: MuscleHeatValue[];
};

export type FitnessPlanSession = {
  id: string;
  title: string;
  dayLabel: string;
  durationMinutes: number;
  focus: string;
  state: "next" | "scheduled" | "rest";
};

export type FitnessPlanSummary = {
  name: string;
  goal: string;
  weekLabel: string;
  completionPercent: number;
  expectedWeeklyTime: string;
  nextSession: string;
  sessions: FitnessPlanSession[];
};

export type FitnessExploreItem = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  durationLabel: string;
  category: "For you" | "Short workouts" | "No equipment" | "Recovery";
};

export type FitnessProgressMetric = {
  label: string;
  value: string;
  detail: string;
  trend: number[];
};

export type FitnessPlanRailItem = {
  id: string;
  title: string;
  subtitle: string;
  label: string;
  tone: "accent" | "recovery" | "success" | "info";
};

export type FitnessAchievement = {
  id: string;
  title: string;
  detail: string;
  level: "small" | "milestone" | "personalRecord" | "planCompletion";
};

export type FitnessExercise = {
  id: string;
  name: string;
  cue: string;
  muscleTags: string[];
  plannedSets: number;
  loggedSets: number;
  target: string;
  restSeconds: number;
};

export type FitnessAdjustmentOption = {
  id: string;
  title: string;
  detail: string;
  durationLabel: string;
  tone: "accent" | "recovery" | "info" | "success";
};

export type FitnessWeeklyGoalDay = {
  day: "S" | "M" | "T" | "W" | "T2" | "F" | "S2";
  planned: boolean;
  completed: boolean;
};

export type FitnessPlanSetting = {
  label: string;
  value: string;
  tone: "accent" | "recovery" | "info" | "success";
};

export type FitnessPlanCalendarDay = {
  dayLabel: string;
  dateLabel: string;
  focus: string;
  status: "completed" | "next" | "scheduled" | "rest";
};

export type FitnessSubstitution = {
  id: string;
  title: string;
  detail: string;
  durationLabel: string;
  tone: "accent" | "recovery" | "info" | "success";
};

export type FitnessDeviceStatus = {
  id: string;
  label: string;
  state: "connected" | "manual" | "permission-needed" | "unavailable";
  source: string;
  freshness: string;
  actionLabel: string;
};

export type FitnessProgressRange = "Week" | "Month" | "3 months" | "Year";

export type FitnessProgressOverview = {
  label: string;
  value: string;
  detail: string;
  tone: "accent" | "recovery" | "info" | "success";
};

export type FitnessWeightDirection = {
  action: string;
  metrics: { label: string; value: string }[];
  summary: string;
  trendLabel: string;
};

export type FitnessAchievementRecord = {
  id: string;
  category: "Consistency" | "Strength" | "Endurance" | "Mobility" | "Recovery";
  detail: string;
  title: string;
  unlocked: boolean;
};
