import type { JSX } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrivacyBadge, RealmBadge } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import type { Moment } from "./momentsData";

type MomentCardProps = {
  compact?: boolean;
  moment: Moment;
  onLongPress?: (moment: Moment) => void;
  onPress?: (moment: Moment) => void;
};

export function MomentCard({ compact = false, moment, onLongPress, onPress }: MomentCardProps): JSX.Element {
  const theme = useHealthOSTheme();
  const accent = theme.realms[moment.tone];

  return (
    <Pressable
      accessibilityRole="button"
      onLongPress={() => onLongPress?.(moment)}
      onPress={() => onPress?.(moment)}
      style={({ pressed }) => [
        styles.card,
        compact ? styles.compact : styles.full,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.photo, { backgroundColor: `${accent}1F` }]}>
        <View style={[styles.photoMain, { backgroundColor: `${accent}33`, borderColor: `${accent}66` }]} />
        <View style={[styles.photoSmall, styles.photoSmallA, { backgroundColor: theme.colors.surface, borderColor: `${accent}66` }]} />
        <View style={[styles.photoSmall, styles.photoSmallB, { backgroundColor: `${accent}4D`, borderColor: `${accent}66` }]} />
      </View>
      <View style={styles.copy}>
        <View style={styles.badges}>
          <RealmBadge realm={moment.tone} />
          <PrivacyBadge privacy={moment.privacy} />
          <Text style={[styles.date, { color: theme.colors.textSecondary }]}>{moment.dateLabel}</Text>
        </View>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{moment.title}</Text>
        <Text numberOfLines={compact ? 2 : 3} style={[styles.description, { color: theme.colors.textSecondary }]}>
          {moment.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badges: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    overflow: "hidden",
    padding: spacing.md,
  },
  compact: {
    flexDirection: "row",
  },
  copy: {
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
  },
  date: {
    fontSize: typography.tinyLabel.fontSize,
    fontWeight: typography.tinyLabel.fontWeight,
    lineHeight: typography.tinyLabel.lineHeight,
  },
  description: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  full: {
    minHeight: 300,
  },
  photo: {
    aspectRatio: 1.55,
    borderRadius: radius.md,
    minHeight: 122,
    overflow: "hidden",
    position: "relative",
  },
  photoMain: {
    borderRadius: radius.md,
    borderWidth: 1,
    bottom: spacing.md,
    left: spacing.md,
    position: "absolute",
    right: spacing.xl,
    top: spacing.md,
  },
  photoSmall: {
    borderRadius: radius.sm,
    borderWidth: 1,
    position: "absolute",
  },
  photoSmallA: {
    height: 54,
    right: spacing.lg,
    top: spacing.lg,
    width: 64,
  },
  photoSmallB: {
    bottom: spacing.lg,
    height: 44,
    right: spacing.md,
    width: 84,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  title: {
    fontSize: typography.title3.fontSize,
    fontWeight: typography.title3.fontWeight,
    lineHeight: typography.title3.lineHeight,
  },
});
