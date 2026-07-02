import type { JSX, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { radius, shadows, spacing, typography } from "@/theme";

import { useHealthOSTheme } from "./theme";

export type ContextAction = {
  destructive?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  label: string;
  onPress: () => void;
};

type ContextActionMenuProps = {
  actions: ContextAction[];
  title?: string;
};

export function ContextActionMenu({ actions, title }: ContextActionMenuProps): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <View style={[styles.menu, shadows.raised, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {title ? <Text style={[styles.title, { color: theme.colors.textSecondary }]}>{title}</Text> : null}
      {actions.map((action) => (
        <Pressable
          accessibilityRole="menuitem"
          accessibilityState={{ disabled: action.disabled }}
          disabled={action.disabled}
          key={action.id}
          onPress={action.onPress}
          style={({ pressed }) => [styles.action, pressed && !action.disabled && styles.pressed, action.disabled && styles.disabled]}
        >
          {action.icon}
          <Text style={[styles.actionLabel, { color: action.destructive ? theme.colors.danger : theme.colors.textPrimary }]}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    borderRadius: radius.md,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  actionLabel: {
    flex: 1,
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    lineHeight: typography.body.lineHeight,
  },
  disabled: {
    opacity: 0.42,
  },
  menu: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.sm,
  },
  pressed: {
    opacity: 0.72,
  },
  title: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    lineHeight: typography.label.lineHeight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
