import type { PrivacyLabelKey, RealmColorKey } from "@/theme";

export type MomentType =
  | "family_circle_created"
  | "workout_completed"
  | "nutrition_win"
  | "weight_progress"
  | "pregnancy_milestone"
  | "baby_milestone"
  | "caregiver_update"
  | "document_saved"
  | "sport_completed"
  | "shared_family_task_completed";

export type Moment = {
  dateLabel: string;
  description: string;
  id: string;
  privacy: PrivacyLabelKey;
  removableSensitiveData: string[];
  route: string;
  tone: RealmColorKey;
  title: string;
  type: MomentType;
};

export type MomentTemplate = {
  action: string;
  description: string;
  id: MomentType;
  title: string;
  tone: RealmColorKey;
};

export const moments: Moment[] = [
  {
    dateLabel: "Today",
    description: "Family walk saved privately. Add photos or keep it as a quiet memory.",
    id: "moment-family-walk",
    privacy: "private",
    removableSensitiveData: ["Child photo", "Location", "Health note"],
    route: "/profile/moments",
    title: "Family walk",
    tone: "familyHealth",
    type: "family_circle_created",
  },
  {
    dateLabel: "Yesterday",
    description: "Strength session completed with a steady finish and no injury notes.",
    id: "moment-workout",
    privacy: "private",
    removableSensitiveData: ["Heart rate", "Exact location", "Performance notes"],
    route: "/fitness",
    title: "Workout completed",
    tone: "fitness",
    type: "workout_completed",
  },
  {
    dateLabel: "This week",
    description: "Balanced lunch streak reached four days. Keep the note private or export a clean summary.",
    id: "moment-nutrition",
    privacy: "private",
    removableSensitiveData: ["Meal photo", "Allergy details", "Child servings"],
    route: "/food",
    title: "Nutrition win",
    tone: "nutrition",
    type: "nutrition_win",
  },
  {
    dateLabel: "Jun 30",
    description: "Document saved to records with a private review reminder.",
    id: "moment-document",
    privacy: "private",
    removableSensitiveData: ["Document title", "Provider name", "Record date"],
    route: "/records",
    title: "Document saved",
    tone: "documents",
    type: "document_saved",
  },
];

export const latestMoment = moments[0];

export const momentTemplates: MomentTemplate[] = [
  { action: "Use event", description: "Create from a family circle, task, or calendar event.", id: "family_circle_created", title: "Family circle created", tone: "familyHealth" },
  { action: "Use progress", description: "Create from workout completion or training consistency.", id: "workout_completed", title: "Workout completed", tone: "fitness" },
  { action: "Use progress", description: "Create from a nutrition habit, meal plan, or hydration win.", id: "nutrition_win", title: "Nutrition win", tone: "nutrition" },
  { action: "Use progress", description: "Create from weight trend movement without shame language.", id: "weight_progress", title: "Weight progress", tone: "vitals" },
  { action: "Use event", description: "Create from pregnancy week, appointment, or milestone note.", id: "pregnancy_milestone", title: "Pregnancy milestone", tone: "pregnancy" },
  { action: "Use photos", description: "Create from baby photos or milestones, private by default.", id: "baby_milestone", title: "Baby milestone", tone: "baby" },
  { action: "Use event", description: "Create from an approved caregiver update or care log.", id: "caregiver_update", title: "Caregiver update", tone: "caregiver" },
  { action: "Use event", description: "Create from a saved document with sensitive fields removable.", id: "document_saved", title: "Document saved", tone: "documents" },
  { action: "Use progress", description: "Create from a sport session or match completed.", id: "sport_completed", title: "Sport completed", tone: "sport" },
  { action: "Use event", description: "Create from a completed shared task without exposing records.", id: "shared_family_task_completed", title: "Shared family task completed", tone: "familyHealth" },
];

export const momentActions = ["Create Moment", "Use photos", "Use progress", "Use event", "Use AI summary", "Save private", "Share", "Export"];

export const privacyReviewItems = [
  "Child photos stay private unless explicitly selected.",
  "Remove location, health notes, provider names, and record details before export.",
  "Sharing requires privacy review and an audit event.",
  "AI summaries must show source data before saving.",
];
