import type { JSX } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ActionButton, AppScreen, HealthCard, PrivacyBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import { mockAIChats, mockAICommands, mockAISaveActions } from "./aiData";

export function AIChatScreen(): JSX.Element {
  const theme = useHealthOSTheme();
  const activeChat = mockAIChats[0];

  return (
    <AppScreen>
      <View style={styles.header}>
        <PrivacyBadge privacy="private" />
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Health OS AI</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Private assistant for search, scans, records, plans, and reviewable actions.</Text>
      </View>

      <SectionHeader title="Chat history" subtitle="Private by default. Sharing is explicit and reviewable." />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.historyRow}>
          {mockAIChats.map((chat) => (
            <HealthCard key={chat.id} privacy="private" realm="ai" title={chat.title} description={chat.category.replace("_", " ")} />
          ))}
        </View>
      </ScrollView>

      <SectionHeader title={activeChat.title} subtitle="Mock conversation" />
      <View style={styles.messages}>
        {activeChat.messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.message,
              {
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                backgroundColor: message.role === "user" ? theme.brand.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.messageText, { color: message.role === "user" ? "#FFFFFF" : theme.colors.textPrimary }]}>{message.content}</Text>
          </View>
        ))}
      </View>

      <HealthCard privacy="private" realm="ai" title="AI prepared this. Please review before saving." description="Sensitive AI actions never save, share, change medication, or create child/caregiver sharing automatically.">
        <View style={styles.saveGrid}>
          {mockAISaveActions.map((action) => (
            <ActionButton key={action.id} label={action.label} variant="secondary" />
          ))}
        </View>
      </HealthCard>

      <SectionHeader title="Commands" subtitle="Shortcuts create reviewable drafts." />
      <View style={styles.commandRow}>
        {mockAICommands.map((command) => (
          <Pressable key={command.id} style={[styles.commandChip, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.commandText, { color: theme.colors.textPrimary }]}>{command.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.composer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <TextInput
          accessibilityLabel="AI message composer"
          placeholder="Message Health OS AI..."
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.composerInput, { color: theme.colors.textPrimary }]}
        />
        <ActionButton label="Attach" variant="secondary" />
        <ActionButton label="Voice" variant="secondary" />
        <ActionButton label="Send" />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
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
  composer: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  composerInput: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    minHeight: 52,
  },
  header: {
    gap: spacing.md,
  },
  historyRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingRight: spacing.page,
  },
  message: {
    borderRadius: radius.lg,
    borderWidth: 1,
    maxWidth: "86%",
    padding: spacing.md,
  },
  messages: {
    gap: spacing.md,
  },
  messageText: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  saveGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
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
