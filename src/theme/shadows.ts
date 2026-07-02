import type { ViewStyle } from "react-native";

export const shadows = {
  none: {
    elevation: 0,
    shadowOpacity: 0,
  },
  soft: {
    elevation: 4,
    shadowColor: "rgba(20,24,28,0.20)",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  raised: {
    elevation: 8,
    shadowColor: "rgba(20,24,28,0.24)",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 18,
  },
  overlay: {
    elevation: 16,
    shadowColor: "rgba(0,0,0,0.32)",
    shadowOffset: { height: 12, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 28,
  },
} satisfies Record<string, ViewStyle>;

export type ShadowToken = keyof typeof shadows;
