import type { Href } from "expo-router";

export type SmartHeaderActionCategory =
  | "workout"
  | "mood"
  | "water"
  | "nutrition"
  | "medication"
  | "supplements"
  | "baby"
  | "pregnancy"
  | "cycle"
  | "family"
  | "calendar"
  | "scan"
  | "records"
  | "sleep"
  | "vitals"
  | "setup";

export type SmartHeaderActionType = "start" | "quickLog" | "reminder" | "setup" | "review" | "scan" | "open";

export type SmartHeaderVisualType =
  | "workoutBars"
  | "moodEmojiRow"
  | "waterDrops"
  | "mealChips"
  | "pillRow"
  | "babyTimeline"
  | "pregnancyMilestones"
  | "cycleCalendarDots"
  | "familyBubbles"
  | "scanFrame"
  | "recordsBadge"
  | "sleepBars"
  | "pulseLine"
  | "setupBadge"
  | "statusBadge"
  | "none";

export type SmartHeaderAction = {
  id: string;
  category: SmartHeaderActionCategory;
  type: SmartHeaderActionType;
  title: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel?: string;
  route?: Href;
  accentColor: string;
  iconKey: string;
  emoji?: string;
  visualType: SmartHeaderVisualType;
  priority: number;
  expiresAt?: string;
  source?:
    | "calendar"
    | "health"
    | "food"
    | "fitness"
    | "medication"
    | "babyChild"
    | "cycle"
    | "pregnancy"
    | "family"
    | "scan"
    | "placeholder";
  visibility?: "all" | "female" | "male" | "pregnancy" | "babyParent" | "caregiver" | "family";
  privacyLevel?: "safe" | "private";
};

export type SmartHeaderPreferences = {
  enabled: boolean;
  dismissedActionIds: string[];
  hiddenCategories: SmartHeaderActionCategory[];
  preferredCategories: SmartHeaderActionCategory[];
};

export type SmartHeaderContext = {
  user?: unknown;
  enabledModules?: string[];
  calendar?: unknown;
  nutrition?: unknown;
  medication?: unknown;
  fitness?: unknown;
  babyChild?: unknown;
  pregnancy?: unknown;
  cycle?: unknown;
  family?: unknown;
  records?: unknown;
  preferences?: SmartHeaderPreferences;
};
