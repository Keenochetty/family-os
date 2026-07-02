import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionButton, HealthCard, PrivacyBadge, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import { sharedDataItems } from "./privacyData";

const reviewChecklist = [
  "Confirm who can view the item.",
  "Remove child photos, health notes, location, provider names, and record details if not needed.",
  "Set expiry for caregiver, school, link, or support access.",
  "Create privacy_review_completed and permission_changed audit events.",
];

export function PrivacyReviewScreen(): JSX.Element {
  const router = useRouter();
  const theme = useHealthOSTheme();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard privacy="private" realm="records" title="Privacy review" description="Every sensitive share, export, AI save, or permission change must pass through this UI before future backend writes." />
      <SectionHeader title="Review checklist" />
      <HealthCard privacy="private" realm="doctorWarning" title="Before sharing">
        {reviewChecklist.map((item) => (
          <View key={item} style={styles.row}>
            <View style={[styles.dot, { backgroundColor: theme.colors.danger }]} />
            <Text style={[styles.copy, { color: theme.colors.textSecondary }]}>{item}</Text>
          </View>
        ))}
      </HealthCard>

      <SectionHeader title="Shared data review" />
      {sharedDataItems.map((item) => (
        <HealthCard
          action={<ActionButton label="Keep private" variant="secondary" />}
          description={`${item.description} Shared with ${item.sharedWith}.`}
          key={item.id}
          privacy={item.privacy}
          realm="records"
          title={item.title}
        >
          <View style={styles.badges}>
            <PrivacyBadge privacy={item.privacy} />
            <RealmBadge realm="records" label={item.type} />
          </View>
        </HealthCard>
      ))}
      <ActionButton label="Open consent center" onPress={() => router.push("/privacy/consent-center" as Href)} variant="primary" />
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
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  dot: {
    borderRadius: radius.pill,
    height: 8,
    marginTop: 5,
    width: 8,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
});
