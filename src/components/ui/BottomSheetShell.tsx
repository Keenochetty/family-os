import type { JSX, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { radius, shadows, spacing, typography } from "@/theme";

import { useHealthOSTheme } from "./theme";

type BottomSheetShellProps = {
  children: ReactNode;
  footer?: ReactNode;
  title?: string;
};

export function BottomSheetShell({ children, footer, title }: BottomSheetShellProps): JSX.Element {
  const theme = useHealthOSTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.sheet, shadows.overlay, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, paddingBottom: insets.bottom + spacing.lg }]}>
      <View style={[styles.handle, { backgroundColor: theme.colors.borderStrong }]} />
      {title ? <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text> : null}
      <View style={styles.content}>{children}</View>
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  handle: {
    alignSelf: "center",
    borderRadius: radius.pill,
    height: 4,
    width: 44,
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.title3.fontSize,
    fontWeight: typography.title3.fontWeight,
    lineHeight: typography.title3.lineHeight,
  },
});
