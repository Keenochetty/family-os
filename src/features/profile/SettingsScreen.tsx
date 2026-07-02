import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { HealthCard, PrivacyBadge, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import { settingsGroups, type SettingsItem } from "./profileData";

function SettingsRow({ item }: { item: SettingsItem }): JSX.Element {
  const router = useRouter();
  const theme = useHealthOSTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(item.route as Href)}
      style={({ pressed }) => [styles.row, { borderColor: theme.colors.border }, pressed && styles.pressed]}
    >
      <View style={styles.rowText}>
        <View style={styles.rowHeader}>
          <Text style={[styles.rowTitle, { color: theme.colors.textPrimary }]}>{item.title}</Text>
          {item.reauthRequired ? <PrivacyBadge privacy="private" /> : null}
        </View>
        <Text style={[styles.rowDescription, { color: theme.colors.textSecondary }]}>{item.description}</Text>
      </View>
      <Text style={[styles.chevron, { color: theme.colors.textSecondary }]}>›</Text>
    </Pressable>
  );
}

export function SettingsScreen(): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard
        privacy="private"
        realm="records"
        title="Settings"
        description="Account, privacy, health, family, AI, data, and legal controls. Sensitive settings include re-auth placeholders before real changes."
      >
        <View style={styles.statusRow}>
          <RealmBadge realm="records" label="Re-auth ready" />
          <RealmBadge realm="ai" label="Review before save" />
        </View>
      </HealthCard>

      {settingsGroups.map((group) => (
        <View key={group.id} style={styles.group}>
          <SectionHeader title={group.title} />
          <View style={[styles.groupCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            {group.items.map((item) => (
              <SettingsRow item={item} key={item.id} />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chevron: {
    fontSize: 28,
    lineHeight: 32,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 150,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  group: {
    gap: spacing.sm,
  },
  groupCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.78,
  },
  row: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowDescription: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  rowHeader: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  rowTitle: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
