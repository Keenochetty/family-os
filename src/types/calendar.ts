import type { Visibility } from "./permissions";

export type EventAttendee = {
  id: string;
  userId?: string;
  personId?: string;
  displayName: string;
  status: "invited" | "accepted" | "declined" | "tentative" | "needs_response";
};

export type CalendarEvent = {
  id: string;
  ownerUserId: string;
  circleId?: string;
  personIds: string[];
  title: string;
  type:
    | "appointment"
    | "workout"
    | "sport"
    | "meal"
    | "medication"
    | "school"
    | "caregiver"
    | "family"
    | "period"
    | "pregnancy"
    | "baby"
    | "task"
    | "custom";
  startsAt: string;
  endsAt?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  colorKey: string;
  icon: string;
  createdBy: string;
  approvalRequired: boolean;
  approvalStatus?: "pending" | "approved" | "denied";
  visibility: Visibility;
  attendees: EventAttendee[];
};

export type Task = {
  id: string;
  title: string;
  createdBy: string;
  assignedTo?: string;
  circleId?: string;
  personId?: string;
  dueAt?: string;
  status: "todo" | "in_progress" | "done" | "could_not_complete" | "needs_help" | "blocked";
  notes?: string;
  photos?: string[];
  visibility: Visibility;
};
