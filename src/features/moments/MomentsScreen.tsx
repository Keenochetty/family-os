import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { ActionButton, ContextActionMenu, HealthCard, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { useHaptics } from "@/hooks";
import { radius, spacing, typography } from "@/theme";

import { MomentCard } from "./MomentCard";
import { latestMoment, momentActions, moments, momentTemplates, privacyReviewItems, type Moment, type MomentTemplate } from "./momentsData";

type OverlayState = "closed" | "create" | "celebration" | "privacy";

function TemplateCard({ template, onPress }: { onPress: (template: MomentTemplate) => void; template: MomentTemplate }): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(template)}
      style={({ pressed }) => [styles.templateCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, pressed && styles.pressed]}
    >
      <RealmBadge realm={template.tone} />
      <Text style={[styles.templateTitle, { color: theme.colors.textPrimary }]}>{template.title}</Text>
      <Text style={[styles.templateCopy, { color: theme.colors.textSecondary }]}>{template.description}</Text>
      <Text style={[styles.templateAction, { color: theme.brand.primary }]}>{template.action}</Text>
    </Pressable>
  );
}

export function MomentsScreen(): JSX.Element {
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [overlay, setOverlay] = useState<OverlayState>("closed");
  const haptics = useHaptics();
  const router = useRouter();
  const theme = useHealthOSTheme();

  async function openCelebration(): Promise<void> {
    await haptics.trigger("success");
    setOverlay("celebration");
  }

  async function openPrivacyReview(moment: Moment | null = selectedMoment): Promise<void> {
    setSelectedMoment(moment);
    await haptics.trigger("selection");
    setOverlay("privacy");
  }

  function openMoment(moment: Moment): void {
    setSelectedMoment(moment);
  }

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SectionHeader title="Latest Moment" subtitle="Private first. Share or export only after review." />
      <MomentCard moment={latestMoment} onLongPress={openMoment} onPress={openMoment} />

      <View style={styles.actions}>
        <ActionButton label="Create Moment" onPress={() => setOverlay("create")} variant="primary" />
        <ActionButton label="Privacy review" onPress={() => openPrivacyReview(latestMoment)} variant="secondary" />
      </View>

      <SectionHeader title="Gallery" subtitle="Mature memory cards without arcade rewards." />
      {moments.map((moment) => (
        <MomentCard key={moment.id} moment={moment} onLongPress={openMoment} onPress={openMoment} />
      ))}

      <SectionHeader title="Moment templates" subtitle="Start from photos, progress, events, or AI summaries." />
      <View style={styles.templateGrid}>
        {momentTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} onPress={() => setOverlay("create")} />
        ))}
      </View>

      <HealthCard privacy="private" realm="records" title="Before sharing or export" description="Sensitive data can be removed from every Moment before it leaves the private profile.">
        {privacyReviewItems.map((item) => (
          <View key={item} style={styles.reviewRow}>
            <View style={[styles.reviewDot, { backgroundColor: theme.brand.primary }]} />
            <Text style={[styles.reviewText, { color: theme.colors.textSecondary }]}>{item}</Text>
          </View>
        ))}
      </HealthCard>

      <Modal animationType="fade" onRequestClose={() => setSelectedMoment(null)} transparent visible={Boolean(selectedMoment) && overlay === "closed"}>
        <View style={styles.modalRoot}>
          <Pressable accessibilityRole="button" onPress={() => setSelectedMoment(null)} style={[styles.scrim, { backgroundColor: theme.colors.scrim }]} />
          <View style={[styles.menuDock, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <ContextActionMenu
              title={selectedMoment?.title}
              actions={[
                { id: "save", label: "Save private", onPress: () => setSelectedMoment(null) },
                { id: "share", label: "Share", onPress: () => openPrivacyReview() },
                { id: "export", label: "Export", onPress: () => openPrivacyReview() },
                { id: "ai", label: "Use AI summary", onPress: () => router.push("/ai" as Href) },
                { id: "celebrate", label: "Show celebration", onPress: openCelebration },
              ]}
            />
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" onRequestClose={() => setOverlay("closed")} transparent visible={overlay === "create"}>
        <View style={styles.modalRoot}>
          <Pressable accessibilityRole="button" onPress={() => setOverlay("closed")} style={[styles.scrim, { backgroundColor: theme.colors.scrim }]} />
          <View style={[styles.sheet, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}>Create Moment</Text>
            <View style={styles.actionGrid}>
              {momentActions.slice(1, 5).map((action) => (
                <ActionButton key={action} label={action} onPress={() => setOverlay("privacy")} variant="secondary" />
              ))}
            </View>
            <ActionButton label="Save private" onPress={openCelebration} variant="primary" />
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" onRequestClose={() => setOverlay("closed")} transparent visible={overlay === "celebration"}>
        <View style={styles.centerModalRoot}>
          <Pressable accessibilityRole="button" onPress={() => setOverlay("closed")} style={[styles.scrim, { backgroundColor: theme.colors.scrim }]} />
          <View style={[styles.celebrationCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={[styles.celebrationPhoto, { backgroundColor: `${theme.brand.primary}18`, borderColor: `${theme.brand.primary}55` }]} />
            <Text style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}>Moment saved privately</Text>
            <Text style={[styles.sheetCopy, { color: theme.colors.textSecondary }]}>You can share or export after removing sensitive details.</Text>
            <ActionButton label="Done" onPress={() => setOverlay("closed")} variant="primary" />
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" onRequestClose={() => setOverlay("closed")} transparent visible={overlay === "privacy"}>
        <View style={styles.modalRoot}>
          <Pressable accessibilityRole="button" onPress={() => setOverlay("closed")} style={[styles.scrim, { backgroundColor: theme.colors.scrim }]} />
          <View style={[styles.sheet, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}>Privacy review</Text>
            <Text style={[styles.sheetCopy, { color: theme.colors.textSecondary }]}>
              Remove sensitive details before sharing or exporting {selectedMoment ? selectedMoment.title : "this Moment"}.
            </Text>
            {(selectedMoment?.removableSensitiveData ?? ["Child photo", "Location", "Health note"]).map((item) => (
              <View key={item} style={[styles.sensitiveRow, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
                <Text style={[styles.sensitiveText, { color: theme.colors.textPrimary }]}>{item}</Text>
                <Text style={[styles.removeText, { color: theme.colors.danger }]}>Remove</Text>
              </View>
            ))}
            <View style={styles.actions}>
              <ActionButton label="Save private" onPress={openCelebration} variant="primary" />
              <ActionButton label="Open review" onPress={() => router.push("/modals/privacy-review" as Href)} variant="secondary" />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionGrid: {
    gap: spacing.md,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  celebrationCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.lg,
    margin: spacing.lg,
    padding: spacing.xl,
  },
  celebrationPhoto: {
    aspectRatio: 1.7,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  centerModalRoot: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 150,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
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
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  removeText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "800",
    lineHeight: typography.caption.lineHeight,
  },
  reviewDot: {
    borderRadius: radius.pill,
    height: 8,
    marginTop: 5,
    width: 8,
  },
  reviewRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  reviewText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  scrim: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  sensitiveRow: {
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  sensitiveText: {
    flex: 1,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.xl,
  },
  sheetCopy: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  sheetTitle: {
    fontSize: typography.title2.fontSize,
    fontWeight: typography.title2.fontWeight,
    lineHeight: typography.title2.lineHeight,
  },
  templateAction: {
    fontSize: typography.caption.fontSize,
    fontWeight: "800",
    lineHeight: typography.caption.lineHeight,
  },
  templateCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    minHeight: 172,
    padding: spacing.md,
    width: "47%",
  },
  templateCopy: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  templateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  templateTitle: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
});
