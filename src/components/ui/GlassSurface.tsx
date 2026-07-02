import type { JSX, ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { glassSurfaceToken, radius, shadows, spacing, type GlassMode } from "@/theme";
import { useThemeMode } from "@/hooks";

type GlassSurfaceProps = {
  children: ReactNode;
  mode?: GlassMode;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function GlassSurface({ children, mode = "reduced", padded = true, style }: GlassSurfaceProps): JSX.Element {
  const { isDark } = useThemeMode();
  const token = glassSurfaceToken({ isDark, mode });

  return <View style={[styles.surface, shadows.soft, token.fallbackStyle, padded && styles.padded, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  padded: {
    padding: spacing.lg,
  },
  surface: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
});
