import type { JSX } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionButton, HealthCard, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

const supportScopes = ["Diagnostics only", "No health records", "No documents", "Expires in 30 minutes", "Audit support_access event"];

export function SupportSessionConsentScreen(): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard privacy="private" realm="caregiver" title="Support session consent" description="Grant temporary, limited access to support diagnostics. No real backend access exists yet." />
      <SectionHeader title="Session scope" subtitle="Support access should be narrow, explicit, expiring, and audited." />
      <View style={[styles.scopePanel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {supportScopes.map((scope) => (
          <View key={scope} style={styles.scopeRow}>
            <RealmBadge realm="caregiver" label="Scope" />
            <Text style={[styles.scopeText, { color: theme.colors.textSecondary }]}>{scope}</Text>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <ActionButton label="Allow session" variant="primary" />
        <ActionButton label="Deny" variant="danger" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 150,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  scopePanel: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  scopeRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  scopeText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
});
