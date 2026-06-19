import type { JSX } from "react";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { BottomSheet, Button, Menu } from "heroui-native";
import Svg, { Path } from "react-native-svg";

import { PageShell } from "@/components/PageShell";
import {
  calendarOwners,
  createCalendarEvent,
  eventTypeMeta,
  seedCalendarEvents,
  seedCycleOverlays,
  type CalendarOwner,
  type CalendarVisibility,
  type CalendarEventStatus,
  type HealthCalendarEvent,
  type HealthCalendarEventType,
} from "@/lib/calendar";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const COLLAPSE_DISTANCE = 240;
const MONTH_HEIGHT = 352;
const WEEK_HEIGHT = 120;
const STICKY_WEEK_TOP = 104;
const NOTE_STICK_SCROLL_Y = 228;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type DayCell = {
  date: Date;
  key: string;
  day: number;
  inMonth: boolean;
};

type SheetMode =
  | "none"
  | "quickAdd"
  | "dayQuickActions"
  | "form"
  | "filter"
  | "eventDetails"
  | "eventQuickActions"
  | "bulkActions"
  | "calendarMenu"
  | "settings"
  | "history"
  | "planLater";

type FormState = {
  title: string;
  date: string;
  time: string;
  type: HealthCalendarEventType;
  visibility: CalendarVisibility;
  ownerId: string;
};

const quickActions: { label: string; type: HealthCalendarEventType; title: string }[] = [
  { label: "Add event", type: "general", title: "New event" },
  { label: "Add medication", type: "medication", title: "Medication reminder" },
  { label: "Log symptom", type: "cycle", title: "Symptom log" },
  { label: "Add workout", type: "fitness", title: "Workout" },
  { label: "Add meal", type: "meal_plan", title: "Meal plan" },
  { label: "Add appointment", type: "appointment", title: "Appointment" },
  { label: "Add family reminder", type: "family", title: "Family reminder" },
];

const calendarMenuItems = [
  "Calendar settings",
  "Calendar history",
  "Plan later",
  "Manage event types",
  "Sync settings",
  "Notification settings",
  "Shared calendar permissions",
];

const settingsItems = [
  "Default calendar view",
  "Reminder defaults",
  "Week start day",
  "Visible event types",
  "Private health overlay visibility",
  "Family member visibility",
  "Shared calendar permissions",
  "AI-imported event review settings",
  "Sync preferences",
  "Notification preferences",
];

const historyFilters = [
  "All",
  "Personal health",
  "Fitness",
  "Nutrition",
  "Medication",
  "Supplements",
  "Family circle",
  "Baby / child care",
  "Pregnancy",
  "Women's health",
  "Work",
  "Appointments",
  "AI-imported events",
  "Cancelled events",
  "Postponed events",
  "Completed events",
];

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatMonth(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatFullDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildMonthDays(monthDate: Date): DayCell[] {
  const first = startOfMonth(monthDate);
  const gridStart = addDays(first, -first.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    return {
      date,
      day: date.getDate(),
      inMonth: date.getMonth() === monthDate.getMonth(),
      key: toDateKey(date),
    };
  });
}

function buildWeekDays(selectedDate: Date): DayCell[] {
  const weekStart = addDays(selectedDate, -selectedDate.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    return {
      date,
      day: date.getDate(),
      inMonth: true,
      key: toDateKey(date),
    };
  });
}

function getDayPeriod(time: string): "Morning" | "Afternoon" | "Evening" {
  const hour = Number(time.split(":")[0]);

  if (hour < 12) {
    return "Morning";
  }

  if (hour < 17) {
    return "Afternoon";
  }

  return "Evening";
}

function sortEvents(events: HealthCalendarEvent[]): HealthCalendarEvent[] {
  return [...events].sort((a, b) => a.time.localeCompare(b.time));
}

function getOwner(ownerId: string): CalendarOwner {
  return calendarOwners.find((owner) => owner.id === ownerId) ?? calendarOwners[0];
}

export default function CalendarScreen(): JSX.Element {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);
  const [monthDate, setMonthDate] = useState(startOfMonth(today));
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [events, setEvents] = useState(seedCalendarEvents);
  const [sheetMode, setSheetMode] = useState<SheetMode>("none");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [historyFilter, setHistoryFilter] = useState("All");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(() => ({
    title: "New event",
    date: todayKey,
    time: "09:00",
    type: "general",
    visibility: "private",
    ownerId: "me",
  }));
  const scrollY = useSharedValue(0);

  const theme = useMemo(
    () => ({
      background: isDark ? "#09090b" : "#f8fafc",
      panel: isDark ? "#111318" : "#ffffff",
      panelMuted: isDark ? "#171a21" : "#f1f5f9",
      text: isDark ? "#f8fafc" : "#0f172a",
      muted: isDark ? "#94a3b8" : "#64748b",
      faint: isDark ? "#272b35" : "#e2e8f0",
      selected: isDark ? "#38bdf8" : "#bae6fd",
      selectedText: isDark ? "#082f49" : "#0f172a",
    }),
    [isDark],
  );

  const monthDays = useMemo(() => buildMonthDays(monthDate), [monthDate]);
  const selectedDate = useMemo(() => parseDateKey(selectedDateKey), [selectedDateKey]);
  const weekDays = useMemo(() => buildWeekDays(selectedDate), [selectedDate]);
  const selectedEvents = useMemo(
    () => sortEvents(events.filter((event) => event.date === selectedDateKey)),
    [events, selectedDateKey],
  );
  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId],
  );
  const planLaterEvents = useMemo(
    () => sortEvents(events.filter((event) => event.status === "planned_later" || event.status === "postponed")),
    [events],
  );
  const historyEntries = useMemo(
    () =>
      events
        .flatMap((event) =>
          (event.history ?? []).map((entry) => ({
            ...entry,
            eventTitle: event.title,
            eventType: event.type,
          })),
        )
        .filter((entry) => {
          if (historyFilter === "All") {
            return true;
          }

          const filter = historyFilter.toLowerCase();
          return (
            entry.eventType.includes(filter.replace(" ", "_")) ||
            entry.summary.toLowerCase().includes(filter.replace(" / ", " ").split(" ")[0])
          );
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [events, historyFilter],
  );
  const selectMode = selectedEventIds.length > 0;
  const eventsByDate = useMemo(() => {
    const map = new Map<string, HealthCalendarEvent[]>();

    for (const event of events) {
      const dayEvents = map.get(event.date) ?? [];
      dayEvents.push(event);
      map.set(event.date, dayEvents);
    }

    return map;
  }, [events]);
  const overlaysByDate = useMemo(() => {
    const map = new Map<string, typeof seedCycleOverlays>();

    for (const overlay of seedCycleOverlays) {
      const overlays = map.get(overlay.date) ?? [];
      overlays.push(overlay);
      map.set(overlay.date, overlays);
    }

    return map;
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const calendarShellStyle = useAnimatedStyle(() => ({
    height: MONTH_HEIGHT,
  }));

  const monthGridStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, COLLAPSE_DISTANCE * 0.72], [1, 0], "clamp"),
  }));

  const weekStripStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [COLLAPSE_DISTANCE * 0.56, COLLAPSE_DISTANCE * 0.9], [0, 1], "clamp"),
  }));

  const inlineSelectedDateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: Math.max(scrollY.value - NOTE_STICK_SCROLL_Y, 0),
      },
    ],
  }));

  const agendaFadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 44], [0.96, 1], "clamp"),
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, 44], [8, 0], "clamp"),
      },
    ],
  }));

  function selectDay(dateKey: string): void {
    const nextDate = parseDateKey(dateKey);
    setSelectedDateKey(dateKey);

    if (nextDate.getMonth() !== monthDate.getMonth() || nextDate.getFullYear() !== monthDate.getFullYear()) {
      setMonthDate(startOfMonth(nextDate));
    }
  }

  function openQuickAdd(dateKey = selectedDateKey): void {
    setEditingEventId(null);
    setForm((current) => ({ ...current, date: dateKey }));
    setSheetMode("quickAdd");
  }

  function openDayQuickActions(dateKey: string): void {
    setEditingEventId(null);
    selectDay(dateKey);
    setForm((current) => ({ ...current, date: dateKey }));
    setSheetMode("dayQuickActions");
  }

  function openForm(type: HealthCalendarEventType, title: string): void {
    setEditingEventId(null);
    setForm((current) => ({
      ...current,
      title,
      type,
      date: current.date || selectedDateKey,
    }));
    setSheetMode("form");
  }

  function openEditForm(event: HealthCalendarEvent): void {
    setEditingEventId(event.id);
    setForm({
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type,
      visibility: event.visibility,
      ownerId: event.ownerId,
    });
    setSheetMode("form");
  }

  function saveEvent(): void {
    if (editingEventId) {
      updateEvent(editingEventId, (event) =>
        addEventHistory(
          {
            ...event,
            title: form.title.trim() || event.title,
            date: form.date,
            time: form.time.trim() || event.time,
            type: form.type,
            visibility: form.visibility,
            ownerId: form.ownerId,
          },
          "Event edited",
        ),
      );
      setSelectedDateKey(form.date);
      setMonthDate(startOfMonth(parseDateKey(form.date)));
      setEditingEventId(null);
      setSheetMode("none");
      return;
    }

    const newEvent = createCalendarEvent({
      title: form.title.trim() || eventTypeMeta[form.type].label,
      date: form.date,
      time: form.time.trim() || "09:00",
      type: form.type,
      visibility: form.visibility,
      ownerId: form.ownerId,
    });

    setEvents((current) => [...current, newEvent]);
    setSelectedDateKey(newEvent.date);
    setMonthDate(startOfMonth(parseDateKey(newEvent.date)));
    setSheetMode("none");
  }

  function addEventHistory(event: HealthCalendarEvent, summary: string): HealthCalendarEvent {
    return {
      ...event,
      history: [
        ...(event.history ?? []),
        {
          id: `history-${Date.now()}-${event.id}`,
          actor: "You",
          createdAt: new Date().toISOString(),
          summary,
        },
      ],
    };
  }

  function updateEvent(eventId: string, updater: (event: HealthCalendarEvent) => HealthCalendarEvent): void {
    setEvents((current) => current.map((event) => (event.id === eventId ? updater(event) : event)));
  }

  function updateSelectedEvents(
    status: CalendarEventStatus,
    summary: string,
    options?: { date?: string; clearAfter?: boolean },
  ): void {
    setEvents((current) =>
      current.map((event) => {
        if (!selectedEventIds.includes(event.id)) {
          return event;
        }

        return addEventHistory(
          {
            ...event,
            date: options?.date ?? event.date,
            status,
          },
          summary,
        );
      }),
    );

    if (options?.clearAfter !== false) {
      setSelectedEventIds([]);
      setSheetMode("none");
    }
  }

  function toggleEventSelection(eventId: string): void {
    setSelectedEventIds((current) =>
      current.includes(eventId) ? current.filter((id) => id !== eventId) : [...current, eventId],
    );
  }

  function openEventDetails(eventId: string): void {
    setSelectedEventId(eventId);
    setSheetMode("eventDetails");
  }

  function openEventQuickActions(eventId: string): void {
    setSelectedEventId(eventId);
    setSheetMode("eventQuickActions");
  }

  function changeSelectedEventStatus(status: CalendarEventStatus, summary: string): void {
    if (!selectedEventId) {
      return;
    }

    updateEvent(selectedEventId, (event) => addEventHistory({ ...event, status }, summary));
    setSheetMode("eventDetails");
  }

  function moveSelectedEventToPlanLater(): void {
    if (!selectedEventId) {
      return;
    }

    updateEvent(selectedEventId, (event) => addEventHistory({ ...event, status: "planned_later" }, "Event moved to Plan later"));
    setSheetMode("planLater");
  }

  function changeMonth(offset: number): void {
    setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function renderDayCell(day: DayCell, compact = false): JSX.Element {
    const dayEvents = eventsByDate.get(day.key) ?? [];
    const overlays = overlaysByDate.get(day.key) ?? [];
    const selected = day.key === selectedDateKey;
    const isToday = day.key === todayKey;
    const hasPeriod = overlays.some((overlay) => overlay.kind === "period");
    const hasFertile = overlays.some((overlay) => overlay.kind === "fertile" || overlay.kind === "ovulation");

    return (
      <Pressable
        delayLongPress={320}
        key={day.key}
        onLongPress={() => openDayQuickActions(day.key)}
        onPress={() => selectDay(day.key)}
        style={[styles.dayCell, compact && styles.weekDayCell]}
      >
        <View
          style={[
            styles.dateBlock,
            compact && styles.weekDateBlock,
            hasPeriod && { borderColor: "rgba(251, 113, 133, 0.62)", borderWidth: 2 },
            hasFertile && { borderColor: "rgba(244, 114, 182, 0.38)", borderWidth: 2 },
            isToday && !selected && { borderColor: theme.selected, borderWidth: 1 },
            selected && { backgroundColor: theme.selected, borderColor: theme.selected },
          ]}
        >
          <View style={styles.dateBox}>
            <Text
              style={[
                styles.dayText,
                { color: day.inMonth ? theme.text : theme.muted },
                selected && { color: theme.selectedText, fontWeight: "800" },
              ]}
            >
              {day.day}
            </Text>
          </View>
          <View style={styles.dotRow}>
            {dayEvents.slice(0, 3).map((event) => (
              <View key={event.id} style={[styles.dot, { backgroundColor: eventTypeMeta[event.type].color }]} />
            ))}
          </View>
        </View>
      </Pressable>
    );
  }

  function renderAgenda(): JSX.Element {
    if (selectedEvents.length === 0) {
      return (
        <Animated.View style={[styles.emptyState, { backgroundColor: theme.panel, borderColor: theme.faint }, agendaFadeStyle]}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Nothing planned for today</Text>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            Add a reminder, appointment, workout, meal, or health log.
          </Text>
        </Animated.View>
      );
    }

    return (
      <Animated.View style={[styles.agendaGroups, agendaFadeStyle]}>
        {(["Morning", "Afternoon", "Evening"] as const).map((period) => {
          const periodEvents = selectedEvents.filter((event) => getDayPeriod(event.time) === period);

          if (periodEvents.length === 0) {
            return null;
          }

          return (
            <View key={period} style={styles.agendaGroup}>
              <Text style={[styles.periodTitle, { color: theme.muted }]}>{period}</Text>
              {periodEvents.map((event) => {
                const owner = getOwner(event.ownerId);
                const type = eventTypeMeta[event.type];
                const shared = event.visibility !== "private";
                const eventSelected = selectedEventIds.includes(event.id);

                return (
                  <Pressable
                    key={event.id}
                    delayLongPress={320}
                    onLongPress={() => openEventQuickActions(event.id)}
                    onPress={() => {
                      if (selectMode) {
                        toggleEventSelection(event.id);
                        return;
                      }

                      openEventDetails(event.id);
                    }}
                    style={[
                      styles.eventRow,
                      { backgroundColor: theme.panel, borderColor: eventSelected ? theme.selected : theme.faint },
                      eventSelected && styles.eventRowSelected,
                    ]}
                  >
                    <View style={[styles.eventStrip, { backgroundColor: event.urgent ? "#ef4444" : type.color }]} />
                    <View style={styles.eventTimeColumn}>
                      <Text style={[styles.eventTime, { color: theme.text }]}>{event.time}</Text>
                      <Text style={[styles.eventStatus, { color: theme.muted }]}>{event.status.replace("_", " ")}</Text>
                    </View>
                    <View style={styles.eventContent}>
                      <Text style={[styles.eventTitle, { color: theme.text }]}>{event.title}</Text>
                      <Text style={[styles.eventMeta, { color: theme.muted }]}>
                        {type.label} - {event.visibility}
                      </Text>
                    </View>
                    {eventSelected ? (
                      <View style={[styles.selectionChip, { backgroundColor: theme.selected }]}>
                        <Text style={[styles.selectionChipText, { color: theme.selectedText }]}>OK</Text>
                      </View>
                    ) : shared ? (
                      <View style={[styles.avatarChip, { backgroundColor: owner.color }]}>
                        <Text style={styles.avatarText}>{owner.initials}</Text>
                      </View>
                    ) : (
                      <View style={[styles.privateChip, { borderColor: theme.faint }]}>
                        <Text style={[styles.privateChipText, { color: theme.muted }]}>Private</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </Animated.View>
    );
  }

  return (
    <PageShell>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <View style={[styles.profileAvatar, { backgroundColor: calendarOwners[0].color }]}>
            <Text style={styles.profileAvatarText}>{calendarOwners[0].initials}</Text>
          </View>
          <View style={styles.headerTitleGroup}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Calendar</Text>
            <Text style={[styles.headerSubtitle, { color: theme.muted }]}>Health, routines, family</Text>
          </View>
          <Pressable onPress={() => setSheetMode("filter")} style={[styles.iconButton, { borderColor: theme.faint }]}>
            <FilterIcon color={theme.text} />
          </Pressable>
          <Pressable onPress={() => setSheetMode("calendarMenu")} style={[styles.iconButton, { borderColor: theme.faint }]}>
            <MenuIcon color={theme.text} />
          </Pressable>
        </View>

        <AnimatedScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          nestedScrollEnabled
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.calendarSlot}>
            <Animated.View style={[styles.calendarPanel, calendarShellStyle]}>
              <View style={styles.monthHeader}>
                <Pressable onPress={() => changeMonth(-1)} style={styles.monthNavButton}>
                  <Text style={[styles.monthNavText, { color: theme.muted }]}>‹</Text>
                </Pressable>
                <Text style={[styles.monthLabel, { color: theme.text }]}>{formatMonth(monthDate)}</Text>
                <Pressable onPress={() => changeMonth(1)} style={styles.monthNavButton}>
                  <Text style={[styles.monthNavText, { color: theme.muted }]}>›</Text>
                </Pressable>
              </View>

              <Animated.View style={[styles.monthGridLayer, monthGridStyle]}>
                <View style={styles.weekdayRow}>
                  {WEEKDAYS.map((day) => (
                    <Text key={day} style={[styles.weekdayText, { color: theme.muted }]}>
                      {day}
                    </Text>
                  ))}
                </View>
                <View style={styles.monthGrid}>{monthDays.map((day) => renderDayCell(day))}</View>
              </Animated.View>
            </Animated.View>
          </View>

          <Animated.View style={[styles.selectedDateHeader, inlineSelectedDateStyle]}>
            <SelectedDateNote dateLabel={formatFullDate(selectedDateKey)} onAdd={() => openQuickAdd()} />
          </Animated.View>
          {renderAgenda()}
        </AnimatedScrollView>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.stickyWeekStrip, { backgroundColor: theme.background }, weekStripStyle]}
        >
          <View style={styles.stickyMonthHeader}>
            <Pressable onPress={() => changeMonth(-1)} style={styles.monthNavButton}>
              <Text style={[styles.monthNavText, { color: theme.muted }]}>‹</Text>
            </Pressable>
            <Text style={[styles.monthLabel, { color: theme.text }]}>{formatMonth(monthDate)}</Text>
            <Pressable onPress={() => changeMonth(1)} style={styles.monthNavButton}>
              <Text style={[styles.monthNavText, { color: theme.muted }]}>›</Text>
            </Pressable>
          </View>
          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((day) => (
              <Text key={day} style={[styles.weekdayText, { color: theme.muted }]}>
                {day}
              </Text>
            ))}
          </View>
          <View style={styles.weekGrid}>{weekDays.map((day) => renderDayCell(day, true))}</View>
        </Animated.View>

        {selectMode ? (
          <View style={[styles.bulkBar, { backgroundColor: theme.panel, borderColor: theme.faint }]}>
            <Text style={[styles.bulkBarText, { color: theme.text }]}>{selectedEventIds.length} selected</Text>
            <Pressable onPress={() => setSheetMode("bulkActions")} style={styles.bulkBarButton}>
              <Text style={styles.bulkBarButtonText}>Actions</Text>
            </Pressable>
            <Pressable onPress={() => setSelectedEventIds([])} style={styles.bulkBarButtonGhost}>
              <Text style={[styles.bulkBarGhostText, { color: theme.muted }]}>Clear</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <CalendarSheet visible={sheetMode === "quickAdd"} onClose={() => setSheetMode("none")} title="Quick add">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            onPress={() => openForm(action.type, action.title)}
            style={[styles.sheetAction, { borderColor: theme.faint }]}
            variant="ghost"
          >
            <View style={[styles.sheetActionDot, { backgroundColor: eventTypeMeta[action.type].color }]} />
            <Button.Label style={[styles.sheetActionText, { color: theme.text }]}>{action.label}</Button.Label>
          </Button>
        ))}
      </CalendarSheet>

      <CalendarSheet visible={sheetMode === "filter"} onClose={() => setSheetMode("none")} title="Filters">
        <FilterGroup title="People" items={["Me", "Partner", "Children", "Family circle"]} />
        <FilterGroup title="Types" items={["Medication", "Fitness", "Nutrition", "Appointments", "Women's health", "Baby care"]} />
        <FilterGroup title="Visibility" items={["Private", "Shared", "Family"]} />
      </CalendarSheet>

      <CalendarSheet visible={sheetMode === "calendarMenu"} onClose={() => setSheetMode("none")} title="Calendar menu">
        {calendarMenuItems.map((item) => (
          <Button
            key={item}
            onPress={() => {
              if (item === "Calendar settings") {
                setSheetMode("settings");
                return;
              }

              if (item === "Calendar history") {
                setSheetMode("history");
                return;
              }

              if (item === "Plan later") {
                setSheetMode("planLater");
                return;
              }

              setSheetMode("settings");
            }}
            style={[styles.sheetAction, { borderColor: theme.faint }]}
            variant="ghost"
          >
            <View style={[styles.sheetActionDot, { backgroundColor: theme.selected }]} />
            <Button.Label style={[styles.sheetActionText, { color: theme.text }]}>{item}</Button.Label>
          </Button>
        ))}
      </CalendarSheet>

      <CalendarSheet visible={sheetMode === "settings"} onClose={() => setSheetMode("none")} title="Calendar settings">
        <ScrollView showsVerticalScrollIndicator={false}>
          {settingsItems.map((item) => (
            <View key={item} style={[styles.settingRow, { borderColor: theme.faint }]}>
              <View>
                <Text style={[styles.settingTitle, { color: theme.text }]}>{item}</Text>
                <Text style={[styles.settingMeta, { color: theme.muted }]}>Local setting placeholder for backend wiring.</Text>
              </View>
              <View style={[styles.settingToggle, { backgroundColor: theme.selected }]} />
            </View>
          ))}
        </ScrollView>
      </CalendarSheet>

      <CalendarSheet visible={sheetMode === "history"} onClose={() => setSheetMode("none")} title="Calendar history">
        <ScrollView showsVerticalScrollIndicator={false}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.historyFilterRow}>
              {historyFilters.map((filter) => (
                <Button
                  key={filter}
                  onPress={() => setHistoryFilter(filter)}
                  size="sm"
                  style={[styles.historyFilterChip, historyFilter === filter && styles.historyFilterChipSelected]}
                  variant={historyFilter === filter ? "primary" : "secondary"}
                >
                  <Button.Label style={[styles.historyFilterText, historyFilter === filter && styles.historyFilterTextSelected]}>
                    {filter}
                  </Button.Label>
                </Button>
              ))}
            </View>
          </ScrollView>
          {historyEntries.length === 0 ? (
            <Text style={[styles.infoText, { color: theme.muted }]}>No history entries for this filter yet.</Text>
          ) : (
            historyEntries.map((entry) => (
              <View key={entry.id} style={[styles.historyRow, { borderColor: theme.faint }]}>
                <View style={[styles.sheetActionDot, { backgroundColor: eventTypeMeta[entry.eventType].color }]} />
                <View style={styles.historyContent}>
                  <Text style={[styles.historyTitle, { color: theme.text }]}>{entry.summary}</Text>
                  <Text style={[styles.historyMeta, { color: theme.muted }]}>
                    {entry.eventTitle} - {entry.actor} - {entry.createdAt}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </CalendarSheet>

      <CalendarSheet visible={sheetMode === "planLater"} onClose={() => setSheetMode("none")} title="Plan later">
        <ScrollView showsVerticalScrollIndicator={false}>
          {planLaterEvents.length === 0 ? (
            <Text style={[styles.infoText, { color: theme.muted }]}>No postponed or pending events.</Text>
          ) : (
            planLaterEvents.map((event) => (
              <View key={event.id} style={[styles.planLaterRow, { borderColor: theme.faint }]}>
                <View style={styles.planLaterContent}>
                  <Text style={[styles.eventTitle, { color: theme.text }]}>{event.title}</Text>
                  <Text style={[styles.eventMeta, { color: theme.muted }]}>
                    {formatFullDate(event.date)} - {event.time}
                  </Text>
                </View>
                <Button
                  onPress={() => {
                    updateEvent(event.id, (current) =>
                      addEventHistory(
                        { ...current, date: selectedDateKey, status: "upcoming" },
                        `Event assigned to ${formatFullDate(selectedDateKey)}`,
                      ),
                    );
                  }}
                  size="sm"
                  style={styles.miniActionButton}
                  variant="primary"
                >
                  <Button.Label style={styles.miniActionText}>Assign</Button.Label>
                </Button>
                <Button
                  onPress={() => updateEvent(event.id, (current) => addEventHistory({ ...current, status: "cancelled" }, "Event cancelled"))}
                  size="sm"
                  style={styles.miniActionButtonGhost}
                  variant="danger-soft"
                >
                  <Button.Label style={[styles.miniActionGhostText, { color: theme.muted }]}>Cancel</Button.Label>
                </Button>
              </View>
            ))
          )}
        </ScrollView>
      </CalendarSheet>

      <CalendarSheet visible={sheetMode === "eventDetails"} onClose={() => setSheetMode("none")} title="Event details">
        {selectedEvent ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.detailHeader}>
              <View style={[styles.sheetActionDot, { backgroundColor: eventTypeMeta[selectedEvent.type].color }]} />
              <View style={styles.detailTitleGroup}>
                <Text style={[styles.detailTitle, { color: theme.text }]}>{selectedEvent.title}</Text>
                <Text style={[styles.detailMeta, { color: theme.muted }]}>{eventTypeMeta[selectedEvent.type].label}</Text>
              </View>
            </View>
            <DetailRow label="Date" value={formatFullDate(selectedEvent.date)} />
            <DetailRow label="Time" value={selectedEvent.time} />
            <DetailRow label="Location" value={selectedEvent.location ?? "Not set"} />
            <DetailRow label="Notes" value={selectedEvent.notes ?? "No notes"} />
            <DetailRow label="Assigned to" value={getOwner(selectedEvent.ownerId).name} />
            <DetailRow label="Visibility" value={selectedEvent.visibility} />
            <DetailRow label="Reminder" value={selectedEvent.reminderStatus ?? "none"} />
            <DetailRow label="Status" value={selectedEvent.status.replace("_", " ")} />

            <Text style={[styles.sectionLabel, { color: theme.muted }]}>Comments</Text>
            {(selectedEvent.comments ?? []).length === 0 ? (
              <Text style={[styles.infoText, { color: theme.muted }]}>No comments yet.</Text>
            ) : (
              (selectedEvent.comments ?? []).map((comment) => (
                <View key={comment.id} style={[styles.commentRow, { borderColor: theme.faint }]}>
                  <Text style={[styles.commentAuthor, { color: theme.text }]}>{comment.author}</Text>
                  <Text style={[styles.commentText, { color: theme.muted }]}>{comment.message}</Text>
                </View>
              ))
            )}

            <Text style={[styles.sectionLabel, { color: theme.muted }]}>Change history</Text>
            {(selectedEvent.history ?? []).slice(-3).map((entry) => (
              <View key={entry.id} style={[styles.historyRow, { borderColor: theme.faint }]}>
                <View style={[styles.sheetActionDot, { backgroundColor: theme.selected }]} />
                <View style={styles.historyContent}>
                  <Text style={[styles.historyTitle, { color: theme.text }]}>{entry.summary}</Text>
                  <Text style={[styles.historyMeta, { color: theme.muted }]}>
                    {entry.actor} - {entry.createdAt}
                  </Text>
                </View>
              </View>
            ))}

            <View style={styles.actionGrid}>
              <Button
                onPress={() => changeSelectedEventStatus("postponed", "Event postponed")}
                style={styles.detailActionButton}
                variant="secondary"
              >
                <Button.Label style={styles.detailActionText}>Reschedule</Button.Label>
              </Button>
              <Button
                onPress={() => changeSelectedEventStatus("attended", "Event marked as attended")}
                style={styles.detailActionButton}
                variant="secondary"
              >
                <Button.Label style={styles.detailActionText}>Mark attended</Button.Label>
              </Button>
              <Button
                onPress={() => changeSelectedEventStatus("cancelled", "Event cancelled")}
                style={styles.detailActionButton}
                variant="danger-soft"
              >
                <Button.Label style={styles.detailActionText}>Cancel event</Button.Label>
              </Button>
              <Button onPress={() => openEditForm(selectedEvent)} style={styles.detailActionButton} variant="secondary">
                <Button.Label style={styles.detailActionText}>Edit event</Button.Label>
              </Button>
              <Button
                onPress={() => {
                  if (!selectedEventId) {
                    return;
                  }

                  updateEvent(selectedEventId, (event) => ({
                    ...addEventHistory(event, "Comment added"),
                    comments: [
                      ...(event.comments ?? []),
                      {
                        id: `comment-${Date.now()}`,
                        author: "You",
                        createdAt: new Date().toISOString(),
                        message: "Follow up added from calendar.",
                      },
                    ],
                  }));
                }}
                style={styles.detailActionButton}
                variant="secondary"
              >
                <Button.Label style={styles.detailActionText}>Add comment</Button.Label>
              </Button>
              <Button onPress={() => setSheetMode("history")} style={styles.detailActionButton} variant="tertiary">
                <Button.Label style={styles.detailActionText}>View history</Button.Label>
              </Button>
            </View>
          </ScrollView>
        ) : (
          <Text style={[styles.infoText, { color: theme.muted }]}>Select an event to view details.</Text>
        )}
      </CalendarSheet>

      {sheetMode === "dayQuickActions" ? (
        <Menu
          isOpen
          onOpenChange={(open) => !open && setSheetMode("none")}
          presentation="bottom-sheet"
        >
          <Menu.Portal>
            <Menu.Overlay style={styles.modalScrim} />
            <Menu.Content
              backgroundStyle={[styles.menuSheetBackground, { backgroundColor: theme.panel, borderColor: theme.faint }]}
              contentContainerProps={{ style: styles.menuSheetContent }}
              presentation="bottom-sheet"
            >
              <Menu.Label style={[styles.quickEventTitle, { color: theme.text }]}>{formatFullDate(form.date)}</Menu.Label>
              {quickActions.map((action) => (
                <Menu.Item key={action.label} onPress={() => openForm(action.type, action.title)}>
                  <View style={[styles.sheetActionDot, { backgroundColor: eventTypeMeta[action.type].color }]} />
                  <Menu.ItemTitle>{action.label}</Menu.ItemTitle>
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Portal>
        </Menu>
      ) : null}

      {sheetMode === "eventQuickActions" ? (
        <Menu
          isOpen
          onOpenChange={(open) => !open && setSheetMode("none")}
          presentation="bottom-sheet"
        >
          <Menu.Portal>
            <Menu.Overlay style={styles.modalScrim} />
            <Menu.Content
              backgroundStyle={[styles.menuSheetBackground, { backgroundColor: theme.panel, borderColor: theme.faint }]}
              contentContainerProps={{ style: styles.menuSheetContent }}
              presentation="bottom-sheet"
            >
              {selectedEvent ? (
                <>
                  <Menu.Label style={[styles.quickEventTitle, { color: theme.text }]}>{selectedEvent.title}</Menu.Label>
                  <Menu.Item onPress={() => setSheetMode("eventDetails")}>
                    <Menu.ItemTitle>View details</Menu.ItemTitle>
                  </Menu.Item>
                  <Menu.Item onPress={() => changeSelectedEventStatus("postponed", "Event postponed")}>
                    <Menu.ItemTitle>Reschedule</Menu.ItemTitle>
                  </Menu.Item>
                  <Menu.Item onPress={() => changeSelectedEventStatus("attended", "Event marked as attended")}>
                    <Menu.ItemTitle>Mark as attended</Menu.ItemTitle>
                  </Menu.Item>
                  <Menu.Item onPress={() => openEditForm(selectedEvent)}>
                    <Menu.ItemTitle>Edit</Menu.ItemTitle>
                  </Menu.Item>
                  <Menu.Item
                    onPress={() => {
                      if (!selectedEventId) {
                        return;
                      }

                      updateEvent(selectedEventId, (event) => ({
                        ...addEventHistory(event, "Comment added"),
                        comments: [
                          ...(event.comments ?? []),
                          {
                            id: `comment-${Date.now()}`,
                            author: "You",
                            createdAt: new Date().toISOString(),
                            message: "Quick comment added.",
                          },
                        ],
                      }));
                      setSheetMode("eventDetails");
                    }}
                  >
                    <Menu.ItemTitle>Add comment</Menu.ItemTitle>
                  </Menu.Item>
                  <Menu.Item onPress={moveSelectedEventToPlanLater}>
                    <Menu.ItemTitle>Postpone</Menu.ItemTitle>
                  </Menu.Item>
                  <Menu.Item
                    onPress={() => {
                      toggleEventSelection(selectedEvent.id);
                      setSheetMode("none");
                    }}
                  >
                    <Menu.ItemTitle>Select event</Menu.ItemTitle>
                  </Menu.Item>
                  <Menu.Item onPress={() => changeSelectedEventStatus("cancelled", "Event cancelled")} variant="danger">
                    <Menu.ItemTitle>Cancel</Menu.ItemTitle>
                  </Menu.Item>
                </>
              ) : (
                <Menu.Label style={[styles.infoText, { color: theme.muted }]}>Long press an event to use quick actions.</Menu.Label>
              )}
            </Menu.Content>
          </Menu.Portal>
        </Menu>
      ) : null}

      <CalendarSheet visible={sheetMode === "bulkActions"} onClose={() => setSheetMode("none")} title="Bulk actions">
        <Text style={[styles.quickEventTitle, { color: theme.text }]}>{selectedEventIds.length} events selected</Text>
        <Button
          onPress={() => updateSelectedEvents("cancelled", "Selected events cancelled")}
          style={[styles.sheetAction, { borderColor: theme.faint }]}
          variant="danger-soft"
        >
          <Button.Label style={[styles.sheetActionText, { color: theme.text }]}>Cancel selected events</Button.Label>
        </Button>
        <Button
          onPress={() => updateSelectedEvents("postponed", "Selected events postponed")}
          style={[styles.sheetAction, { borderColor: theme.faint }]}
          variant="secondary"
        >
          <Button.Label style={[styles.sheetActionText, { color: theme.text }]}>Postpone selected events</Button.Label>
        </Button>
        <Button
          onPress={() =>
            updateSelectedEvents("upcoming", `Selected events moved to ${formatFullDate(selectedDateKey)}`, { date: selectedDateKey })
          }
          style={[styles.sheetAction, { borderColor: theme.faint }]}
          variant="secondary"
        >
          <Button.Label style={[styles.sheetActionText, { color: theme.text }]}>Move selected events to selected date</Button.Label>
        </Button>
        <Button
          onPress={() => updateSelectedEvents("planned_later", "Selected events moved to Plan later")}
          style={[styles.sheetAction, { borderColor: theme.faint }]}
          variant="secondary"
        >
          <Button.Label style={[styles.sheetActionText, { color: theme.text }]}>Add selected events to Plan later</Button.Label>
        </Button>
        <Button
          onPress={() => {
            setSelectedEventIds([]);
            setSheetMode("none");
          }}
          style={[styles.sheetAction, { borderColor: theme.faint }]}
          variant="ghost"
        >
          <Button.Label style={[styles.sheetActionText, { color: theme.text }]}>Clear selection</Button.Label>
        </Button>
      </CalendarSheet>

      <CalendarSheet
        visible={sheetMode === "form"}
        onClose={() => {
          setEditingEventId(null);
          setSheetMode("none");
        }}
        title={editingEventId ? "Edit calendar item" : "Add calendar item"}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <FormField label="Title" value={form.title} onChangeText={(title) => setForm((current) => ({ ...current, title }))} />
          <FormField label="Date" value={form.date} onChangeText={(date) => setForm((current) => ({ ...current, date }))} />
          <FormField label="Time" value={form.time} onChangeText={(time) => setForm((current) => ({ ...current, time }))} />
          <OptionRow
            label="Type"
            options={["general", "appointment", "medication", "fitness", "meal_plan", "cycle", "family", "vaccine"]}
            selected={form.type}
            onSelect={(type) => setForm((current) => ({ ...current, type: type as HealthCalendarEventType }))}
          />
          <OptionRow
            label="Visibility"
            options={["private", "shared", "family"]}
            selected={form.visibility}
            onSelect={(visibility) => setForm((current) => ({ ...current, visibility: visibility as CalendarVisibility }))}
          />
          <OptionRow
            label="Owner"
            options={calendarOwners.map((owner) => owner.id)}
            selected={form.ownerId}
            onSelect={(ownerId) => setForm((current) => ({ ...current, ownerId }))}
          />
          <Button onPress={saveEvent} style={styles.saveButton} variant="primary">
            <Button.Label style={styles.saveButtonText}>{editingEventId ? "Update event" : "Save event"}</Button.Label>
          </Button>
        </KeyboardAvoidingView>
      </CalendarSheet>
    </PageShell>
  );
}

function SelectedDateNote({ dateLabel, onAdd }: { dateLabel: string; onAdd: () => void }): JSX.Element {
  return (
    <>
      <View>
        <Text style={styles.todayLabel}>Selected day</Text>
        <Text style={styles.selectedDateText}>{dateLabel}</Text>
      </View>
      <Pressable onPress={onAdd} style={styles.smallAddButton}>
        <Text style={styles.smallAddButtonText}>+</Text>
      </Pressable>
    </>
  );
}

function FilterIcon({ color }: { color: string }): JSX.Element {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M4 6h16M7 12h10M10 18h4" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

function MenuIcon({ color }: { color: string }): JSX.Element {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M5 7h14M5 12h14M5 17h14" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

function CalendarSheet({
  children,
  onClose,
  title,
  visible,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  visible: boolean;
}): JSX.Element | null {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const backgroundColor = isDark ? "#111318" : "#ffffff";
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const borderColor = isDark ? "#272b35" : "#e2e8f0";

  if (!visible) {
    return null;
  }

  return (
    <BottomSheet isOpen={visible} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay style={styles.modalScrim} />
        <BottomSheet.Content
          backgroundStyle={[styles.sheetBackground, { backgroundColor, borderColor }]}
          contentContainerProps={{ style: styles.sheetContent }}
          enablePanDownToClose
        >
          <View style={styles.sheetHeader}>
            <BottomSheet.Title style={[styles.sheetTitle, { color: textColor }]}>{title}</BottomSheet.Title>
            <BottomSheet.Close style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: textColor }]}>×</Text>
            </BottomSheet.Close>
          </View>
          {children}
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}

function DetailRow({ label, value }: { label: string; value: string }): JSX.Element {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const borderColor = isDark ? "#272b35" : "#e2e8f0";

  return (
    <View style={[styles.detailRow, { borderBottomColor: borderColor }]}>
      <Text style={[styles.detailLabel, { color: mutedColor }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: textColor }]}>{value}</Text>
    </View>
  );
}

function FilterGroup({ items, title }: { items: string[]; title: string }): JSX.Element {
  return (
    <View style={styles.filterGroup}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.filterChipRow}>
        {items.map((item) => (
          <Button key={item} size="sm" style={styles.filterChip} variant="secondary">
            <Button.Label style={styles.filterChipText}>{item}</Button.Label>
          </Button>
        ))}
      </View>
    </View>
  );
}

function FormField({
  label,
  onChangeText,
  value,
}: {
  label: string;
  onChangeText: (value: string) => void;
  value: string;
}): JSX.Element {
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput onChangeText={onChangeText} style={styles.formInput} value={value} />
    </View>
  );
}

function OptionRow({
  label,
  onSelect,
  options,
  selected,
}: {
  label: string;
  onSelect: (value: string) => void;
  options: string[];
  selected: string;
}): JSX.Element {
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.optionRow}>
          {options.map((option) => (
            <Button
              key={option}
              onPress={() => onSelect(option)}
              size="sm"
              style={[styles.optionChip, selected === option && styles.optionChipSelected]}
              variant={selected === option ? "primary" : "secondary"}
            >
              <Button.Label style={[styles.optionChipText, selected === option && styles.optionChipTextSelected]}>{option}</Button.Label>
            </Button>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 54,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  profileAvatar: {
    alignItems: "center",
    borderRadius: 13,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  profileAvatarText: {
    color: "#082f49",
    fontSize: 15,
    fontWeight: "800",
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0,
    marginTop: 2,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  iconButtonText: {
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 14,
  },
  addButton: {
    alignItems: "center",
    borderRadius: 12,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  addButtonText: {
    fontSize: 25,
    fontWeight: "600",
    lineHeight: 28,
  },
  calendarPanel: {
    backgroundColor: "transparent",
    borderRadius: 0,
    left: 0,
    overflow: "hidden",
    paddingHorizontal: 0,
    paddingTop: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 4,
  },
  calendarSlot: {
    height: MONTH_HEIGHT,
    position: "relative",
  },
  monthHeader: {
    alignItems: "center",
    flexDirection: "row",
    height: 40,
    justifyContent: "space-between",
  },
  monthLabel: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0,
  },
  monthNavButton: {
    alignItems: "center",
    height: 30,
    justifyContent: "center",
    width: 34,
  },
  monthNavText: {
    fontSize: 24,
    fontWeight: "700",
  },
  monthGridLayer: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 50,
  },
  weekStripLayer: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 42,
  },
  stickyWeekStrip: {
    left: 12,
    minHeight: WEEK_HEIGHT,
    paddingTop: 4,
    position: "absolute",
    right: 12,
    top: STICKY_WEEK_TOP,
    zIndex: 8,
  },
  stickyMonthHeader: {
    alignItems: "center",
    flexDirection: "row",
    height: 34,
    justifyContent: "space-between",
    marginBottom: 4,
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    textAlign: "center",
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  weekGrid: {
    flexDirection: "row",
  },
  dayCell: {
    alignItems: "center",
    height: 46,
    justifyContent: "center",
    width: `${100 / 7}%`,
  },
  weekDayCell: {
    height: 46,
  },
  dateBlock: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: 10,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    paddingTop: 3,
    width: 42,
  },
  weekDateBlock: {
    height: 42,
    width: 42,
  },
  dateBox: {
    alignItems: "center",
    height: 26,
    justifyContent: "center",
    width: 38,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
  },
  dotRow: {
    flexDirection: "row",
    gap: 3,
    height: 7,
    marginTop: 1,
  },
  dot: {
    borderRadius: 2,
    height: 4,
    width: 4,
  },
  scrollContent: {
    paddingBottom: 170,
    paddingTop: 0,
  },
  selectedDateHeader: {
    alignItems: "center",
    backgroundColor: "#0f2f57",
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: "relative",
    zIndex: 20,
  },
  bulkBar: {
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    bottom: 112,
    flexDirection: "row",
    gap: 10,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: "absolute",
    right: 16,
    zIndex: 12,
  },
  bulkBarText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
  bulkBarButton: {
    backgroundColor: "#38bdf8",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bulkBarButtonText: {
    color: "#082f49",
    fontSize: 12,
    fontWeight: "900",
  },
  bulkBarButtonGhost: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  bulkBarGhostText: {
    fontSize: 12,
    fontWeight: "900",
  },
  todayLabel: {
    color: "rgba(255, 255, 255, 0.68)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  selectedDateText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 3,
  },
  smallAddButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  smallAddButtonText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "500",
  },
  emptyState: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 19,
    marginTop: 6,
  },
  agendaGroups: {
    gap: 18,
    paddingTop: 4,
    zIndex: 1,
  },
  agendaGroup: {
    gap: 9,
  },
  periodTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  eventRow: {
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 70,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  eventRowSelected: {
    borderWidth: 2,
  },
  eventStrip: {
    borderRadius: 2,
    height: 42,
    width: 4,
  },
  eventTimeColumn: {
    width: 54,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  eventStatus: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0,
    marginTop: 4,
    textTransform: "capitalize",
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  eventMeta: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0,
    marginTop: 4,
    textTransform: "capitalize",
  },
  avatarChip: {
    alignItems: "center",
    borderRadius: 11,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  avatarText: {
    color: "#082f49",
    fontSize: 12,
    fontWeight: "900",
  },
  privateChip: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  privateChipText: {
    fontSize: 10,
    fontWeight: "800",
  },
  selectionChip: {
    alignItems: "center",
    borderRadius: 10,
    height: 30,
    justifyContent: "center",
    minWidth: 30,
    paddingHorizontal: 6,
  },
  selectionChipText: {
    fontSize: 10,
    fontWeight: "900",
  },
  modalScrim: {
    backgroundColor: "rgba(0, 0, 0, 0.38)",
  },
  sheetBackground: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
  },
  sheetContent: {
    maxHeight: "78%",
    padding: 18,
  },
  menuSheetBackground: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
  },
  menuSheetContent: {
    gap: 4,
    padding: 18,
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 0,
  },
  closeButton: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: "400",
  },
  sheetAction: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingVertical: 14,
  },
  sheetActionDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  sheetActionText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0,
  },
  infoRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 10,
  },
  infoDot: {
    borderRadius: 7,
    height: 14,
    width: 14,
  },
  infoText: {
    color: "#64748b",
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterTitle: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 9,
    textTransform: "uppercase",
  },
  filterChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    backgroundColor: "#e0f2fe",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  filterChipText: {
    color: "#0f172a",
    fontSize: 12,
    fontWeight: "800",
  },
  settingRow: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    paddingVertical: 13,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
  },
  settingMeta: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0,
    marginTop: 3,
  },
  settingToggle: {
    borderRadius: 8,
    height: 16,
    width: 30,
  },
  historyFilterRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 14,
  },
  historyFilterChip: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  historyFilterChipSelected: {
    backgroundColor: "#bae6fd",
  },
  historyFilterText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "800",
  },
  historyFilterTextSelected: {
    color: "#082f49",
  },
  historyRow: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
  historyMeta: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0,
    marginTop: 3,
  },
  planLaterRow: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingVertical: 12,
  },
  planLaterContent: {
    flex: 1,
  },
  miniActionButton: {
    backgroundColor: "#38bdf8",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  miniActionText: {
    color: "#082f49",
    fontSize: 11,
    fontWeight: "900",
  },
  miniActionButtonGhost: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  miniActionGhostText: {
    fontSize: 11,
    fontWeight: "900",
  },
  detailHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  detailTitleGroup: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0,
  },
  detailMeta: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    marginTop: 3,
  },
  detailRow: {
    borderBottomColor: "#e2e8f0",
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  detailLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  detailValue: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    marginTop: 16,
    textTransform: "uppercase",
  },
  commentRow: {
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
  commentText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0,
    marginTop: 4,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  detailActionButton: {
    backgroundColor: "#e0f2fe",
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  detailActionText: {
    color: "#082f49",
    fontSize: 12,
    fontWeight: "900",
  },
  quickEventTitle: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 8,
  },
  formField: {
    marginBottom: 13,
  },
  formLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 7,
    textTransform: "uppercase",
  },
  formInput: {
    backgroundColor: "#f1f5f9",
    borderColor: "#e2e8f0",
    borderRadius: 12,
    borderWidth: 1,
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
    minHeight: 46,
    paddingHorizontal: 12,
  },
  optionRow: {
    flexDirection: "row",
    gap: 8,
  },
  optionChip: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  optionChipSelected: {
    backgroundColor: "#bae6fd",
  },
  optionChipText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "800",
  },
  optionChipTextSelected: {
    color: "#082f49",
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#38bdf8",
    borderRadius: 14,
    height: 48,
    justifyContent: "center",
    marginTop: 4,
  },
  saveButtonText: {
    color: "#082f49",
    fontSize: 15,
    fontWeight: "900",
  },
});
