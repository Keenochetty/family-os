import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { ActionButton, BottomSheetShell, HealthCard, PrivacyBadge, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import { scanHistoryPreview, scanModes, scanResultStates, type ScanResultPreview } from "./scanData";

function ScanModeCard({ description, label, realm }: { description: string; label: string; realm: ScanResultPreview["realm"] }): JSX.Element {
  return <HealthCard privacy="private" realm={realm} title={label} description={description} />;
}

function ResultCard({ item, onReview }: { item: ScanResultPreview; onReview: (item: ScanResultPreview) => void }): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <HealthCard
      action={<ActionButton label={item.primaryAction} onPress={() => onReview(item)} variant="secondary" />}
      description={item.summary}
      privacy={item.privacy}
      realm={item.realm}
      title={item.title}
    >
      <View style={styles.resultMeta}>
        <RealmBadge realm={item.realm} label={item.modeLabel} />
        <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>Confidence: {item.confidence}</Text>
        {item.caution ? <Text style={[styles.cautionText, { color: theme.colors.caution }]}>{item.caution}</Text> : null}
      </View>
    </HealthCard>
  );
}

export function ScanScreen(): JSX.Element {
  const [reviewItem, setReviewItem] = useState<ScanResultPreview | null>(null);
  const theme = useHealthOSTheme();
  const router = useRouter();

  return (
    <>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <PrivacyBadge privacy="private" />
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Scan</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Understand labels, documents, medications, food, vitals, and forms. Every result is reviewed before saving.
          </Text>
        </View>

        <View style={[styles.camera, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={[styles.scanFrame, { borderColor: theme.brand.ai }]}>
            <Text style={[styles.cameraText, { color: theme.colors.textPrimary }]}>Camera placeholder</Text>
            <Text style={[styles.cameraSubtext, { color: theme.colors.textSecondary }]}>Auto-detect looks for barcode, medication, document, food, vitals, or school form.</Text>
          </View>
          <View style={styles.cameraActions}>
            <ActionButton label="Scan" onPress={() => setReviewItem(scanResultStates[0])} />
            <ActionButton label="Use photo" onPress={() => setReviewItem(scanResultStates[2])} variant="secondary" />
            <ActionButton label="Upload document" onPress={() => setReviewItem(scanResultStates[2])} variant="secondary" />
          </View>
        </View>

        <SectionHeader title="Auto-detect modes" subtitle="Detection drafts are private until reviewed and saved." />
        <View style={styles.modeGrid}>
          {scanModes.map((mode) => (
            <ScanModeCard key={mode.id} label={mode.label} description={mode.description} realm={mode.realm} />
          ))}
        </View>

        <SectionHeader title="Detected states" subtitle="Examples of review-before-save behavior." />
        {scanResultStates.map((item) => (
          <ResultCard key={item.id} item={item} onReview={setReviewItem} />
        ))}

        <HealthCard
          privacy="private"
          realm="doctorWarning"
          title="Medical safety wording"
          description="Possible concern found. Please confirm with a healthcare professional or pharmacist. Health OS does not diagnose."
        />

        <SectionHeader title="Scan history preview" subtitle="History remains private unless explicitly shared." />
        {scanHistoryPreview.map((item) => (
          <ResultCard key={item.id} item={item} onReview={setReviewItem} />
        ))}
      </ScrollView>

      <Modal animationType="fade" onRequestClose={() => setReviewItem(null)} transparent visible={Boolean(reviewItem)}>
        <View style={styles.modalRoot}>
          <Pressable accessibilityRole="button" onPress={() => setReviewItem(null)} style={styles.scrim} />
          <BottomSheetShell title="Review before saving">
            {reviewItem ? (
              <>
                <HealthCard privacy={reviewItem.privacy} realm={reviewItem.realm} title={reviewItem.title} description={reviewItem.summary}>
                  <Text style={[styles.reviewText, { color: theme.colors.textSecondary }]}>AI/OCR prepared this. Please review before saving.</Text>
                  {reviewItem.caution ? <Text style={[styles.cautionText, { color: theme.colors.caution }]}>{reviewItem.caution}</Text> : null}
                </HealthCard>
                <View style={styles.reviewActions}>
                  <ActionButton label="Save to records" onPress={() => router.push("/records" as Href)} />
                  <ActionButton label="Ask AI" onPress={() => router.push("/ai" as Href)} variant="secondary" />
                  <ActionButton label="Share" onPress={() => router.push("/modals/privacy-review" as Href)} variant="secondary" />
                  <ActionButton label="Add to allergy profile" onPress={() => router.push("/health" as Href)} variant="secondary" />
                  <ActionButton label="Add to meal plan" onPress={() => router.push("/food" as Href)} variant="secondary" />
                  <ActionButton label="Add to grocery list" onPress={() => router.push("/family" as Href)} variant="secondary" />
                  <ActionButton label="Add reminder" onPress={() => router.push("/calendar" as Href)} variant="secondary" />
                  <ActionButton label="Attach to person" onPress={() => router.push("/family" as Href)} variant="secondary" />
                  <ActionButton label="Report incorrect result" onPress={() => setReviewItem(null)} variant="ghost" />
                </View>
              </>
            ) : null}
          </BottomSheetShell>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  camera: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  cameraActions: {
    gap: spacing.sm,
  },
  cameraSubtext: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    textAlign: "center",
  },
  cameraText: {
    fontSize: typography.title3.fontSize,
    fontWeight: typography.title3.fontWeight,
    lineHeight: typography.title3.lineHeight,
    textAlign: "center",
  },
  cautionText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "800",
    lineHeight: typography.caption.lineHeight,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 150,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  hero: {
    gap: spacing.sm,
  },
  metaText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modeGrid: {
    gap: spacing.md,
  },
  resultMeta: {
    gap: spacing.sm,
  },
  reviewActions: {
    gap: spacing.sm,
  },
  reviewText: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  scanFrame: {
    alignItems: "center",
    borderRadius: radius.lg,
    borderStyle: "dashed",
    borderWidth: 2,
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 240,
    padding: spacing.lg,
  },
  scrim: {
    backgroundColor: "rgba(15,23,42,0.34)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
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
