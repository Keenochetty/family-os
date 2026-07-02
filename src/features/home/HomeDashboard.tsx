import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useState } from "react";

import { ActionButton, ContextActionMenu, HealthCard, PlanLockBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";
import { MomentCard, latestMoment as latestMomentData } from "@/features/moments";

import { familyUpdates, lightSuggestions, quickActions, weeklyGlance, type HomeWidget } from "./homeData";

function WidgetCard({ compact = false, item, onLongPress }: { compact?: boolean; item: HomeWidget; onLongPress: (item: HomeWidget) => void }): JSX.Element {
  const router = useRouter();

  return (
    <HealthCard
      privacy={item.privacy}
      realm={item.realm}
      title={item.title}
      description={item.description}
      onLongPress={() => onLongPress(item)}
      action={<ActionButton label={item.actionLabel} onPress={() => router.push(item.route as Href)} variant={compact ? "secondary" : "primary"} />}
    />
  );
}

export function HomeDashboard(): JSX.Element {
  const [selectedWidget, setSelectedWidget] = useState<HomeWidget | null>(null);
  const router = useRouter();
  const theme = useHealthOSTheme();

  function openWidget(widget: HomeWidget): void {
    setSelectedWidget(null);
    router.push(widget.route as Href);
  }

  return (
    <View style={styles.root}>
      <SectionHeader title="Latest Moment" subtitle="Saved privately unless you choose to share." />
      <MomentCard compact moment={latestMomentData} onPress={() => router.push("/profile/moments" as Href)} />

      <SectionHeader title="Today's family updates" subtitle="Only items with mock circle permission flags are shown." />
      {familyUpdates.map((item) => (
        <WidgetCard key={item.id} item={item} onLongPress={setSelectedWidget} />
      ))}

      <SectionHeader title="Light suggestions" subtitle="Helpful prompts with clear reasons and no shame." />
      {lightSuggestions.map((item) => (
        <WidgetCard key={item.id} item={item} onLongPress={setSelectedWidget} />
      ))}

      <SectionHeader title="Weekly glance" subtitle="A compact summary, not a dashboard dump." />
      {weeklyGlance.map((item) => (
        <WidgetCard key={item.id} item={item} onLongPress={setSelectedWidget} />
      ))}

      <View style={[styles.featureGate, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.featureCopy}>
          <Text style={[styles.featureTitle, { color: theme.colors.textPrimary }]}>Doctor report</Text>
          <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>Safe preview only. Report contents stay hidden until unlocked and confirmed.</Text>
        </View>
        <PlanLockBadge lock="plusRequired" />
      </View>

      <SectionHeader title="Quick actions" subtitle="Start, log, review, or create. Long press for more." />
      <View style={styles.quickGrid}>
        {quickActions.map((item) => (
          <Pressable
            accessibilityLabel={item.title}
            accessibilityRole="button"
            key={item.id}
            onLongPress={() => setSelectedWidget(item)}
            onPress={() => router.push(item.route as Href)}
            style={({ pressed }) => [
              styles.quickTile,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.quickDot, { backgroundColor: theme.realms[item.realm] }]} />
            <Text numberOfLines={1} style={[styles.quickTitle, { color: theme.colors.textPrimary }]}>
              {item.title}
            </Text>
            <Text numberOfLines={2} style={[styles.quickText, { color: theme.colors.textSecondary }]}>
              {item.description}
            </Text>
          </Pressable>
        ))}
      </View>

      <Modal animationType="fade" onRequestClose={() => setSelectedWidget(null)} transparent visible={Boolean(selectedWidget)}>
        <View style={styles.modalRoot}>
          <Pressable accessibilityRole="button" onPress={() => setSelectedWidget(null)} style={styles.scrim} />
          <View style={[styles.menuDock, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <ContextActionMenu
              title={selectedWidget?.title}
              actions={[
                { id: "open", label: "Open", onPress: () => selectedWidget && openWidget(selectedWidget) },
                { id: "review", label: "Review privacy", onPress: () => setSelectedWidget(null) },
                { id: "share", label: "Share after review", onPress: () => router.push("/modals/privacy-review" as Href) },
                { id: "ask-ai", label: "Ask AI", onPress: () => router.push("/ai" as Href) },
                { id: "hide", label: "Hide this suggestion", onPress: () => setSelectedWidget(null) },
              ]}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  featureCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  featureGate: {
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
  featureText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    lineHeight: typography.caption.lineHeight,
  },
  featureTitle: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  menuDock: {
    borderRadius: radius.lg,
    borderWidth: 1,
    margin: spacing.lg,
    overflow: "hidden",
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  quickDot: {
    borderRadius: radius.pill,
    height: 10,
    width: 10,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  quickText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    lineHeight: typography.caption.lineHeight,
  },
  quickTile: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    minHeight: 126,
    padding: spacing.md,
    width: "47%",
  },
  quickTitle: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  root: {
    gap: spacing.lg,
  },
  scrim: {
    backgroundColor: "rgba(15,23,42,0.34)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
