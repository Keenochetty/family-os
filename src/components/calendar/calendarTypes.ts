import type { HealthCalendarEventType } from "@/lib/calendar";

export type CalendarEventDot = {
  color: string;
  id: string;
  label: string;
};

export type CalendarHaloDefinition = {
  color: string;
  label: string;
  strength: "primary" | "secondary";
};

export type CalendarDayState = {
  eventDots: CalendarEventDot[];
  halo?: CalendarHaloDefinition;
  isDisabled: boolean;
  isOutsideMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
};

export type CalendarEventViewModel = {
  accentColor: string;
  categoryLabel: string;
  iconKey?: string;
  id: string;
  isShared: boolean;
  isUrgent: boolean;
  ownerColor: string;
  ownerInitials: string;
  privacyLabel?: string;
  statusLabel: string;
  timeLabel: string;
  title: string;
  type: HealthCalendarEventType;
};
