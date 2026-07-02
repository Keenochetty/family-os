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
  danger: string;
  dangerSoft: string;
};

export const fitnessPalette = {
  dark: {
    accent: "#E16C3D",
    accentBorder: "#70402D",
    accentSoft: "#2A1711",
    accentStrong: "#C9532D",
    background: "#080A0B",
    border: "#2D3237",
    info: "#9B8CCB",
    infoSoft: "#122131",
    nutrition: "#62B98D",
    nutritionSoft: "#13271E",
    danger: "#D85C55",
    dangerSoft: "#321716",
    recovery: "#239C91",
    recoverySoft: "#112521",
    success: "#42A879",
    successSoft: "#12251B",
    surface1: "#111315",
    surface2: "#171A1D",
    surface3: "#202428",
    text: "#F7F4EF",
    textMuted: "#AAA8A4",
    textSubtle: "#777A7D",
  },
  light: {
    accent: "#D96036",
    accentBorder: "#D6A08A",
    accentSoft: "#F8DDD0",
    accentStrong: "#BC4D29",
    background: "#F4EFE9",
    border: "#D9D1C8",
    info: "#6E60A2",
    infoSoft: "#E2ECF6",
    nutrition: "#3B9469",
    nutritionSoft: "#E0F1E8",
    danger: "#B64C47",
    dangerSoft: "#F6D8D4",
    recovery: "#168D84",
    recoverySoft: "#E1F1EE",
    success: "#31865F",
    successSoft: "#E3F2E8",
    surface1: "#FFFDF9",
    surface2: "#F6F1EB",
    surface3: "#EEE7DE",
    text: "#171719",
    textMuted: "#66615C",
    textSubtle: "#918A83",
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
