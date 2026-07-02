import { usePathname, useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ActionButton, GlassSurface, HealthCard, PrivacyBadge } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { useHaptics } from "@/hooks";
import { radius, shadows, spacing, typography } from "@/theme";

import { mockAICommands, mockAISaveActions } from "./aiData";

type AIOverlayState = "closed" | "composer" | "half";

export function AIAssistantLayer(): JSX.Element | null {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useHealthOSTheme();
  const haptics = useHaptics();
  const [state, setState] = useState<AIOverlayState>("closed");
  const [draft, setDraft] = useState("Add soccer practice for Liam on Saturday at 9.");
  const hidden = pathname.startsWith("/ai") || pathname.startsWith("/fitness/session/");
  const promptText = useMemo(() => (draft.trim() ? draft : "Ask, scan, search, or create..."), [draft]);

  if (hidden) {
    return null;
  }

  async function openComposer(): Promise<void> {
    await haptics.trigger("light");
    setState("composer");
  }

  async function expandHalf(): Promise<void> {
    await haptics.trigger("medium");
    setState("half");
  }

  async function collapse(): Promise<void> {
    await haptics.trigger("light");
    setState("closed");
  }

  function openFullChat(): void {
    setState("closed");
    router.push("/ai" as Href);
  }

  return (
    <View pointerEvents="box-none" style={styles.layer}>
      <Pressable
        accessibilityLabel="Open Health OS AI assistant"
        accessibilityRole="button"
        onLongPress={expandHalf}
        onPress={openComposer}
        style={({ pressed }) => [styles.capsule, shadows.overlay, { backgroundColor: theme.colors.surfaceOverlay, borderColor: theme.colors.border }, pressed && styles.pressed]}
      >
        <Text style={[styles.spark, { color: theme.brand.ai }]}>AI</Text>
        <Text numberOfLines={1} style={[styles.capsuleText, { color: theme.colors.textPrimary }]}>
          {state === "closed" ? "Ask Health OS..." : promptText}
        </Text>
        <Pressable accessibilityLabel="Expand AI assistant" accessibilityRole="button" hitSlop={8} onPress={expandHalf} style={styles.expandButton}>
          <Text style={[styles.expandText, { color: theme.brand.ai }]}>Open</Text>
        </Pressable>
      </Pressable>

      <Modal animationType="fade" onRequestClose={collapse} transparent visible={state !== "closed"}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalRoot}>
          <Pressable accessibilityRole="button" onPress={collapse} style={styles.scrim} />
          <GlassSurface mode="full" style={[state === "half" ? styles.halfSheet : styles.composerSheet]}>
            <View style={styles.sheetHeader}>
              <View>
                <PrivacyBadge privacy="private" />
                <Text style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}>Health OS AI</Text>
              </View>
              <ActionButton label="Full chat" onPress={openFullChat} variant="secondary" />
            </View>

            <TextInput
              accessibilityLabel="AI message"
              multiline
              onChangeText={setDraft}
              placeholder="Ask, scan, search, or create..."
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              value={draft}
            />

            <View style={styles.commandRow}>
              {mockAICommands.map((command) => (
                <Pressable key={command.id} onPress={() => setDraft(command.prompt)} style={[styles.commandChip, { borderColor: theme.colors.border }]}>
                  <Text style={[styles.commandText, { color: theme.colors.textPrimary }]}>{command.label}</Text>
                </Pressable>
              ))}
            </View>

            {state === "half" ? (
              <View style={styles.reviewArea}>
                <HealthCard
                  privacy="private"
                  realm="ai"
                  title="AI prepared this"
                  description="Please review the person, date, visibility, and parent approval before saving. This is not saved or shared automatically."
                />
                <View style={styles.saveGrid}>
                  {mockAISaveActions.map((action) => (
                    <ActionButton key={action.id} label={action.label} onPress={() => router.push("/modals/privacy-review" as Href)} variant="secondary" />
                  ))}
                </View>
              </View>
            ) : (
              <ActionButton label="Review draft" onPress={expandHalf} />
            )}
          </GlassSurface>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  capsule: {
    alignItems: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    bottom: 104,
    flexDirection: "row",
    gap: spacing.sm,
    left: 22,
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    position: "absolute",
    right: 22,
  },
  capsuleText: {
    flex: 1,
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  commandChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  commandRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  commandText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    lineHeight: typography.caption.lineHeight,
  },
  composerSheet: {
    margin: spacing.lg,
  },
  expandButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  expandText: {
    fontSize: typography.label.fontSize,
    fontWeight: "800",
    lineHeight: typography.label.lineHeight,
  },
  halfSheet: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginTop: "auto",
    maxHeight: "72%",
  },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    minHeight: 92,
    padding: spacing.md,
    textAlignVertical: "top",
  },
  layer: {
    bottom: 0,
    left: 0,
    pointerEvents: "box-none",
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 90,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  reviewArea: {
    gap: spacing.md,
  },
  saveGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  scrim: {
    backgroundColor: "rgba(15,23,42,0.34)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  sheetTitle: {
    fontSize: typography.title3.fontSize,
    fontWeight: typography.title3.fontWeight,
    lineHeight: typography.title3.lineHeight,
    marginTop: spacing.sm,
  },
  spark: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: "900",
    lineHeight: typography.bodyStrong.lineHeight,
  },
});
