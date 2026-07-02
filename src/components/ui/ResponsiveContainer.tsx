import type { JSX, ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { spacing } from "@/theme";
import { useResponsiveLayout } from "@/hooks";

type ResponsiveContainerProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function ResponsiveContainer({ children, style }: ResponsiveContainerProps): JSX.Element {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const maxWidth = isDesktop ? 1120 : isTablet ? 860 : undefined;

  return <View style={[styles.container, { maxWidth }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    gap: spacing.lg,
    width: "100%",
  },
});
