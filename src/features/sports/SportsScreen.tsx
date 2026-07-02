import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { GoalRing, HeartRateZoneChart, TrendLineChart, WeeklyBarChart } from "@/components/charts";
import { ActionButton, HealthCard, PrivacyBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import {
  plannedSportDay,
  sportActivities,
  sportDistanceData,
  sportHeartRateZones,
  sportSafetyNotes,
  sportTrendData,
  sportTypes,
  type SportActivity,
} from "./sportsData";

function SportActivityCard({ activity }: { activity: SportActivity }): JSX.Element {
  const router = useRouter();
  const theme = useHealthOSTheme();
  const actionLabel = activity.status === "needs_label" ? "Label" : activity.status === "planned" ? "Plan" : "Open";

  return (
    <HealthCard
      action={<ActionButton label={actionLabel} onPress={() => router.push(`/fitness/sports/${activity.id}` as Href)} variant="secondary" />}
      privacy="private"
      realm="sport"
      title={activity.title}
      description={`${activity.sport}${activity.importedFrom ? ` • Imported from ${activity.importedFrom}` : ""}`}
    >
      <View style={styles.metricGrid}>
        {activity.metrics.map((metric) => (
          <View key={metric.label} style={[styles.metricTile, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
            <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>{metric.label}</Text>
            <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>{metric.value}</Text>
          </View>
        ))}
      </View>
    </HealthCard>
  );
}

export function SportsScreen(): JSX.Element {
  const router = useRouter();
  const theme = useHealthOSTheme();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <PrivacyBadge privacy="private" />
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Sports</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Plan sport days, label imported workouts, add activities to weekly goals, and create private sport Moments.
        </Text>
      </View>

      <SectionHeader title="Plan sport day" subtitle="Calendar-first planning with invites and privacy scope." />
      <HealthCard
        action={<ActionButton label="Open calendar" onPress={() => router.push("/calendar" as Href)} variant="secondary" />}
        privacy="circle"
        realm="sport"
        title={plannedSportDay.title}
        description={`${plannedSportDay.date} • ${plannedSportDay.sport} • Invite ${plannedSportDay.invitees.join(", ")}`}
      />

      <SectionHeader title="Choose sport type" />
      <View style={styles.sportGrid}>
        {sportTypes.map((sport) => (
          <Pressable
            accessibilityRole="button"
            key={sport}
            onPress={() => router.push("/calendar" as Href)}
            style={({ pressed }) => [styles.sportChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, pressed && styles.pressed]}
          >
            <Text style={[styles.sportText, { color: theme.colors.textPrimary }]}>{sport}</Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Track and import" subtitle="Imported workouts stay private until reviewed and labeled." />
      {sportActivities.map((activity) => (
        <SportActivityCard activity={activity} key={activity.id} />
      ))}

      <SectionHeader title="Sport metrics" subtitle="Trend-based educational insights only." />
      <GoalRing dataSource="Weekly plan" goal={5} realm="sport" timeRange="This week" title="Weekly sport goal" unit="sessions" value={3} />
      <WeeklyBarChart data={sportTrendData} dataSource="Device + manual" realm="sport" timeRange="This week" title="Duration" unit="min" />
      <TrendLineChart data={sportDistanceData} dataSource="Imported workouts" realm="sport" timeRange="Last 4 weeks" title="Distance trend" unit="km" />
      <HeartRateZoneChart data={sportHeartRateZones} dataSource="Watch import" realm="sport" timeRange="Latest run" title="Heart-rate zones" />

      <SectionHeader title="Route and climate" subtitle="Placeholders until consented device data is available." />
      <HealthCard
        privacy="private"
        realm="sport"
        title="Route placeholder"
        description="Route, elevation, temperature, climate, hydration, perceived effort, and injury notes will require explicit consent before sync."
      />

      <SectionHeader title="After completion" />
      <HealthCard
        action={<ActionButton label="Create Moment" onPress={() => router.push("/profile/moments" as Href)} variant="secondary" />}
        privacy="private"
        realm="sport"
        title="Sport Moment"
        description="Create a private completion Moment after review. Remove route, heart rate, injury notes, or child details before sharing."
      />

      <HealthCard privacy="private" realm="doctorWarning" title="Safety notes">
        {sportSafetyNotes.map((note) => (
          <View key={note} style={styles.safetyRow}>
            <View style={[styles.dot, { backgroundColor: theme.realms.sport }]} />
            <Text style={[styles.safetyText, { color: theme.colors.textSecondary }]}>{note}</Text>
          </View>
        ))}
      </HealthCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: 150,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  dot: {
    borderRadius: radius.pill,
    height: 8,
    marginTop: 5,
    width: 8,
  },
  hero: {
    gap: spacing.sm,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  metricLabel: {
    fontSize: typography.tinyLabel.fontSize,
    fontWeight: typography.tinyLabel.fontWeight,
    lineHeight: typography.tinyLabel.lineHeight,
    textTransform: "uppercase",
  },
  metricTile: {
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
    width: "47%",
  },
  metricValue: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  safetyRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  safetyText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  sportChip: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    width: "47%",
  },
  sportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  sportText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "800",
    lineHeight: typography.caption.lineHeight,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  title: {
    fontSize: typography.title1.fontSize,
    fontWeight: typography.title1.fontWeight,
    lineHeight: typography.title1.lineHeight,
  },
});
