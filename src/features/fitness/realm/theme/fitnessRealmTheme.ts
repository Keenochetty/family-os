import type { AppTheme } from "@/lib/theme";

export type FitnessRealmTheme = {
  achievement: string;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  danger: string;
  line: string;
  nutrition: string;
  page: string;
  rest: string;
  ringTrack: string;
  sleep: string;
  success: string;
  surface1: string;
  surface2: string;
  surface3: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  warning: string;
};

export const fitnessRealmTheme = {
  dark: {
    achievement: "#E0A94B",
    accent: "#E16C3D",
    accentSoft: "#2A1711",
    accentStrong: "#C9532D",
    danger: "#D85C55",
    line: "#2D3237",
    nutrition: "#62B98D",
    page: "#080A0B",
    rest: "#239C91",
    ringTrack: "#373A3D",
    sleep: "#9B8CCB",
    success: "#42A879",
    surface1: "#111315",
    surface2: "#171A1D",
    surface3: "#202428",
    text: "#F7F4EF",
    textMuted: "#AAA8A4",
    textSubtle: "#777A7D",
    warning: "#D78A35",
  },
  light: {
    achievement: "#AE761B",
    accent: "#D96036",
    accentSoft: "#F8DDD0",
    accentStrong: "#BC4D29",
    danger: "#B64C47",
    line: "#D9D1C8",
    nutrition: "#3B9469",
    page: "#F4EFE9",
    rest: "#168D84",
    ringTrack: "#DED6CE",
    sleep: "#6E60A2",
    success: "#31865F",
    surface1: "#FFFDF9",
    surface2: "#F6F1EB",
    surface3: "#EEE7DE",
    text: "#171719",
    textMuted: "#66615C",
    textSubtle: "#918A83",
    warning: "#A9671D",
  },
} as const satisfies Record<"dark" | "light", FitnessRealmTheme>;

export const fitnessRealmSpacing = {
  lg: 16,
  md: 12,
  sm: 8,
  xl: 20,
  xs: 4,
  xxl: 24,
  xxxl: 32,
  xxs: 2,
} as const;

export const fitnessRealmRadius = {
  hero: 24,
  lg: 16,
  md: 14,
  pill: 999,
  sheet: 30,
  sm: 12,
  xl: 20,
} as const;

export type FitnessRealmThemeMode = keyof typeof fitnessRealmTheme;

export function getFitnessRealmTheme(isDark: boolean, appTheme?: AppTheme): FitnessRealmTheme {
  const realm = isDark ? fitnessRealmTheme.dark : fitnessRealmTheme.light;

  return {
    ...realm,
    page: appTheme?.background ?? realm.page,
  };
}
