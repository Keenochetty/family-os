import type { AppTheme } from "@/lib/theme";

export type FitnessTheme = {
  background: string;
  surface1: string;
  surface2: string;
  surface3: string;
  border: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  accentBorder: string;
  success: string;
  successSoft: string;
  recovery: string;
  recoverySoft: string;
  info: string;
  infoSoft: string;
  nutrition: string;
  nutritionSoft: string;
};

export const fitnessPalette = {
  dark: {
    accent: "#D9825B",
    accentBorder: "#70402D",
    accentSoft: "#2B1A14",
    accentStrong: "#E38D63",
    background: "#080909",
    border: "#2C2F2F",
    info: "#6CA7D8",
    infoSoft: "#122131",
    nutrition: "#77C7A2",
    nutritionSoft: "#13271E",
    recovery: "#66BFB0",
    recoverySoft: "#112521",
    success: "#69B68A",
    successSoft: "#12251B",
    surface1: "#101212",
    surface2: "#171919",
    surface3: "#202222",
    text: "#F7F5F2",
    textMuted: "#A5A6A6",
    textSubtle: "#707474",
  },
  light: {
    accent: "#B86545",
    accentBorder: "#D6A08A",
    accentSoft: "#F5DDD2",
    accentStrong: "#A95638",
    background: "#F6F4F1",
    border: "#DAD6D0",
    info: "#477FAF",
    infoSoft: "#E2ECF6",
    nutrition: "#3D956C",
    nutritionSoft: "#E0F1E8",
    recovery: "#388F82",
    recoverySoft: "#E1F1EE",
    success: "#3C8C61",
    successSoft: "#E3F2E8",
    surface1: "#FFFFFF",
    surface2: "#F0EEEA",
    surface3: "#E9E5DF",
    text: "#171817",
    textMuted: "#626663",
    textSubtle: "#8B8E8C",
  },
} as const satisfies Record<"dark" | "light", FitnessTheme>;

export const fitnessSpacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
} as const;

export const fitnessRadius = {
  lg: 20,
  md: 16,
  pill: 999,
  sm: 12,
  xl: 24,
} as const;

export function getFitnessTheme(isDark: boolean, appTheme: AppTheme): FitnessTheme {
  const realm = isDark ? fitnessPalette.dark : fitnessPalette.light;

  return {
    ...realm,
    background: appTheme.background,
  };
}
