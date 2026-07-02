import type { PrivacyLabelKey, RealmColorKey } from "@/theme";

export type HomeWidget = {
  actionLabel: string;
  description: string;
  id: string;
  privacy: PrivacyLabelKey;
  realm: RealmColorKey;
  route: string;
  title: string;
};

export const latestMoment: HomeWidget = {
  actionLabel: "View Moment",
  description: "Family walk saved privately. Add photos or keep it as a quiet memory.",
  id: "moment-family-walk",
  privacy: "private",
  realm: "familyHealth",
  route: "/profile/moments",
  title: "Latest Moment",
};

export const familyUpdates: HomeWidget[] = [
  {
    actionLabel: "Review",
    description: "Vaccine appointment reminder is ready for household review.",
    id: "family-vaccine",
    privacy: "circle",
    realm: "kids",
    route: "/calendar",
    title: "Liam appointment",
  },
  {
    actionLabel: "Open task",
    description: "Shared grocery list has two health items still unchecked.",
    id: "family-groceries",
    privacy: "circle",
    realm: "nutrition",
    route: "/family",
    title: "Household task",
  },
];

export const lightSuggestions: HomeWidget[] = [
  {
    actionLabel: "Log water",
    description: "You usually log water around this time. No pressure if today is different.",
    id: "suggest-water",
    privacy: "private",
    realm: "hydration",
    route: "/food",
    title: "Gentle hydration check",
  },
  {
    actionLabel: "Ask AI",
    description: "AI can summarize this week after you review what it will use.",
    id: "suggest-ai-summary",
    privacy: "private",
    realm: "ai",
    route: "/ai",
    title: "Summarize my week",
  },
];

export const weeklyGlance: HomeWidget[] = [
  {
    actionLabel: "Open Health",
    description: "5 workouts, 4 mood logs, 1 document, 2 missed reminders.",
    id: "week-summary",
    privacy: "private",
    realm: "records",
    route: "/health",
    title: "This week",
  },
];

export const quickActions: HomeWidget[] = [
  { actionLabel: "Start", description: "Begin planned session.", id: "quick-workout", privacy: "private", realm: "fitness", route: "/fitness", title: "Workout" },
  { actionLabel: "Log", description: "Medication review before save.", id: "quick-medication", privacy: "private", realm: "medication", route: "/medication", title: "Medication" },
  { actionLabel: "Log", description: "Private mood check-in.", id: "quick-mood", privacy: "private", realm: "mentalHealth", route: "/mental-health", title: "Mood" },
  { actionLabel: "Log", description: "Baby feed, sleep, or nappy.", id: "quick-baby", privacy: "private", realm: "baby", route: "/baby-child", title: "Baby feed" },
  { actionLabel: "Log", description: "Add water quickly.", id: "quick-water", privacy: "private", realm: "hydration", route: "/food", title: "Water" },
  { actionLabel: "Log", description: "Cycle data stays private.", id: "quick-period", privacy: "private", realm: "period", route: "/cycle", title: "Period" },
  { actionLabel: "Create", description: "Assign a shared task after permission review.", id: "quick-task", privacy: "circle", realm: "familyHealth", route: "/calendar", title: "Task" },
];
