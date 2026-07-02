import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { ActionButton, ContextActionMenu, HealthCard, PrivacyBadge, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import { notificationCategories, notifications, suggestions, type NotificationCategory, type SuggestionItem } from "./notificationsData";

function SuggestionCard({ item, onMenu }: { item: SuggestionItem; onMenu: (item: SuggestionItem) => void }): JSX.Element {
  const router = useRouter();

  return (
    <HealthCard
      action={<ActionButton label={item.actionLabel} onPress={() => router.push(item.route as Href)} variant="secondary" />}
      description={item.description}
      onLongPress={() => onMenu(item)}
      privacy={item.privacy}
      realm={item.realm}
      title={item.title}
    >
      <Text style={styles.reasonLabel}>Why this?</Text>
      <Text style={styles.reasonText}>{item.reason}</Text>
    </HealthCard>
  );
}

export function NotificationsScreen(): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | "All">("All");
  const [selectedSuggestion, setSelectedSuggestion] = useState<SuggestionItem | null>(null);
  const router = useRouter();
  const theme = useHealthOSTheme();
  const visibleNotifications = selectedCategory === "All" ? notifications : notifications.filter((item) => item.category === selectedCategory);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <PrivacyBadge privacy="private" />
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Notifications</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Private updates and light suggestions. No nagging, no shame, and every suggestion explains why it appears.</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.categoryRail}>
          {(["All", ...notificationCategories] as const).map((category) => {
            const active = selectedCategory === category;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[styles.categoryChip, { backgroundColor: active ? `${theme.brand.primary}18` : theme.colors.surface, borderColor: active ? theme.brand.primary : theme.colors.border }]}
              >
                <Text style={[styles.categoryText, { color: active ? theme.brand.primary : theme.colors.textPrimary }]}>{category}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <SectionHeader title="Notification center" subtitle="Sensitive previews hide private details." />
      {visibleNotifications.map((item) => (
        <HealthCard
          action={<RealmBadge realm={item.urgent ? "emergency" : item.realm} label={item.timeLabel} />}
          description={item.description}
          key={item.id}
          privacy={item.privacy}
          realm={item.realm}
          title={item.title}
        />
      ))}

      <SectionHeader title="Light suggestions" subtitle="Use, defer, hide, or ask why." />
      {suggestions.map((item) => (
        <SuggestionCard item={item} key={item.id} onMenu={setSelectedSuggestion} />
      ))}

      <ActionButton label="Notification settings" onPress={() => router.push("/profile/settings/notifications" as Href)} variant="secondary" />

      <Modal animationType="fade" onRequestClose={() => setSelectedSuggestion(null)} transparent visible={Boolean(selectedSuggestion)}>
        <View style={styles.modalRoot}>
          <Pressable accessibilityRole="button" onPress={() => setSelectedSuggestion(null)} style={[styles.scrim, { backgroundColor: theme.colors.scrim }]} />
          <View style={[styles.menuDock, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <ContextActionMenu
              title={selectedSuggestion?.title}
              actions={[
                { id: "do-it", label: "Do it", onPress: () => selectedSuggestion && router.push(selectedSuggestion.route as Href) },
                { id: "later", label: "Remind me later", onPress: () => setSelectedSuggestion(null) },
                { id: "not-useful", label: "Not useful", onPress: () => setSelectedSuggestion(null) },
                { id: "hide-type", label: "Hide this type", onPress: () => setSelectedSuggestion(null) },
                { id: "why", label: "Why this?", onPress: () => setSelectedSuggestion(null) },
              ]}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoryChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoryRail: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  categoryText: {
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
  reasonLabel: {
    fontSize: typography.tinyLabel.fontSize,
    fontWeight: "800",
    lineHeight: typography.tinyLabel.lineHeight,
    textTransform: "uppercase",
  },
  reasonText: {
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
