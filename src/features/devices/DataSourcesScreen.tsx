import type { JSX } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { HealthCard, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import { sourcePriority } from "./devicesData";

export function DataSourcesScreen(): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard
        privacy="private"
        realm="records"
        title="Data sources"
        description="Choose primary and fallback metric sources. Conflicts should be reviewed before any record is overwritten."
      />
      <SectionHeader title="Priority order" subtitle="Prepared model for future source-ranking controls." />
      {sourcePriority.map((source, index) => (
        <View key={source.metric} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <RealmBadge realm="records" label={`Priority ${index + 1}`} />
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{source.metric}</Text>
          <Text style={[styles.copy, { color: theme.colors.textSecondary }]}>Primary source: {source.primary}</Text>
          <Text style={[styles.copy, { color: theme.colors.textSecondary }]}>Fallback source: {source.fallback}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
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
  title: {
    fontSize: typography.title3.fontSize,
    fontWeight: typography.title3.fontWeight,
    lineHeight: typography.title3.lineHeight,
  },
});
