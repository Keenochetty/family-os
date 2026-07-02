import type { JSX, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { radius, spacing, typography } from "@/theme";
import { useHaptics } from "@/hooks";

import { useHealthOSTheme } from "./theme";

type ActionButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ActionButtonProps = {
  accessibilityLabel?: string;
  disabled?: boolean;
  icon?: ReactNode;
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: ActionButtonVariant;
};

export function ActionButton({ accessibilityLabel, disabled, icon, label, onPress, style, variant = "primary" }: ActionButtonProps): JSX.Element {
  const theme = useHealthOSTheme();
  const haptics = useHaptics();

  const backgroundColor =
    variant === "primary" ? theme.brand.primary : variant === "danger" ? theme.colors.danger : variant === "secondary" ? theme.colors.surfaceAlt : "transparent";
  const borderColor = variant === "ghost" ? theme.colors.border : backgroundColor;
  const color = variant === "primary" || variant === "danger" ? "#FFFFFF" : theme.colors.textPrimary;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={async () => {
        await haptics.trigger(disabled ? "off" : "selection");
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, borderColor, opacity: disabled ? 0.48 : 1 },
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text numberOfLines={1} style={[styles.label, { color }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: spacing.lg,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
