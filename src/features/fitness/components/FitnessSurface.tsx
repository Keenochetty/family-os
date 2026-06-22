import type { PropsWithChildren, JSX } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { fitnessRadius, fitnessSpacing, type FitnessTheme } from "@/features/fitness/theme/fitnessTheme";

type FitnessSurfaceProps = PropsWithChildren<{
  elevated?: boolean;
  style?: ViewStyle;
  theme: FitnessTheme;
}>;

export function FitnessSurface({ children, elevated = false, style, theme }: FitnessSurfaceProps): JSX.Element {
  return (
    <View
      style={[
        styles.surface,
        {
          backgroundColor: elevated ? theme.surface2 : theme.surface1,
          borderColor: theme.border,
          shadowColor: elevated ? "#000000" : "transparent",
        },
        elevated && styles.elevated,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  elevated: {
    elevation: 5,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
  },
  surface: {
    borderRadius: fitnessRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: fitnessSpacing[4],
  },
});
