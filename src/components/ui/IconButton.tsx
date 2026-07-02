import type { JSX, ReactNode } from "react";
import { Pressable, StyleSheet, type ViewStyle } from "react-native";

import { radius, spacing } from "@/theme";
import { useHaptics } from "@/hooks";

import { useHealthOSTheme } from "./theme";

type IconButtonProps = {
  accessibilityLabel: string;
  disabled?: boolean;
  icon: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

export function IconButton({ accessibilityLabel, disabled, icon, onPress, style }: IconButtonProps): JSX.Element {
  const theme = useHealthOSTheme();
  const haptics = useHaptics();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={async () => {
        await haptics.trigger(disabled ? "off" : "selection");
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border, opacity: disabled ? 0.48 : 1 },
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    padding: spacing.sm,
    width: 44,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.96 }],
  },
});
