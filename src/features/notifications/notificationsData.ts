import type { PrivacyLabelKey, RealmColorKey } from "@/theme";

export type NotificationCategory = "Health" | "Family" | "Calendar" | "Caregiver" | "AI" | "System" | "Emergency";

export type NotificationItem = {
  category: NotificationCategory;
  description: string;
  id: string;
  privacy: PrivacyLabelKey;
  realm: RealmColorKey;
  timeLabel: string;
  title: string;
  urgent?: boolean;
};

export type SuggestionItem = {
  actionLabel: string;
  category: NotificationCategory;
  description: string;
  id: string;
  privacy: PrivacyLabelKey;
  reason: string;
  realm: RealmColorKey;
  route: string;
  title: string;
};

export type NotificationPreference = {
  description: string;
  enabled: boolean;
  id: string;
  label: string;
};

export const notificationCategories: NotificationCategory[] = ["Health", "Family", "Calendar", "Caregiver", "AI", "System", "Emergency"];

export const notifications: NotificationItem[] = [
  {
    category: "Health",
    description: "Medication reminder is ready for review. No medication details are shown in previews.",
    id: "notification-medication",
    privacy: "private",
    realm: "medication",
    timeLabel: "8 min ago",
    title: "Medication reminder",
  },
  {
    category: "Family",
    description: "Household task was completed without sharing attached records.",
    id: "notification-family-task",
    privacy: "circle",
    realm: "familyHealth",
    timeLabel: "24 min ago",
    title: "Shared family task",
  },
  {
    category: "Calendar",
    description: "Soccer practice request is waiting for parent approval.",
    id: "notification-calendar-sport",
    privacy: "private",
    realm: "sport",
    timeLabel: "Today",
    title: "Sport event approval",
  },
  {
    category: "Caregiver",
    description: "Caregiver update needs review before it changes child care notes.",
    id: "notification-caregiver",
    privacy: "caregiver",
    realm: "caregiver",
    timeLabel: "Today",
    title: "Caregiver update",
  },
  {
    category: "AI",
    description: "AI summary is ready. Review source data before saving.",
    id: "notification-ai",
    privacy: "private",
    realm: "ai",
    timeLabel: "Yesterday",
    title: "AI summary draft",
  },
  {
    category: "System",
    description: "Connected device sync is paused until metric consent is confirmed.",
    id: "notification-system-device",
    privacy: "private",
    realm: "vitals",
    timeLabel: "Yesterday",
    title: "Device sync paused",
  },
  {
    category: "Emergency",
    description: "Emergency profile is incomplete. Add only details you want available offline.",
    id: "notification-emergency",
    privacy: "private",
    realm: "emergency",
    timeLabel: "This week",
    title: "Emergency profile",
    urgent: true,
  },
];

export const suggestions: SuggestionItem[] = [
  {
    actionLabel: "Do it",
    category: "Health",
    description: "Log water if it is useful today. Dismissing it will not affect goals.",
    id: "suggestion-water",
    privacy: "private",
    reason: "You often log hydration around this time, and no water has been logged today.",
    realm: "hydration",
    route: "/food",
    title: "Gentle hydration check",
  },
  {
    actionLabel: "Do it",
    category: "Calendar",
    description: "Review the school snack task before Friday.",
    id: "suggestion-school-snack",
    privacy: "circle",
    reason: "A shared family task is due soon and marked school-safe.",
    realm: "kids",
    route: "/calendar",
    title: "School snack prep",
  },
  {
    actionLabel: "Do it",
    category: "AI",
    description: "Create a private weekly summary after choosing source data.",
    id: "suggestion-ai-week",
    privacy: "private",
    reason: "You have enough recent private activity to generate a useful summary.",
    realm: "ai",
    route: "/ai",
    title: "Summarize my week",
  },
];

export const notificationPreferences: NotificationPreference[] = [
  { description: "Medication, vitals, scans, records, and health reminders.", enabled: true, id: "health", label: "Health" },
  { description: "Family tasks, circle updates, and shared calendar activity.", enabled: true, id: "family", label: "Family" },
  { description: "Appointments, sport days, meals, reminders, and approvals.", enabled: true, id: "calendar", label: "Calendar" },
  { description: "Care logs, pickup notes, caregiver messages, and permission changes.", enabled: true, id: "caregiver", label: "Caregiver" },
  { description: "AI drafts, review-before-save prompts, and summary suggestions.", enabled: false, id: "ai", label: "AI" },
  { description: "Sync, security, billing, and account messages.", enabled: true, id: "system", label: "System" },
  { description: "Emergency profile and urgent safety reminders.", enabled: true, id: "emergency", label: "Emergency" },
];
