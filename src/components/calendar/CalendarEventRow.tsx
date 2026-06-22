import type { JSX } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { CalendarTheme } from "@/lib/theme";
import type { CalendarEventViewModel } from "@/components/calendar/calendarTypes";

type CalendarEventRowProps = {
  event: CalendarEventViewModel;
  onLongPress: () => void;
  onPress: () => void;
  selected: boolean;
  theme: CalendarTheme;
};

export function CalendarEventRow({
  event,
  onLongPress,
  onPress,
  selected,
  theme,
}: CalendarEventRowProps): JSX.Element {
  return (
    <Pressable
      accessibilityLabel={`${event.timeLabel}, ${event.title}, ${event.categoryLabel}, ${event.statusLabel}${event.privacyLabel ? `, ${event.privacyLabel}` : ""}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      delayLongPress={320}
      onLongPress={onLongPress}
      onPress={onPress}
      style={[
        styles.eventRow,
        {
          backgroundColor: theme.eventCard,
          borderColor: selected ? theme.selectedDayAccent : theme.eventCardBorder,
          shadowColor: theme.eventCardShadow,
        },
        selected && styles.eventRowSelected,
      ]}
    >
      <View style={[styles.eventStrip, { backgroundColor: event.accentColor }]} />
      <View style={styles.eventTimeColumn}>
        <Text style={[styles.eventTime, { color: theme.text }]}>{event.timeLabel}</Text>
        <Text style={[styles.eventStatus, { color: theme.muted }]}>{event.statusLabel}</Text>
      </View>
      <View style={styles.eventContent}>
        <Text style={[styles.eventTitle, { color: theme.text }]}>{event.title}</Text>
        <Text style={[styles.eventMeta, { color: theme.muted }]}>
          {event.categoryLabel} - {event.privacyLabel}
        </Text>
      </View>
      {selected ? (
        <View style={[styles.selectionChip, { backgroundColor: theme.selectedDaySurface }]}>
          <Text style={[styles.selectionChipText, { color: theme.selectedDayText }]}>OK</Text>
        </View>
      ) : event.isShared ? (
        <View style={[styles.avatarChip, { backgroundColor: event.ownerColor }]}>
          <Text style={styles.avatarText}>{event.ownerInitials}</Text>
        </View>
      ) : (
        <View style={[styles.privateChip, { backgroundColor: theme.privacyChip, borderColor: theme.privacyChipBorder }]}>
          <Text style={[styles.privateChipText, { color: theme.privacyText }]}>Private</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  eventContent: {
    flex: 1,
  },
  eventMeta: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0,
    marginTop: 4,
    textTransform: "capitalize",
  },
  eventRow: {
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    elevation: 3,
    flexDirection: "row",
    gap: 12,
    minHeight: 70,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  eventRowSelected: {
    borderWidth: 2,
  },
  eventStatus: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0,
    marginTop: 4,
    textTransform: "capitalize",
  },
  eventStrip: {
    borderRadius: 2,
    height: 42,
    width: 4,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  eventTimeColumn: {
    width: 54,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
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
});
