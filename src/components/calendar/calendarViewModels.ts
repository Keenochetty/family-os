import { eventTypeMeta, type CalendarOwner, type HealthCalendarEvent } from "@/lib/calendar";
import type { CalendarEventViewModel } from "@/components/calendar/calendarTypes";

export function createCalendarEventViewModel(event: HealthCalendarEvent, owner: CalendarOwner): CalendarEventViewModel {
  // UI PLACEHOLDER ADAPTER — replace during backend integration.
  const type = eventTypeMeta[event.type];

  return {
    accentColor: event.urgent ? "#ef4444" : type.color,
    categoryLabel: type.label,
    iconKey: event.type,
    id: event.id,
    isShared: event.visibility !== "private",
    isUrgent: Boolean(event.urgent),
    ownerColor: owner.color,
    ownerInitials: owner.initials,
    privacyLabel: event.visibility === "private" ? "Private" : event.visibility,
    statusLabel: event.status.replace("_", " "),
    timeLabel: event.time,
    title: event.title,
    type: event.type,
  };
}
