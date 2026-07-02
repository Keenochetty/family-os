import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionButton, HealthCard, PlanLockBadge, PrivacyBadge, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { evaluateFeatureGate } from "@/security";
import { radius, spacing, typography } from "@/theme";

import { comparisonRows, featureGateModels, featureLabels, plans } from "./subscriptionData";

export function SubscriptionScreen(): JSX.Element {
  const router = useRouter();
  const theme = useHealthOSTheme();
  const currentPlan = "free";

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard
        privacy="private"
        realm="records"
        title="Plan & billing"
        description="Feature locks show safe previews only. Locked states never expose private records, reports, scans, chats, or exports."
      >
        <View style={styles.badges}>
          <RealmBadge realm="records" label="Current: Free" />
          <PrivacyBadge privacy="private" />
        </View>
      </HealthCard>

      <SectionHeader title="Feature gates" subtitle="Soft disabled cards explain features without leaking private data." />
      {featureGateModels.map((feature) => {
        const gate = evaluateFeatureGate(currentPlan, feature.featureKey, feature.currentUsage);
        const usageText = feature.usageLimit ? `${feature.currentUsage}/${feature.usageLimit} used` : "No current access";
        return (
          <View key={feature.featureKey} style={[styles.lockedCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, opacity: gate.enabled ? 1 : 0.78 }]}>
            <View style={styles.lockedHeader}>
              <View style={styles.lockedCopy}>
                <PlanLockBadge lock={feature.requiredPlan === "family" ? "familyRequired" : feature.requiredPlan === "care_school" ? "careSchoolRequired" : "plusRequired"} />
                <Text style={[styles.lockedTitle, { color: theme.colors.textPrimary }]}>{featureLabels[feature.featureKey]}</Text>
                <Text style={[styles.lockedDescription, { color: theme.colors.textSecondary }]}>{feature.upgradeMessage}</Text>
              </View>
              <ActionButton label="Upgrade" onPress={() => router.push("/modals/subscription-upgrade" as Href)} variant="secondary" />
            </View>
            <View style={[styles.safePreview, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
              <Text style={[styles.safePreviewTitle, { color: theme.colors.textPrimary }]}>Safe preview only</Text>
              <Text style={[styles.safePreviewText, { color: theme.colors.textSecondary }]}>
                {usageText} • Resets: {feature.resetPeriod} • Trial: {feature.trialAvailable ? "available" : "not available"}
              </Text>
            </View>
          </View>
        );
      })}

      <SectionHeader title="Compare plans" />
      {plans.map((plan) => (
        <HealthCard
          action={plan.id === currentPlan ? <RealmBadge realm="records" label="Current" /> : <ActionButton label="Choose" onPress={() => router.push("/modals/subscription-upgrade" as Href)} variant="secondary" />}
          description={plan.description}
          key={plan.id}
          privacy="publicPreview"
          realm={plan.recommended ? "familyHealth" : "records"}
          title={`${plan.label} • ${plan.monthlyPrice}/mo`}
        />
      ))}

      <View style={[styles.compareTable, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {comparisonRows.map((row) => (
          <View key={row.label} style={[styles.compareRow, { borderColor: theme.colors.border }]}>
            <Text style={[styles.compareLabel, { color: theme.colors.textPrimary }]}>{row.label}</Text>
            <Text style={[styles.compareValue, { color: theme.colors.textSecondary }]}>Free: {row.free}</Text>
            <Text style={[styles.compareValue, { color: theme.colors.textSecondary }]}>Plus: {row.plus}</Text>
            <Text style={[styles.compareValue, { color: theme.colors.textSecondary }]}>Family: {row.family}</Text>
            <Text style={[styles.compareValue, { color: theme.colors.textSecondary }]}>Care / School: {row.care_school}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <ActionButton label="Restore purchases" variant="secondary" />
        <ActionButton label="Manage subscription" variant="secondary" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  compareLabel: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  compareRow: {
    borderBottomWidth: 1,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  compareTable: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  compareValue: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 150,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  lockedCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  lockedCopy: {
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
  },
  lockedDescription: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  lockedHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
  },
  lockedTitle: {
    fontSize: typography.title3.fontSize,
    fontWeight: typography.title3.fontWeight,
    lineHeight: typography.title3.lineHeight,
  },
  safePreview: {
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  safePreviewText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  safePreviewTitle: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
});
