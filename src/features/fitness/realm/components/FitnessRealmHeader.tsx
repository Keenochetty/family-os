import type { JSX } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from "react-native-reanimated";

import type { FitnessTab } from "@/features/fitness/types/fitness";
import { fitnessRealmRadius, fitnessRealmSpacing, type FitnessRealmTheme } from "@/features/fitness/realm/theme/fitnessRealmTheme";

type FitnessWeekDay = {
  date: string;
  day: string;
  state: "selected" | "today" | "scheduled" | "completed" | "rest";
};

type FitnessRealmHeaderProps = {
  activeTab: FitnessTab;
  onTabChange: (tab: FitnessTab) => void;
  progressPercent?: number;
  scrollY: SharedValue<number>;
  selectedDateLabel?: string;
  subtitle?: string;
  tabs: { id: FitnessTab; label: string }[];
  theme: FitnessRealmTheme;
  title?: string;
  week?: FitnessWeekDay[];
};

export function FitnessRealmHeader({
  activeTab,
  onTabChange,
  progressPercent,
  scrollY,
  selectedDateLabel = "Today",
  subtitle = "29-day strength plan",
  tabs,
  theme,
  title = "Fitness",
  week,
}: FitnessRealmHeaderProps): JSX.Element {
  const containerStyle = useAnimatedStyle(() => ({
    paddingBottom: interpolate(scrollY.value, [0, 120], [14, 10], "clamp"),
    paddingTop: interpolate(scrollY.value, [0, 120], [20, 10], "clamp"),
  }));
  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scrollY.value, [0, 120], [1, 0.9], "clamp") }],
  }));

  return (
    <Animated.View style={[styles.header, { backgroundColor: theme.page, borderColor: theme.line }, containerStyle]}>
      <View style={styles.headerTop}>
        <View style={styles.titleWrap}>
          <Animated.Text style={[styles.title, { color: theme.text }, titleStyle]}>{title}</Animated.Text>
          <Text numberOfLines={1} style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>
        </View>
        {typeof progressPercent === "number" ? (
          <View style={[styles.progressPill, { backgroundColor: theme.accentSoft, borderColor: theme.accent }]}>
            <Text style={[styles.progressValue, { color: theme.accent }]}>{progressPercent}%</Text>
            <Text style={[styles.progressLabel, { color: theme.textMuted }]}>plan</Text>
          </View>
        ) : null}
        <Pressable accessibilityLabel="Fitness options" accessibilityRole="button" style={[styles.optionsButton, { backgroundColor: theme.surface2, borderColor: theme.line }]}>
          <Text style={[styles.optionsText, { color: theme.text }]}>...</Text>
        </Pressable>
      </View>
      {week ? <FitnessWeekStrip selectedDateLabel={selectedDateLabel} theme={theme} week={week} /> : null}
      <View style={[styles.tabs, { backgroundColor: theme.surface2, borderColor: theme.line }]}>
        {tabs.map((tab) => {
          const active = tab.id === activeTab;

          return (
            <Pressable accessibilityRole="button" key={tab.id} onPress={() => onTabChange(tab.id)} style={[styles.tabButton, { backgroundColor: active ? theme.surface1 : "transparent" }]}>
              <Text style={[styles.tabLabel, { color: active ? theme.accent : theme.textMuted }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

function FitnessWeekStrip({ selectedDateLabel, theme, week }: { selectedDateLabel: string; theme: FitnessRealmTheme; week: FitnessWeekDay[] }): JSX.Element {
  return (
    <View>
      <View style={styles.weekHeader}>
        <Text style={[styles.weekLabel, { color: theme.textMuted }]}>{selectedDateLabel}</Text>
        <Text style={[styles.weekHint, { color: theme.textSubtle }]}>Move, fuel, recover</Text>
      </View>
      <View style={styles.weekStrip}>
        {week.map((day) => {
          const selected = day.state === "selected";
          const completed = day.state === "completed";
          const scheduled = day.state === "scheduled";
          const dotColor = completed ? theme.success : scheduled || selected ? theme.accent : theme.textSubtle;

          return (
            <View
              key={`${day.day}-${day.date}`}
              style={[
                styles.weekDay,
                {
                  backgroundColor: selected ? theme.accent : theme.surface1,
                  borderColor: selected ? theme.accent : theme.line,
                },
              ]}
            >
              <Text style={[styles.weekDayLabel, { color: selected ? "#FFFFFF" : theme.textMuted }]}>{day.day}</Text>
              <Text style={[styles.weekDate, { color: selected ? "#FFFFFF" : theme.text }]}>{day.date}</Text>
              <View style={[styles.weekDot, { backgroundColor: dotColor, opacity: completed || scheduled || selected ? 1 : 0.28 }]} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: fitnessRealmSpacing.md,
    paddingHorizontal: fitnessRealmSpacing.lg,
  },
  headerTop: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: fitnessRealmSpacing.md,
  },
  optionsButton: {
    alignItems: "center",
    borderRadius: fitnessRealmRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    height: 38,
    justifyContent: "center",
    width: 44,
  },
  optionsText: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
    lineHeight: 16,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 12,
  },
  progressPill: {
    alignItems: "center",
    borderRadius: fitnessRealmRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 58,
    paddingHorizontal: fitnessRealmSpacing.sm,
    paddingVertical: 5,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 2,
  },
  tabButton: {
    alignItems: "center",
    borderRadius: fitnessRealmRadius.pill,
    flex: 1,
    justifyContent: "center",
    minHeight: 38,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 15,
  },
  tabs: {
    borderRadius: fitnessRealmRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 4,
    padding: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.6,
    lineHeight: 34,
    transformOrigin: "left",
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
  weekDate: {
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 20,
  },
  weekDay: {
    alignItems: "center",
    borderRadius: fitnessRealmRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: 3,
    minHeight: 64,
    paddingVertical: 7,
  },
  weekDayLabel: {
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 13,
  },
  weekDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  weekHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: fitnessRealmSpacing.sm,
  },
  weekHint: {
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
  },
  weekLabel: {
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 15,
    textTransform: "uppercase",
  },
  weekStrip: {
    flexDirection: "row",
    gap: 7,
  },
});
