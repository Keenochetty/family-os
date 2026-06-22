import type {
  FitnessAchievement,
  FitnessAdjustmentOption,
  FitnessAchievementRecord,
  FitnessDeviceStatus,
  FitnessExercise,
  FitnessExploreItem,
  FitnessPlanCalendarDay,
  FitnessPlanRailItem,
  FitnessPlanSetting,
  FitnessPlanSummary,
  FitnessProgressOverview,
  FitnessProgressRange,
  FitnessProgressMetric,
  FitnessSubstitution,
  FitnessTodayData,
  FitnessWeeklyGoalDay,
  FitnessWeightDirection,
} from "@/features/fitness/types/fitness";

export const fitnessTodayData: FitnessTodayData = {
  fuel: {
    actions: ["Log meal", "Water"],
    detail: "Protein target on track",
    freshness: "Manual today",
    label: "Fuel",
    progressPercent: 68,
    source: "Nutrition plan",
    value: "68%",
  },
  metrics: [
    {
      detail: "Ready with a shorter warm-up",
      label: "Readiness",
      tone: "recovery",
      value: "82",
    },
    {
      detail: "6,400 step target",
      label: "Steps",
      tone: "info",
      value: "4.8k",
    },
  ],
  move: {
    actions: ["Warm-up", "Walk"],
    detail: "Upper push scheduled",
    freshness: "Updated 8 min ago",
    label: "Move",
    progressPercent: 55,
    source: "Plan + steps",
    value: "42 min",
  },
  muscleHeat: [
    { load: 4, muscleId: "chest", state: "target" },
    { load: 3, muscleId: "front-deltoid", state: "trained" },
    { load: 3, muscleId: "triceps", state: "trained" },
    { load: 2, muscleId: "abs", state: "recovering" },
    { load: 2, muscleId: "upper-back", state: "recovering" },
  ],
  readiness: {
    energy: 4,
    recommendation: "Good day for planned strength work.",
    sleep: 3,
    soreness: 2,
    stress: 2,
  },
  selectedDateLabel: "Today",
  week: [
    { date: "21", day: "S", state: "rest" },
    { date: "22", day: "M", state: "selected" },
    { date: "23", day: "T", state: "scheduled" },
    { date: "24", day: "W", state: "rest" },
    { date: "25", day: "T", state: "scheduled" },
    { date: "26", day: "F", state: "scheduled" },
    { date: "27", day: "S", state: "rest" },
  ],
  workout: {
    difficulty: "Intermediate",
    durationMinutes: 42,
    equipment: ["Dumbbells", "Bench"],
    id: "upper-push-16",
    muscles: ["Chest", "Shoulders", "Triceps"],
    planName: "29-day strength plan",
    progressPercent: 55,
    sessionLabel: "Session 16 of 29",
    status: "scheduled",
    title: "Upper Push Strength",
  },
};

export const fitnessPlanSummary: FitnessPlanSummary = {
  completionPercent: 55,
  expectedWeeklyTime: "3 hr 20 min",
  goal: "Strength and sustainable fat loss",
  name: "29-day strength plan",
  nextSession: "Upper Push Strength",
  sessions: [
    {
      dayLabel: "Today",
      durationMinutes: 42,
      focus: "Chest, shoulders, triceps",
      id: "session-16",
      state: "next",
      title: "Upper Push Strength",
    },
    {
      dayLabel: "Thu",
      durationMinutes: 35,
      focus: "Legs and core",
      id: "session-17",
      state: "scheduled",
      title: "Lower Body Base",
    },
    {
      dayLabel: "Fri",
      durationMinutes: 28,
      focus: "Mobility and recovery",
      id: "session-18",
      state: "scheduled",
      title: "Recovery Flow",
    },
  ],
  weekLabel: "Week 3 of 5",
};

export const fitnessExploreItems: FitnessExploreItem[] = [
  {
    category: "For you",
    durationLabel: "18 min",
    id: "short-strength",
    subtitle: "No-rush dumbbell work",
    tags: ["Strength", "Beginner"],
    title: "Short strength session",
  },
  {
    category: "Recovery",
    durationLabel: "12 min",
    id: "mobility-reset",
    subtitle: "Light recovery for tight shoulders",
    tags: ["Mobility", "Recovery"],
    title: "Desk posture reset",
  },
  {
    category: "No equipment",
    durationLabel: "25 min",
    id: "no-equipment",
    subtitle: "Bodyweight plan for travel days",
    tags: ["No equipment", "Cardio"],
    title: "Hotel room circuit",
  },
  {
    category: "Short workouts",
    durationLabel: "15 min",
    id: "express-cardio",
    subtitle: "Low-impact intervals for busy days",
    tags: ["Cardio", "Short"],
    title: "Express cardio",
  },
  {
    category: "For you",
    durationLabel: "32 min",
    id: "upper-strength",
    subtitle: "Chest and shoulder support work",
    tags: ["Strength", "Intermediate"],
    title: "Upper strength builder",
  },
  {
    category: "Recovery",
    durationLabel: "10 min",
    id: "cooldown",
    subtitle: "Breathing and easy mobility",
    tags: ["Recovery", "Mobility"],
    title: "Post-workout cooldown",
  },
];

export const fitnessProgressMetrics: FitnessProgressMetric[] = [
  {
    detail: "3 of 4 planned sessions",
    label: "Consistency",
    trend: [2, 3, 2, 4, 3, 3],
    value: "75%",
  },
  {
    detail: "Up 18 min from last week",
    label: "Active minutes",
    trend: [90, 110, 96, 128, 140, 158],
    value: "158",
  },
  {
    detail: "Upper body load is rising steadily",
    label: "Strength load",
    trend: [35, 42, 48, 47, 56, 61],
    value: "+12%",
  },
];

export const fitnessPlanRailItems: FitnessPlanRailItem[] = [
  {
    id: "current-plan",
    label: "Current",
    subtitle: "Next: Upper Push Strength",
    title: "29-day strength plan",
    tone: "accent",
  },
  {
    id: "mobility",
    label: "Recovery",
    subtitle: "12 min shoulder and spine reset",
    title: "Mobility add-on",
    tone: "recovery",
  },
  {
    id: "saved",
    label: "Saved",
    subtitle: "No-equipment option for busy days",
    title: "Quick bodyweight circuit",
    tone: "info",
  },
];

export const fitnessTodayAchievement: FitnessAchievement = {
  detail: "Three planned sessions are already lined up this week.",
  id: "weekly-plan-ready",
  level: "small",
  title: "Weekly plan is set",
};

export const fitnessActiveWorkoutExercises: FitnessExercise[] = [
  {
    cue: "Keep shoulder blades pinned and press smoothly.",
    id: "dumbbell-bench",
    loggedSets: 1,
    muscleTags: ["Chest", "Triceps"],
    name: "Dumbbell bench press",
    plannedSets: 4,
    restSeconds: 90,
    target: "10 reps",
  },
  {
    cue: "Control the lowering phase and avoid shrugging.",
    id: "incline-press",
    loggedSets: 0,
    muscleTags: ["Upper chest", "Shoulders"],
    name: "Incline press",
    plannedSets: 3,
    restSeconds: 75,
    target: "8-10 reps",
  },
  {
    cue: "Soft elbows, raise to shoulder height only.",
    id: "lateral-raise",
    loggedSets: 0,
    muscleTags: ["Deltoids"],
    name: "Lateral raise",
    plannedSets: 3,
    restSeconds: 60,
    target: "12 reps",
  },
];

export const fitnessAdjustmentOptions: FitnessAdjustmentOption[] = [
  {
    detail: "Keep the main lifts and reduce accessory work.",
    durationLabel: "25 min",
    id: "shorter",
    title: "Shorter session",
    tone: "accent",
  },
  {
    detail: "Swap bench and dumbbells for bodyweight moves.",
    durationLabel: "No kit",
    id: "no-equipment",
    title: "No equipment",
    tone: "info",
  },
  {
    detail: "Lower intensity and focus on mobility today.",
    durationLabel: "Light",
    id: "recovery",
    title: "Recovery option",
    tone: "recovery",
  },
  {
    detail: "Move this workout and keep the weekly plan tidy.",
    durationLabel: "Tomorrow",
    id: "move",
    title: "Move day",
    tone: "success",
  },
];

export const fitnessWeeklyGoalDays: FitnessWeeklyGoalDay[] = [
  { completed: false, day: "S", planned: false },
  { completed: true, day: "M", planned: true },
  { completed: true, day: "T", planned: true },
  { completed: false, day: "W", planned: false },
  { completed: false, day: "T2", planned: true },
  { completed: false, day: "F", planned: true },
  { completed: false, day: "S2", planned: false },
];

export const fitnessPlanSettings: FitnessPlanSetting[] = [
  { label: "Days/week", tone: "accent", value: "4" },
  { label: "Equipment", tone: "info", value: "Bench + DB" },
  { label: "Location", tone: "success", value: "Home" },
  { label: "Limitations", tone: "recovery", value: "Shoulder aware" },
];

export const fitnessPlanCalendarDays: FitnessPlanCalendarDay[] = [
  { dateLabel: "21", dayLabel: "Sun", focus: "Recovery", status: "rest" },
  { dateLabel: "22", dayLabel: "Mon", focus: "Upper Push", status: "next" },
  { dateLabel: "23", dayLabel: "Tue", focus: "Walk", status: "completed" },
  { dateLabel: "24", dayLabel: "Wed", focus: "Mobility", status: "rest" },
  { dateLabel: "25", dayLabel: "Thu", focus: "Lower Body", status: "scheduled" },
  { dateLabel: "26", dayLabel: "Fri", focus: "Recovery Flow", status: "scheduled" },
  { dateLabel: "27", dayLabel: "Sat", focus: "Optional cardio", status: "rest" },
];

export const fitnessSubstitutions: FitnessSubstitution[] = [
  {
    detail: "Swap pressing volume for controlled floor work.",
    durationLabel: "Shoulder aware",
    id: "floor-press",
    title: "Dumbbell floor press",
    tone: "recovery",
  },
  {
    detail: "Keep the push focus without bench setup.",
    durationLabel: "No bench",
    id: "push-up-ladder",
    title: "Incline push-up ladder",
    tone: "info",
  },
  {
    detail: "Move the session and keep weekly balance intact.",
    durationLabel: "Reschedule",
    id: "move-day",
    title: "Move to Thursday",
    tone: "success",
  },
];

export const fitnessDeviceStatuses: FitnessDeviceStatus[] = [
  {
    actionLabel: "Connect",
    freshness: "Permission not requested",
    id: "steps",
    label: "Steps",
    source: "Device pedometer",
    state: "permission-needed",
  },
  {
    actionLabel: "Train without HR",
    freshness: "No live sensor",
    id: "heart-rate",
    label: "Heart rate",
    source: "Wearable optional",
    state: "unavailable",
  },
  {
    actionLabel: "Edit",
    freshness: "Manual today",
    id: "fuel",
    label: "Fuel",
    source: "Nutrition plan",
    state: "manual",
  },
];

export const fitnessProgressRanges: FitnessProgressRange[] = ["Week", "Month", "3 months", "Year"];

export const fitnessProgressOverview: FitnessProgressOverview[] = [
  { detail: "3 of 4 planned sessions", label: "Consistency", tone: "success", value: "75%" },
  { detail: "Manual and plan data", label: "Active minutes", tone: "accent", value: "158" },
  { detail: "Upper body trend", label: "Strength load", tone: "info", value: "+12%" },
  { detail: "Average this week", label: "Steps", tone: "recovery", value: "6.4k" },
];

export const fitnessWeightDirection: FitnessWeightDirection = {
  action: "Keep the same four movement days and review protein after the next session.",
  metrics: [
    { label: "Movement days", value: "3/4" },
    { label: "Strength", value: "2 sessions" },
    { label: "Avg steps", value: "6.4k" },
    { label: "Nutrition", value: "On track" },
  ],
  summary: "Weight-loss mode stays focused on sustainable weekly actions, not daily judgement.",
  trendLabel: "This week's direction",
};

export const fitnessAchievementRecords: FitnessAchievementRecord[] = [
  {
    category: "Consistency",
    detail: "Completed three planned movement days this week.",
    id: "three-days",
    title: "Three-day rhythm",
    unlocked: true,
  },
  {
    category: "Strength",
    detail: "Logged every planned set in the upper push session.",
    id: "full-set-log",
    title: "Full set log",
    unlocked: false,
  },
  {
    category: "Recovery",
    detail: "Added mobility after strength work.",
    id: "recovery-add-on",
    title: "Recovery add-on",
    unlocked: true,
  },
];
