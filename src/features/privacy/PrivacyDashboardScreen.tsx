import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionButton, HealthCard, PrivacyBadge, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import { consentItems, futurePrivacyHooks, sharedDataItems } from "./privacyData";

export function PrivacyDashboardScreen(): JSX.Element {
  const router = useRouter();
  const theme = useHealthOSTheme();
  const enabledCount = consentItems.filter((item) => item.enabled).length;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <PrivacyBadge privacy="private" />
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Privacy dashboard</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Private by default. Every sensitive share requires review before it leaves your account.</Text>
      </View>

      <View style={styles.actions}>
        <ActionButton label="Consent center" onPress={() => router.push("/privacy/consent-center" as Href)} />
        <ActionButton label="Activity log" onPress={() => router.push("/activity-log" as Href)} variant="secondary" />
      </View>

      <HealthCard privacy="private" realm="records" title="Privacy status" description={`${enabledCount} of ${consentItems.length} consent categories enabled. Sensitive categories remain review-gated.`}>
        <View style={styles.badgeRow}>
          <RealmBadge realm="records" label="Review required" />
          <RealmBadge realm="ai" label="AI memory off by default" />
        </View>
      </HealthCard>

      <SectionHeader title="Shared data review" subtitle="Current mock shares with scope labels." />
      {sharedDataItems.map((item) => (
        <HealthCard
          action={<ActionButton label="Review" onPress={() => router.push("/modals/privacy-review" as Href)} variant="secondary" />}
          description={`${item.type} • Shared with ${item.sharedWith}. ${item.description}`}
          key={item.id}
          privacy={item.privacy}
          realm="records"
          title={item.title}
        />
      ))}

      <SectionHeader title="Future hooks" subtitle="Explicit backend integration points for later phases." />
      <HealthCard privacy="private" realm="records" title="Security hooks">
        {futurePrivacyHooks.map((hook) => (
          <View key={hook} style={styles.hookRow}>
            <View style={[styles.dot, { backgroundColor: theme.brand.primary }]} />
            <Text style={[styles.hookText, { color: theme.colors.textSecondary }]}>{hook}</Text>
          </View>
        ))}
      </HealthCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  badgeRow: {
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
  dot: {
    borderRadius: radius.pill,
    height: 8,
    marginTop: 5,
    width: 8,
  },
  hero: {
    gap: spacing.sm,
  },
  hookRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  hookText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
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
