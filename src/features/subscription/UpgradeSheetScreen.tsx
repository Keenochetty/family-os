import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionButton, HealthCard, PlanLockBadge, PrivacyBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { spacing, typography } from "@/theme";

import { plans } from "./subscriptionData";

export function UpgradeSheetScreen(): JSX.Element {
  const router = useRouter();
  const theme = useHealthOSTheme();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard privacy="publicPreview" realm="records" title="Upgrade" description="Choose a plan when it is useful. Private data stays hidden in locked previews." />
      <SectionHeader title="Recommended options" subtitle="No aggressive countdowns or misleading pressure." />
      {plans
        .filter((plan) => plan.id !== "free")
        .map((plan) => (
          <HealthCard
            action={<ActionButton label="Select" variant="secondary" />}
            description={plan.description}
            key={plan.id}
            privacy="publicPreview"
            realm={plan.id === "family" ? "familyHealth" : "records"}
            title={`${plan.label} • ${plan.monthlyPrice}/mo`}
          >
            <View style={styles.badgeRow}>
              <PlanLockBadge lock={plan.id === "family" ? "familyRequired" : plan.id === "care_school" ? "careSchoolRequired" : "plusRequired"} />
              <PrivacyBadge privacy="publicPreview" />
            </View>
          </HealthCard>
        ))}
      <Text style={[styles.note, { color: theme.colors.textSecondary }]}>Billing integration is a placeholder. Restore purchases and manage subscription stay available from Plan & billing.</Text>
      <ActionButton label="Compare all plans" onPress={() => router.push("/profile/plan" as Href)} variant="primary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  note: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    textAlign: "center",
  },
});
