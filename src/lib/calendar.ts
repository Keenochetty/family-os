export type HealthCalendarEventType =
  | "general"
  | "work"
  | "appointment"
  | "medication"
  | "supplement"
  | "fitness"
  | "nutrition"
  | "meal_plan"
  | "water"
  | "sleep"
  | "cycle"
  | "contraception"
  | "pregnancy"
  | "baby"
  | "child"
  | "vaccine"
  | "family"
  | "record"
  | "ai_imported";

export type CalendarVisibility = "private" | "shared" | "family";

export type CalendarOwnerRole = "me" | "partner" | "child" | "baby" | "parent" | "caregiver";

export type CalendarOwner = {
  id: string;
  name: string;
  role: CalendarOwnerRole;
  initials: string;
  color: string;
};

export type CalendarEventStatus =
  | "upcoming"
  | "completed"
  | "attended"
  | "cancelled"
  | "postponed"
  | "planned_later"
  | "missed"
  | "pending_sync";

export type CalendarEventComment = {
  id: string;
  author: string;
  message: string;
  createdAt: string;
};

export type CalendarEventHistoryEntry = {
  id: string;
  summary: string;
  createdAt: string;
  actor: string;
};

export type HealthCalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  type: HealthCalendarEventType;
  visibility: CalendarVisibility;
  ownerId: string;
  status: CalendarEventStatus;
  location?: string;
  reminderStatus?: "none" | "scheduled" | "sent" | "snoozed";
  comments?: CalendarEventComment[];
  history?: CalendarEventHistoryEntry[];
  urgent?: boolean;
  source?: "manual" | "ai_imported" | "system";
  notes?: string;
};

export type CycleOverlay = {
  id: string;
  date: string;
  kind: "period" | "fertile" | "ovulation" | "pregnancy";
  visibility: "private";
};

export type NewHealthCalendarEvent = Omit<HealthCalendarEvent, "id" | "status" | "source"> & {
  status?: CalendarEventStatus;
  source?: HealthCalendarEvent["source"];
};

export const calendarOwners: CalendarOwner[] = [
  { id: "me", name: "Theresa", role: "me", initials: "T", color: "#38bdf8" },
  { id: "partner", name: "Partner", role: "partner", initials: "P", color: "#14b8a6" },
  { id: "liam", name: "Liam", role: "baby", initials: "L", color: "#facc15" },
  { id: "family", name: "Family", role: "caregiver", initials: "F", color: "#2dd4bf" },
];

export const eventTypeMeta: Record<HealthCalendarEventType, { label: string; color: string }> = {
  general: { label: "General", color: "#94a3b8" },
  work: { label: "Work", color: "#64748b" },
  appointment: { label: "Appointment", color: "#60a5fa" },
  medication: { label: "Medication", color: "#3b82f6" },
  supplement: { label: "Supplement", color: "#38bdf8" },
  fitness: { label: "Fitness", color: "#22c55e" },
  nutrition: { label: "Nutrition", color: "#fb923c" },
  meal_plan: { label: "Meal plan", color: "#f97316" },
  water: { label: "Water", color: "#06b6d4" },
  sleep: { label: "Sleep", color: "#818cf8" },
  cycle: { label: "Cycle", color: "#fb7185" },
  contraception: { label: "Contraception", color: "#f472b6" },
  pregnancy: { label: "Pregnancy", color: "#a78bfa" },
  baby: { label: "Baby", color: "#facc15" },
  child: { label: "Child", color: "#fde047" },
  vaccine: { label: "Vaccine", color: "#fbbf24" },
  family: { label: "Family", color: "#14b8a6" },
  record: { label: "Record", color: "#a3a3a3" },
  ai_imported: { label: "AI imported", color: "#8b5cf6" },
};

export const seedCalendarEvents: HealthCalendarEvent[] = [
  {
    id: "event-vitamin-d",
    title: "Medication: Vitamin D",
    date: "2026-06-18",
    time: "08:00",
    type: "medication",
    visibility: "private",
    ownerId: "me",
    status: "upcoming",
    location: "Home",
    reminderStatus: "scheduled",
    source: "system",
    notes: "Daily supplement reminder.",
    comments: [{ id: "comment-vitamin", author: "Theresa", message: "Take with breakfast.", createdAt: "2026-06-18 07:30" }],
    history: [{ id: "history-vitamin", actor: "System", summary: "Medication reminder created", createdAt: "2026-06-17 18:00" }],
  },
  {
    id: "event-workout",
    title: "Workout: Upper body",
    date: "2026-06-18",
    time: "09:30",
    type: "fitness",
    visibility: "private",
    ownerId: "me",
    status: "upcoming",
    location: "Gym",
    reminderStatus: "scheduled",
    notes: "Upper body training day from active plan.",
    history: [{ id: "history-workout", actor: "AI plan", summary: "Workout plan imported", createdAt: "2026-06-17 20:15" }],
  },
  {
    id: "event-lunch",
    title: "Meal plan: High protein lunch",
    date: "2026-06-18",
    time: "13:00",
    type: "meal_plan",
    visibility: "private",
    ownerId: "me",
    status: "upcoming",
    location: "Home",
    reminderStatus: "none",
    source: "ai_imported",
    notes: "High protein lunch from meal plan.",
    history: [{ id: "history-lunch", actor: "AI plan", summary: "Meal plan imported by AI", createdAt: "2026-06-18 06:30" }],
  },
  {
    id: "event-vaccine",
    title: "Baby vaccine appointment",
    date: "2026-06-18",
    time: "15:30",
    type: "vaccine",
    visibility: "family",
    ownerId: "liam",
    status: "upcoming",
    location: "Family clinic",
    reminderStatus: "scheduled",
    urgent: true,
    notes: "Bring vaccine card and baby health book.",
    comments: [{ id: "comment-vaccine", author: "Keeno", message: "Confirm appointment time before leaving.", createdAt: "2026-06-17 19:10" }],
    history: [{ id: "history-vaccine", actor: "Theresa", summary: "Baby vaccine appointment created", createdAt: "2026-06-16 12:00" }],
  },
  {
    id: "event-family-walk",
    title: "Family walk",
    date: "2026-06-18",
    time: "19:00",
    type: "family",
    visibility: "shared",
    ownerId: "family",
    status: "upcoming",
    location: "Neighbourhood route",
    reminderStatus: "scheduled",
    notes: "Shared family activity.",
    history: [{ id: "history-walk", actor: "Theresa", summary: "Family event created", createdAt: "2026-06-18 08:45" }],
  },
  {
    id: "event-sleep",
    title: "Sleep routine reminder",
    date: "2026-06-18",
    time: "21:00",
    type: "sleep",
    visibility: "private",
    ownerId: "me",
    status: "upcoming",
    location: "Home",
    reminderStatus: "scheduled",
    notes: "Wind down and prepare tomorrow routine.",
  },
  {
    id: "event-doctor",
    title: "Doctor follow-up",
    date: "2026-06-23",
    time: "10:30",
    type: "appointment",
    visibility: "private",
    ownerId: "me",
    status: "upcoming",
    location: "Doctor rooms",
    reminderStatus: "scheduled",
    notes: "Follow up on blood results.",
    history: [{ id: "history-doctor", actor: "Theresa", summary: "Doctor appointment added", createdAt: "2026-06-20 09:00" }],
  },
  {
    id: "event-running",
    title: "5km plan: easy run",
    date: "2026-06-25",
    time: "18:00",
    type: "ai_imported",
    visibility: "private",
    ownerId: "me",
    status: "upcoming",
    location: "Park",
    reminderStatus: "scheduled",
    source: "ai_imported",
    notes: "Easy run from 5km plan.",
    history: [{ id: "history-running", actor: "AI plan", summary: "Running plan imported by AI", createdAt: "2026-06-21 14:35" }],
  },
];

export const seedCycleOverlays: CycleOverlay[] = [
  { id: "period-16", date: "2026-06-16", kind: "period", visibility: "private" },
  { id: "period-17", date: "2026-06-17", kind: "period", visibility: "private" },
  { id: "period-18", date: "2026-06-18", kind: "period", visibility: "private" },
  { id: "fertile-24", date: "2026-06-24", kind: "fertile", visibility: "private" },
  { id: "fertile-25", date: "2026-06-25", kind: "fertile", visibility: "private" },
  { id: "ovulation-26", date: "2026-06-26", kind: "ovulation", visibility: "private" },
];

export function createCalendarEvent(input: NewHealthCalendarEvent): HealthCalendarEvent {
  return {
    ...input,
    id: `event-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    status: input.status ?? "upcoming",
    source: input.source ?? "manual",
    location: input.location ?? "Not set",
    reminderStatus: input.reminderStatus ?? "scheduled",
    comments: input.comments ?? [],
    history: input.history ?? [
      {
        id: `history-${Date.now()}`,
        actor: "You",
        createdAt: new Date().toISOString(),
        summary: "Event created",
      },
    ],
  };
}
