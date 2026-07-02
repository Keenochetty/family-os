import type { JSX, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { radius, shadows, spacing, typography, type PrivacyLabelKey, type RealmColorKey } from "@/theme";

import { PrivacyBadge } from "./PrivacyBadge";
import { RealmBadge } from "./RealmBadge";
import { useHealthOSTheme } from "./theme";

type HealthCardProps = {
  action?: ReactNode;
  children?: ReactNode;
  description?: string;
  onLongPress?: () => void;
  onPress?: () => void;
  privacy?: PrivacyLabelKey;
  realm?: RealmColorKey;
  style?: ViewStyle;
  title: string;
};

export function HealthCard({ action, children, description, onLongPress, onPress, privacy, realm, style, title }: HealthCardProps): JSX.Element {
  const theme = useHealthOSTheme();
  const Container = onPress || onLongPress ? Pressable : View;

  return (
    <Container
      accessibilityRole={onPress ? "button" : undefined}
      onLongPress={onLongPress}
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => [
        styles.card,
        shadows.soft,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <View style={styles.badges}>
            {realm ? <RealmBadge realm={realm} /> : null}
            {privacy ? <PrivacyBadge privacy={privacy} /> : null}
          </View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
          {description ? <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{description}</Text> : null}
        </View>
        {action}
      </View>
      {children ? <View style={styles.body}>{children}</View> : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  body: {
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  description: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    lineHeight: typography.caption.lineHeight,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
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
  titleBlock: {
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
  },
});
