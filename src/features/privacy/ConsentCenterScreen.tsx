import type { JSX } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useState } from "react";

import { HealthCard, PrivacyBadge, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { spacing, typography } from "@/theme";

import { consentItems } from "./privacyData";

export function ConsentCenterScreen(): JSX.Element {
  const [items, setItems] = useState(consentItems);
  const theme = useHealthOSTheme();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard privacy="private" realm="records" title="Consent center" description="Mock toggles only. Future backend must write consent records and audit events for every change." />
      <SectionHeader title="Consent categories" subtitle="Each data type is controlled separately." />
      {items.map((item) => (
        <View key={item.id} style={[styles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.copy}>
            <View style={styles.badges}>
              <RealmBadge realm={item.realm} />
              {item.requiresReview ? <PrivacyBadge privacy="private" /> : null}
            </View>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{item.label}</Text>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{item.description}</Text>
          </View>
          <Switch
            onValueChange={(enabled) => setItems((current) => current.map((next) => (next.id === item.id ? { ...next, enabled } : next)))}
            thumbColor="#FFFFFF"
            trackColor={{ false: theme.colors.surfaceAlt, true: theme.brand.primary }}
            value={item.enabled}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 150,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  copy: {
    flex: 1,
    gap: spacing.sm,
  },
  description: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  row: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
});
