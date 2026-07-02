import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionButton, HealthCard, PrivacyBadge, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { brandColors, radius, spacing, typography } from "@/theme";

import { healthSummary, profileIdentity, profilePreviews } from "./profileData";

export function ProfileScreen(): JSX.Element {
  const router = useRouter();
  const theme = useHealthOSTheme();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.hero, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.avatarWrap}>
          <View style={[styles.avatarHalo, { backgroundColor: `${brandColors.primary}18`, borderColor: `${brandColors.primary}33` }]}>
            <View style={[styles.avatar, { backgroundColor: theme.brand.primary }]}>
              <Text style={styles.avatarText}>K</Text>
            </View>
          </View>
          <View style={[styles.pulse, { borderColor: `${theme.brand.primary}55` }]} />
        </View>
        <View style={styles.heroText}>
          <PrivacyBadge privacy="private" />
          <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{profileIdentity.displayName}</Text>
          <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
            {profileIdentity.role} • {profileIdentity.accountType}
          </Text>
          <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
            {profileIdentity.region} • {profileIdentity.languageUnits}
          </Text>
        </View>
        <View style={[styles.planBadge, { backgroundColor: `${theme.brand.primary}18`, borderColor: `${theme.brand.primary}55` }]}>
          <Text style={[styles.planText, { color: theme.brand.primary }]}>{profileIdentity.plan}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <ActionButton label="Settings" onPress={() => router.push("/profile/settings" as Href)} variant="primary" />
        <ActionButton label="Edit profile" onPress={() => router.push("/profile/avatar" as Href)} variant="secondary" />
      </View>

      <SectionHeader title="Health summary" subtitle="Private profile-level summary, not a medical diagnosis." />
      <HealthCard privacy="private" realm="vitals" title="Today at a glance" description="Sensitive health data stays scoped to this profile unless explicitly shared.">
        <View style={styles.summaryGrid}>
          {healthSummary.map((item) => (
            <View key={item.label} style={[styles.summaryTile, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>{item.label}</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>{item.value}</Text>
            </View>
          ))}
        </View>
      </HealthCard>

      <SectionHeader title="Profile previews" subtitle="Quick access to Moments, family circles, devices, and privacy." />
      {profilePreviews.map((item) => (
        <HealthCard
          action={<ActionButton label="Open" onPress={() => router.push(item.route as Href)} variant="secondary" />}
          description={item.description}
          key={item.id}
          privacy={item.privacy}
          realm={item.tone}
          title={item.title}
        />
      ))}

      <SectionHeader title="Privacy status" subtitle="Sensitive screens require re-auth before real data changes." />
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/profile/settings/privacy" as Href)}
        style={({ pressed }) => [styles.privacyPanel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, pressed && styles.pressed]}
      >
        <RealmBadge realm="records" label="Protected" />
        <Text style={[styles.privacyTitle, { color: theme.colors.textPrimary }]}>Private by default</Text>
        <Text style={[styles.privacyCopy, { color: theme.colors.textSecondary }]}>
          Family sharing, device sync, AI memory, data export, and account deletion all require consent or re-auth placeholders before backend work.
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  avatar: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 82,
    justifyContent: "center",
    width: 82,
  },
  avatarHalo: {
    alignItems: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 108,
    justifyContent: "center",
    width: 108,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
  },
  avatarWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 150,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  hero: {
    alignItems: "center",
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.xl,
  },
  heroText: {
    alignItems: "center",
    gap: spacing.xs,
  },
  meta: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    textAlign: "center",
  },
  name: {
    fontSize: typography.title1.fontSize,
    fontWeight: typography.title1.fontWeight,
    lineHeight: typography.title1.lineHeight,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  planBadge: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  planText: {
    fontSize: typography.tinyLabel.fontSize,
    fontWeight: "800",
    lineHeight: typography.tinyLabel.lineHeight,
  },
  privacyCopy: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  privacyPanel: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  privacyTitle: {
    fontSize: typography.title3.fontSize,
    fontWeight: typography.title3.fontWeight,
    lineHeight: typography.title3.lineHeight,
  },
  pulse: {
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 122,
    position: "absolute",
    width: 122,
  },
  summaryGrid: {
    gap: spacing.md,
  },
  summaryLabel: {
    fontSize: typography.tinyLabel.fontSize,
    fontWeight: typography.tinyLabel.fontWeight,
    lineHeight: typography.tinyLabel.lineHeight,
    textTransform: "uppercase",
  },
  summaryTile: {
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  summaryValue: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
});
