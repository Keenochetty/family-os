import type { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarWeekdayRow({ color }: { color: string }): JSX.Element {
  return (
    <View style={styles.weekdayRow}>
      {WEEKDAYS.map((day) => (
        <Text key={day} style={[styles.weekdayText, { color }]}>
          {day}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
