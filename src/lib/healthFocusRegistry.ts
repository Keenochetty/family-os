import type { Href } from "expo-router";

export type HealthFocusCategory =
  | "nutrition"
  | "medication"
  | "fitness"
  | "generalHealth"
  | "womenHealth"
  | "pregnancy"
  | "babyChild"
  | "family"
  | "records"
  | "scan"
  | "setup";

export type HealthTileVisualType =
  | "pillCount"
  | "fitnessBars"
  | "nutritionConsumption"
  | "waterDrops"
  | "mealStack"
  | "miniSparkline"
  | "miniBars"
  | "timelineDots"
  | "checklistStack"
  | "calendarDots"
  | "familyBubbles"
  | "statusBadge"
  | "setupBadge"
  | "moodWave"
  | "iconMark"
  | "none";

export type WeeklyGoalDay = {
  day: "M" | "T" | "W" | "T2" | "F" | "S" | "S2";
  planned: boolean;
  completed: boolean;
};

export type NutritionConsumptionItem = {
  id: string;
  label: string;
  icon: "bowl" | "smoothie";
  consumed: boolean;
  color?: string;
};

export type HealthVisualData = {
  progress?: number;
  lineData?: number[];
  weeklyGoalDays?: WeeklyGoalDay[];
  nutritionConsumptionItems?: NutritionConsumptionItem[];
};

export type HealthFocusDisplayData = {
  moduleLabel: string;
  displayTitle: string;
  primaryValue: string;
  contextLine: string;
  visualType: HealthTileVisualType;
  visualData?: HealthVisualData;
  isSetupRequired?: boolean;
  updatedAt?: string;
};

export type HealthFocusDataContext = {
  nutrition?: unknown;
  medication?: unknown;
  fitness?: unknown;
  pregnancy?: unknown;
  babyChild?: unknown;
  family?: unknown;
  records?: unknown;
};

export type HealthFocusDefinition = {
  id: string;
  label: string;
  shortLabel?: string;
  category: HealthFocusCategory;
  route: Href;
  accentColor: string;
  lightTileBackground: string;
  darkTileBackground: string;
  iconKey: string;
  emoji?: string;
  visualType: HealthTileVisualType;
  placeholder: HealthFocusDisplayData;
  getLatestDisplayData?: (context: HealthFocusDataContext) => HealthFocusDisplayData;
  visibility?: "all" | "female" | "male" | "child" | "pregnancy" | "family";
  setupRequired?: boolean;
};

export type HealthWidgetSlot = {
  slotId: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  focusId: string;
};

export const DEFAULT_NUTRITION_CONSUMPTION_ITEMS: NutritionConsumptionItem[] = [
  { color: "#35A96B", consumed: true, icon: "bowl", id: "breakfast", label: "Breakfast" },
  { color: "#35A96B", consumed: true, icon: "smoothie", id: "morning-smoothie", label: "Morning smoothie" },
  { color: "#35A96B", consumed: true, icon: "bowl", id: "snack-bowl", label: "Snack bowl" },
  { color: "#35A96B", consumed: true, icon: "smoothie", id: "green-smoothie", label: "Green smoothie" },
  { color: "#35A96B", consumed: false, icon: "bowl", id: "lunch", label: "Lunch" },
  { color: "#35A96B", consumed: false, icon: "smoothie", id: "protein-smoothie", label: "Protein smoothie" },
  { color: "#35A96B", consumed: false, icon: "bowl", id: "afternoon-meal", label: "Afternoon meal" },
  { color: "#35A96B", consumed: false, icon: "smoothie", id: "evening-smoothie", label: "Evening smoothie" },
  { color: "#35A96B", consumed: false, icon: "bowl", id: "dinner", label: "Dinner" },
];

export const DEFAULT_WEEKLY_GOAL_DAYS: WeeklyGoalDay[] = [
  { completed: false, day: "S", planned: false },
  { completed: true, day: "M", planned: true },
  { completed: true, day: "T", planned: true },
  { completed: true, day: "W", planned: true },
  { completed: false, day: "T2", planned: true },
  { completed: false, day: "F", planned: true },
  { completed: false, day: "S2", planned: false },
];

export const DEFAULT_HEALTH_WIDGET_SLOTS: HealthWidgetSlot[] = [
  { focusId: "nutrition_overview", slotId: "topLeft" },
  { focusId: "medication_doses", slotId: "topRight" },
  { focusId: "fitness_plan", slotId: "bottomLeft" },
  { focusId: "family_updates", slotId: "bottomRight" },
];

export const HEALTH_FOCUS_CATEGORY_LABELS: Record<HealthFocusCategory, string> = {
  babyChild: "Baby / Child",
  family: "Family",
  fitness: "Fitness",
  generalHealth: "Health",
  medication: "Medication",
  nutrition: "Nutrition",
  pregnancy: "Pregnancy",
  records: "Records",
  scan: "Scan",
  setup: "Setup",
  womenHealth: "Women's Health",
};

const CATEGORY_ORDER: HealthFocusCategory[] = [
  "nutrition",
  "medication",
  "fitness",
  "generalHealth",
  "womenHealth",
  "pregnancy",
  "babyChild",
  "family",
  "records",
  "scan",
  "setup",
];

const DEFAULT_BACKGROUNDS = {
  baby: { dark: "#514036", light: "#F8DDCC" },
  cycle: { dark: "#4D2637", light: "#F4C8DA" },
  fitness: { dark: "#4A342A", light: "#F7D9C2" },
  general: { dark: "#3F3F46", light: "#F8FAFC" },
  medication: { dark: "#294C40", light: "#C9F4D2" },
  nutrition: { dark: "#284539", light: "#CDEFD9" },
  pregnancy: { dark: "#504138", light: "#F1DED2" },
  records: { dark: "#354152", light: "#D8E2F1" },
};

function placeholder(
  data: Omit<HealthFocusDisplayData, "visualData"> & { visualData?: HealthVisualData }
): HealthFocusDisplayData {
  return data;
}

export const HEALTH_FOCUS_REGISTRY: HealthFocusDefinition[] = [
  {
    accentColor: "#35A96B",
    category: "nutrition",
    darkTileBackground: DEFAULT_BACKGROUNDS.nutrition.dark,
    iconKey: "utensils",
    id: "nutrition_overview",
    label: "Nutrition",
    lightTileBackground: DEFAULT_BACKGROUNDS.nutrition.light,
    placeholder: placeholder({
      contextLine: "5 meals + 4 smoothies",
      displayTitle: "Daily consumption",
      moduleLabel: "Nutrition",
      primaryValue: "4/9",
      visualData: { nutritionConsumptionItems: DEFAULT_NUTRITION_CONSUMPTION_ITEMS, progress: 44 },
      visualType: "nutritionConsumption",
    }),
    route: "/food",
    shortLabel: "Daily consumption",
    visualType: "nutritionConsumption",
  },
  {
    accentColor: "#35A96B",
    category: "nutrition",
    darkTileBackground: DEFAULT_BACKGROUNDS.nutrition.dark,
    iconKey: "droplet",
    id: "water_tracking",
    label: "Water",
    lightTileBackground: DEFAULT_BACKGROUNDS.nutrition.light,
    placeholder: placeholder({
      contextLine: "Cups today",
      displayTitle: "Hydration",
      moduleLabel: "Water",
      primaryValue: "5/8",
      visualData: { progress: 63 },
      visualType: "waterDrops",
    }),
    route: "/food",
    visualType: "waterDrops",
  },
  {
    accentColor: "#35A96B",
    category: "nutrition",
    darkTileBackground: DEFAULT_BACKGROUNDS.nutrition.dark,
    iconKey: "bowl",
    id: "meal_logging",
    label: "Meals",
    lightTileBackground: DEFAULT_BACKGROUNDS.nutrition.light,
    placeholder: placeholder({
      contextLine: "Lunch missing",
      displayTitle: "Meal logging",
      moduleLabel: "Meals",
      primaryValue: "2/3",
      visualData: { progress: 67 },
      visualType: "mealStack",
    }),
    route: "/food",
    visualType: "mealStack",
  },
  {
    accentColor: "#219653",
    category: "nutrition",
    darkTileBackground: DEFAULT_BACKGROUNDS.nutrition.dark,
    iconKey: "protein",
    id: "protein_target",
    label: "Protein",
    lightTileBackground: DEFAULT_BACKGROUNDS.nutrition.light,
    placeholder: placeholder({
      contextLine: "120g target",
      displayTitle: "Daily target",
      moduleLabel: "Protein",
      primaryValue: "70g",
      visualData: { progress: 58 },
      visualType: "miniBars",
    }),
    route: "/food",
    visualType: "miniBars",
  },
  {
    accentColor: "#56C596",
    category: "medication",
    darkTileBackground: DEFAULT_BACKGROUNDS.medication.dark,
    iconKey: "pill",
    id: "medication_doses",
    label: "Medication",
    lightTileBackground: DEFAULT_BACKGROUNDS.medication.light,
    placeholder: placeholder({
      contextLine: "Next dose 19:00",
      displayTitle: "Antibiotic course",
      moduleLabel: "Medication",
      primaryValue: "3/4",
      visualData: { progress: 75 },
      visualType: "pillCount",
    }),
    route: "/medication",
    visualType: "pillCount",
  },
  {
    accentColor: "#56C596",
    category: "medication",
    darkTileBackground: DEFAULT_BACKGROUNDS.medication.dark,
    iconKey: "refill",
    id: "refill_reminder",
    label: "Refills",
    lightTileBackground: DEFAULT_BACKGROUNDS.medication.light,
    placeholder: placeholder({
      contextLine: "This week",
      displayTitle: "Medication stock",
      moduleLabel: "Refills",
      primaryValue: "1 due",
      visualData: { progress: 35 },
      visualType: "statusBadge",
    }),
    route: "/medication",
    visualType: "statusBadge",
  },
  {
    accentColor: "#A78BFA",
    category: "medication",
    darkTileBackground: "#443A61",
    iconKey: "supplements",
    id: "supplements_today",
    label: "Supplements",
    lightTileBackground: "#E3D8FF",
    placeholder: placeholder({
      contextLine: "Today",
      displayTitle: "Daily stack",
      moduleLabel: "Supplements",
      primaryValue: "2/3",
      visualData: { progress: 66 },
      visualType: "checklistStack",
    }),
    route: "/supplements",
    visualType: "checklistStack",
  },
  {
    accentColor: "#C96A2B",
    category: "fitness",
    darkTileBackground: DEFAULT_BACKGROUNDS.fitness.dark,
    iconKey: "activity",
    id: "fitness_plan",
    label: "Fitness",
    lightTileBackground: DEFAULT_BACKGROUNDS.fitness.light,
    placeholder: placeholder({
      contextLine: "Weekly goal",
      displayTitle: "29-day plan",
      moduleLabel: "Fitness",
      primaryValue: "55%",
      visualData: { progress: 55, weeklyGoalDays: DEFAULT_WEEKLY_GOAL_DAYS },
      visualType: "fitnessBars",
    }),
    route: "/fitness",
    visualType: "fitnessBars",
  },
  {
    accentColor: "#C96A2B",
    category: "fitness",
    darkTileBackground: DEFAULT_BACKGROUNDS.fitness.dark,
    iconKey: "steps",
    id: "steps_today",
    label: "Steps",
    lightTileBackground: DEFAULT_BACKGROUNDS.fitness.light,
    placeholder: placeholder({
      contextLine: "10k target",
      displayTitle: "Daily movement",
      moduleLabel: "Steps",
      primaryValue: "7,200",
      visualData: { lineData: [22, 38, 44, 51, 72], progress: 72 },
      visualType: "miniSparkline",
    }),
    route: "/fitness",
    visualType: "miniSparkline",
  },
  {
    accentColor: "#C96A2B",
    category: "fitness",
    darkTileBackground: DEFAULT_BACKGROUNDS.fitness.dark,
    iconKey: "workout",
    id: "workout_today",
    label: "Workout",
    lightTileBackground: DEFAULT_BACKGROUNDS.fitness.light,
    placeholder: placeholder({
      contextLine: "Planned today",
      displayTitle: "Today's plan",
      moduleLabel: "Workout",
      primaryValue: "Legs",
      visualData: { progress: 50 },
      visualType: "checklistStack",
    }),
    route: "/fitness",
    visualType: "checklistStack",
  },
  {
    accentColor: "#8EA4C8",
    category: "fitness",
    darkTileBackground: DEFAULT_BACKGROUNDS.records.dark,
    iconKey: "weight",
    id: "weight_tracking",
    label: "Weight",
    lightTileBackground: DEFAULT_BACKGROUNDS.records.light,
    placeholder: placeholder({
      contextLine: "Last update",
      displayTitle: "Weekly trend",
      moduleLabel: "Weight",
      primaryValue: "72.4kg",
      visualData: { lineData: [64, 61, 63, 58, 56], progress: 56 },
      visualType: "miniSparkline",
    }),
    route: "/health",
    visualType: "miniSparkline",
  },
  {
    accentColor: "#8EA4C8",
    category: "generalHealth",
    darkTileBackground: DEFAULT_BACKGROUNDS.general.dark,
    iconKey: "health",
    id: "health_alerts",
    label: "Health",
    lightTileBackground: DEFAULT_BACKGROUNDS.general.light,
    placeholder: placeholder({
      contextLine: "Needs attention",
      displayTitle: "Overview",
      moduleLabel: "Health",
      primaryValue: "2 alerts",
      visualData: { progress: 35 },
      visualType: "statusBadge",
    }),
    route: "/health",
    visualType: "statusBadge",
  },
  {
    accentColor: "#EF4444",
    category: "generalHealth",
    darkTileBackground: DEFAULT_BACKGROUNDS.general.dark,
    iconKey: "vitals",
    id: "vitals_latest",
    label: "Vitals",
    lightTileBackground: DEFAULT_BACKGROUNDS.general.light,
    placeholder: placeholder({
      contextLine: "Checked today",
      displayTitle: "Latest reading",
      moduleLabel: "Vitals",
      primaryValue: "78 bpm",
      visualData: { lineData: [52, 58, 54, 62, 57], progress: 57 },
      visualType: "miniSparkline",
    }),
    route: "/health",
    visualType: "miniSparkline",
  },
  {
    accentColor: "#64748B",
    category: "generalHealth",
    darkTileBackground: DEFAULT_BACKGROUNDS.general.dark,
    iconKey: "sleep",
    id: "sleep_summary",
    label: "Sleep",
    lightTileBackground: DEFAULT_BACKGROUNDS.general.light,
    placeholder: placeholder({
      contextLine: "Sleep summary",
      displayTitle: "Last night",
      moduleLabel: "Sleep",
      primaryValue: "6h 45m",
      visualData: { progress: 68 },
      visualType: "timelineDots",
    }),
    route: "/health",
    visualType: "timelineDots",
  },
  {
    accentColor: "#6D7DF2",
    category: "generalHealth",
    darkTileBackground: "#343A64",
    iconKey: "mood",
    id: "mood_checkin",
    label: "Mood",
    lightTileBackground: "#DDE2FF",
    placeholder: placeholder({
      contextLine: "Logged today",
      displayTitle: "Check-in",
      moduleLabel: "Mood",
      primaryValue: "Calm",
      visualData: { lineData: [42, 48, 44, 56, 52, 61, 48], progress: 48 },
      visualType: "moodWave",
    }),
    route: "/mental-health",
    visualType: "moodWave",
  },
  {
    accentColor: "#C2185B",
    category: "womenHealth",
    darkTileBackground: DEFAULT_BACKGROUNDS.cycle.dark,
    iconKey: "cycle",
    id: "cycle_status",
    label: "Cycle",
    lightTileBackground: DEFAULT_BACKGROUNDS.cycle.light,
    placeholder: placeholder({
      contextLine: "Fertile window",
      displayTitle: "Cycle tracking",
      moduleLabel: "Cycle",
      primaryValue: "Day 18",
      visualData: { progress: 62 },
      visualType: "calendarDots",
    }),
    route: "/cycle",
    visibility: "female",
    visualType: "calendarDots",
  },
  {
    accentColor: "#C2185B",
    category: "womenHealth",
    darkTileBackground: DEFAULT_BACKGROUNDS.cycle.dark,
    iconKey: "period",
    id: "period_prediction",
    label: "Period",
    lightTileBackground: DEFAULT_BACKGROUNDS.cycle.light,
    placeholder: placeholder({
      contextLine: "Until expected start",
      displayTitle: "Prediction",
      moduleLabel: "Period",
      primaryValue: "4 days",
      visualData: { progress: 78 },
      visualType: "calendarDots",
    }),
    route: "/cycle",
    visibility: "female",
    visualType: "calendarDots",
  },
  {
    accentColor: "#C2185B",
    category: "womenHealth",
    darkTileBackground: DEFAULT_BACKGROUNDS.cycle.dark,
    iconKey: "contraception",
    id: "contraception_reminder",
    label: "Contraception",
    lightTileBackground: DEFAULT_BACKGROUNDS.cycle.light,
    placeholder: placeholder({
      contextLine: "Tomorrow",
      displayTitle: "Reminder",
      moduleLabel: "Contraception",
      primaryValue: "Active",
      visualData: { progress: 70 },
      visualType: "timelineDots",
    }),
    route: "/cycle",
    visibility: "female",
    visualType: "timelineDots",
  },
  {
    accentColor: "#D8B49C",
    category: "pregnancy",
    darkTileBackground: DEFAULT_BACKGROUNDS.pregnancy.dark,
    iconKey: "pregnancy",
    id: "pregnancy_status",
    label: "Pregnancy",
    lightTileBackground: DEFAULT_BACKGROUNDS.pregnancy.light,
    placeholder: placeholder({
      contextLine: "Next checkup",
      displayTitle: "Pregnancy plan",
      moduleLabel: "Pregnancy",
      primaryValue: "Week 22",
      visualData: { progress: 55 },
      visualType: "timelineDots",
    }),
    route: "/pregnancy",
    visibility: "pregnancy",
    visualType: "timelineDots",
  },
  {
    accentColor: "#D8B49C",
    category: "pregnancy",
    darkTileBackground: DEFAULT_BACKGROUNDS.pregnancy.dark,
    iconKey: "pregnancy-setup",
    id: "pregnancy_setup",
    label: "Pregnancy Setup",
    lightTileBackground: DEFAULT_BACKGROUNDS.pregnancy.light,
    placeholder: placeholder({
      contextLine: "Add due date",
      displayTitle: "Pregnancy setup",
      isSetupRequired: true,
      moduleLabel: "Setup",
      primaryValue: "Start",
      visualData: { progress: 0 },
      visualType: "setupBadge",
    }),
    route: "/pregnancy",
    setupRequired: true,
    visibility: "pregnancy",
    visualType: "setupBadge",
  },
  {
    accentColor: "#D8B49C",
    category: "pregnancy",
    darkTileBackground: DEFAULT_BACKGROUNDS.pregnancy.dark,
    iconKey: "checkup",
    id: "pregnancy_checkup",
    label: "Checkup",
    lightTileBackground: DEFAULT_BACKGROUNDS.pregnancy.light,
    placeholder: placeholder({
      contextLine: "Add appointment",
      displayTitle: "Next appointment",
      moduleLabel: "Checkup",
      primaryValue: "Soon",
      visualData: { progress: 30 },
      visualType: "timelineDots",
    }),
    route: "/pregnancy",
    visibility: "pregnancy",
    visualType: "timelineDots",
  },
  {
    accentColor: "#F4B18A",
    category: "babyChild",
    darkTileBackground: DEFAULT_BACKGROUNDS.baby.dark,
    iconKey: "feeding",
    id: "baby_feeding",
    label: "Feeding",
    lightTileBackground: DEFAULT_BACKGROUNDS.baby.light,
    placeholder: placeholder({
      contextLine: "Last feed 14:20",
      displayTitle: "Baby feeding",
      moduleLabel: "Feeding",
      primaryValue: "5 feeds",
      visualData: { progress: 60 },
      visualType: "timelineDots",
    }),
    route: "/baby-child",
    visualType: "timelineDots",
  },
  {
    accentColor: "#F4B18A",
    category: "babyChild",
    darkTileBackground: DEFAULT_BACKGROUNDS.baby.dark,
    iconKey: "vaccines",
    id: "baby_vaccines",
    label: "Vaccines",
    lightTileBackground: DEFAULT_BACKGROUNDS.baby.light,
    placeholder: placeholder({
      contextLine: "Upcoming",
      displayTitle: "Vaccine schedule",
      moduleLabel: "Vaccines",
      primaryValue: "1 due",
      visualData: { progress: 40 },
      visualType: "statusBadge",
    }),
    route: "/baby-child",
    visualType: "statusBadge",
  },
  {
    accentColor: "#F4B18A",
    category: "babyChild",
    darkTileBackground: DEFAULT_BACKGROUNDS.baby.dark,
    iconKey: "growth",
    id: "baby_growth",
    label: "Growth",
    lightTileBackground: DEFAULT_BACKGROUNDS.baby.light,
    placeholder: placeholder({
      contextLine: "Last update",
      displayTitle: "Latest weight",
      moduleLabel: "Growth",
      primaryValue: "4.27kg",
      visualData: { lineData: [18, 28, 41, 54, 64], progress: 64 },
      visualType: "miniSparkline",
    }),
    route: "/baby-child",
    visualType: "miniSparkline",
  },
  {
    accentColor: "#E5C94C",
    category: "family",
    darkTileBackground: "#514B2F",
    iconKey: "family",
    id: "family_updates",
    label: "Family",
    lightTileBackground: "#F5EDB8",
    placeholder: placeholder({
      contextLine: "2 shared today",
      displayTitle: "Family updates",
      moduleLabel: "Family",
      primaryValue: "5 updates",
      visualData: { progress: 68 },
      visualType: "familyBubbles",
    }),
    route: "/family-circle",
    visualType: "familyBubbles",
  },
  {
    accentColor: "#8EA4C8",
    category: "records",
    darkTileBackground: DEFAULT_BACKGROUNDS.records.dark,
    iconKey: "records",
    id: "records_status",
    label: "Records",
    lightTileBackground: DEFAULT_BACKGROUNDS.records.light,
    placeholder: placeholder({
      contextLine: "Set up records",
      displayTitle: "Health records",
      moduleLabel: "Records",
      primaryValue: "Ready",
      visualData: { progress: 0 },
      visualType: "statusBadge",
    }),
    route: "/records",
    visualType: "statusBadge",
  },
  {
    accentColor: "#60A5FA",
    category: "scan",
    darkTileBackground: "#1E3A5F",
    iconKey: "scan",
    id: "scan_shortcut",
    label: "AI Scan",
    lightTileBackground: "#D8EAFE",
    placeholder: placeholder({
      contextLine: "Food or medication",
      displayTitle: "Quick scan",
      moduleLabel: "AI Scan",
      primaryValue: "Ready",
      visualData: { progress: 0 },
      visualType: "iconMark",
    }),
    route: "/scan",
    visualType: "iconMark",
  },
];

export const HEALTH_FOCUS_BY_ID: Record<string, HealthFocusDefinition> = Object.fromEntries(
  HEALTH_FOCUS_REGISTRY.map((focus) => [focus.id, focus])
);

export function getHealthFocusDefinition(focusId: string): HealthFocusDefinition {
  return HEALTH_FOCUS_BY_ID[focusId] ?? HEALTH_FOCUS_BY_ID.nutrition_overview;
}

export function getHealthFocusDisplayData(focus: HealthFocusDefinition, context: HealthFocusDataContext = {}): HealthFocusDisplayData {
  return focus.getLatestDisplayData?.(context) ?? focus.placeholder;
}

export function getHealthFocusGroups(): { category: HealthFocusCategory; items: HealthFocusDefinition[]; label: string }[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: HEALTH_FOCUS_REGISTRY.filter((focus) => focus.category === category),
    label: HEALTH_FOCUS_CATEGORY_LABELS[category],
  })).filter((group) => group.items.length > 0);
}
