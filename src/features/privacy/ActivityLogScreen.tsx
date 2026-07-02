import type { JSX } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { HealthCard, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import { auditEvents } from "./privacyData";

function labelForType(type: string): string {
  return type.replaceAll("_", " ");
}

export function ActivityLogScreen(): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard privacy="private" realm="records" title="Activity log" description="Mock audit trail for views, changes, shares, permission changes, logins, device syncs, and support access." />
      <SectionHeader title="Audit events" subtitle="Future backend should append immutable audit records." />
      {auditEvents.map((event) => (
        <View key={event.id} style={[styles.eventCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.eventHeader}>
            <RealmBadge realm={event.type === "device_sync" ? "vitals" : event.type === "support_access" ? "caregiver" : "records"} label={labelForType(event.type)} />
            <Text style={[styles.date, { color: theme.colors.textSecondary }]}>{new Date(event.createdAt).toLocaleString()}</Text>
          </View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{event.actorUserId}</Text>
          <Text style={[styles.copy, { color: theme.colors.textSecondary }]}>
            Target: {event.targetType} / {event.targetId}
          </Text>
          {event.metadata ? (
            <Text style={[styles.copy, { color: theme.colors.textSecondary }]}>
              {Object.entries(event.metadata)
                .map(([key, value]) => `${key}: ${String(value)}`)
                .join(" • ")}
            </Text>
          ) : null}
        </View>
      ))}
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
  copy: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  date: {
    fontSize: typography.tinyLabel.fontSize,
    fontWeight: typography.tinyLabel.fontWeight,
    lineHeight: typography.tinyLabel.lineHeight,
  },
  eventCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  eventHeader: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  title: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
});
