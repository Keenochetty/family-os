import type { JSX } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { CalendarTheme } from "@/lib/theme";
import type { CalendarDayState } from "@/components/calendar/calendarTypes";

type CalendarDayCellProps = {
  compact?: boolean;
  dateLabel: string;
  dayNumber: number;
  onLongPress: () => void;
  onPress: () => void;
  state: CalendarDayState;
  theme: CalendarTheme;
};

export function CalendarDayCell({
  compact,
  dateLabel,
  dayNumber,
  onLongPress,
  onPress,
  state,
  theme,
}: CalendarDayCellProps): JSX.Element {
  const overflowCount = Math.max(0, state.eventDots.length - 3);
  const stateLabel = [
    dateLabel,
    state.isSelected ? "selected" : "",
    state.isToday ? "today" : "",
    state.isOutsideMonth ? "outside current month" : "",
    state.halo?.label ?? "",
    state.eventDots.length > 0 ? `${state.eventDots.length} events` : "",
  ].filter(Boolean).join(", ");

  return (
    <Pressable
      accessibilityLabel={stateLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: state.isDisabled, selected: state.isSelected }}
      delayLongPress={320}
      disabled={state.isDisabled}
      onLongPress={onLongPress}
      onPress={onPress}
      style={({ pressed }) => [styles.dayCell, compact && styles.weekDayCell, pressed && styles.dayCellPressed]}
    >
      <View
        style={[
          styles.dateBlock,
          compact && styles.weekDateBlock,
          state.halo && {
            borderColor: state.halo.color,
            borderWidth: state.halo.strength === "primary" ? 2 : 2,
          },
          state.isToday && !state.isSelected && !state.halo && { borderColor: theme.todayRing, borderWidth: 1 },
          state.isSelected && !state.halo && { borderColor: theme.selectedDayPanelBorder },
        ]}
      >
        {state.isSelected ? (
          <View pointerEvents="none" style={[styles.selectedPressedSurface, { backgroundColor: theme.selectedDaySurface }]}>
            <View style={[styles.selectedPressedTopShadow, { backgroundColor: theme.selectedDayShadow }]} />
            <View style={[styles.selectedPressedBottomHighlight, { backgroundColor: theme.calendarBottomHighlight }]} />
            <View style={[styles.selectedPressedBorder, { borderColor: theme.selectedDayPanelBorder }]} />
          </View>
        ) : null}
        <View style={styles.dateBox}>
          <Text
            style={[
              styles.dayText,
              { color: state.isOutsideMonth ? theme.outOfMonthText : theme.textPrimary },
              state.isSelected && { color: theme.selectedDayText, fontWeight: "800" },
            ]}
          >
            {dayNumber}
          </Text>
        </View>
        <View style={styles.dotRow}>
          {state.eventDots.slice(0, 3).map((dot) => (
            <View accessibilityLabel={dot.label} key={dot.id} style={[styles.dot, { backgroundColor: dot.color }]} />
          ))}
          {overflowCount > 0 ? (
            <Text style={[styles.dotOverflow, { color: state.isSelected ? theme.selectedDayText : theme.textMuted }]}>+{overflowCount}</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dateBlock: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: 10,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    overflow: "hidden",
    paddingTop: 3,
    width: 42,
  },
  dateBox: {
    alignItems: "center",
    height: 26,
    justifyContent: "center",
    width: 38,
  },
  dayCell: {
    alignItems: "center",
    height: 46,
    justifyContent: "center",
    width: `${100 / 7}%`,
  },
  dayCellPressed: {
    transform: [{ scale: 0.96 }],
  },
  dayText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
  },
  dot: {
    borderRadius: 2,
    height: 4,
    width: 4,
  },
  dotOverflow: {
    fontSize: 7,
    fontWeight: "900",
    lineHeight: 8,
    marginLeft: 1,
  },
  dotRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    height: 9,
    marginTop: 1,
  },
  selectedPressedBorder: {
    borderRadius: 8,
    borderWidth: 1,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  selectedPressedBottomHighlight: {
    bottom: 0,
    height: 2,
    left: 3,
    position: "absolute",
    right: 3,
  },
  selectedPressedSurface: {
    borderRadius: 8,
    bottom: 3,
    left: 3,
    overflow: "hidden",
    position: "absolute",
    right: 3,
    top: 3,
  },
  selectedPressedTopShadow: {
    height: 9,
    left: 0,
    opacity: 0.85,
    position: "absolute",
    right: 0,
    top: 0,
  },
  weekDateBlock: {
    height: 42,
    width: 42,
  },
  weekDayCell: {
    height: 46,
  },
});
