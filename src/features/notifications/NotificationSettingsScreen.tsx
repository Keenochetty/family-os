import type { JSX } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useState } from "react";

import { HealthCard, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import { notificationPreferences } from "./notificationsData";

export function NotificationSettingsScreen(): JSX.Element {
  const [items, setItems] = useState(notificationPreferences);
  const theme = useHealthOSTheme();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard privacy="private" realm="records" title="Notification settings" description="Configure private notification behavior, quiet hours placeholders, and suggestion tone." />
      <SectionHeader title="Categories" subtitle="Emergency and sensitive health notifications should never expose private data in previews." />
      {items.map((item) => (
        <View key={item.id} style={[styles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.copy}>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{item.label}</Text>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{item.description}</Text>
          </View>
          <Switch
            onValueChange={(enabled) => setItems((current) => current.map((next) => (next.id === item.id ? { ...next, enabled } : next)))}
            thumbColor={theme.colors.surface}
            trackColor={{ false: theme.colors.surfaceAlt, true: theme.brand.primary }}
            value={item.enabled}
          />
        </View>
      ))}
      <HealthCard privacy="private" realm="records" title="Quiet hours" description="Placeholder: pause non-urgent suggestions overnight while emergency and critical health notifications stay available." />
      <HealthCard privacy="private" realm="ai" title="Suggestion tone" description="Suggestions stay light, explainable, and dismissible. No streak pressure, shame wording, or repeated nagging." />
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
    flex: 1,
    gap: spacing.xs,
  },
  description: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  label: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  row: {
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
});
