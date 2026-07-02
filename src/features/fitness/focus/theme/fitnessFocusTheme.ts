import type { AppTheme } from "@/lib/theme";

export type FitnessFocusTheme = {
  achievement: string;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  danger: string;
  line: string;
  page: string;
  rest: string;
  ringTrack: string;
  success: string;
  surface1: string;
  surface2: string;
  surface3: string;
  text: string;
  textMuted: string;
  warning: string;
};

export const fitnessFocusTheme = {
  dark: {
    achievement: "#E0A94B",
    accent: "#E16C3D",
    accentSoft: "#2A1711",
    accentStrong: "#C9532D",
    danger: "#D85C55",
    line: "#2D3237",
    page: "#080A0B",
    rest: "#239C91",
    ringTrack: "#3A3430",
    success: "#42A879",
    surface1: "#111315",
    surface2: "#171A1D",
    surface3: "#202428",
    text: "#F7F4EF",
    textMuted: "#AAA8A4",
    warning: "#D78A35",
  },
  light: {
    achievement: "#AE761B",
    accent: "#D96036",
    accentSoft: "#F8DDD0",
    accentStrong: "#BC4D29",
    danger: "#B64C47",
    line: "#D9D1C8",
    page: "#F4EFE9",
    rest: "#168D84",
    ringTrack: "#E1D8CF",
    success: "#31865F",
    surface1: "#FFFDF9",
    surface2: "#F6F1EB",
    surface3: "#EEE7DE",
    text: "#171719",
    textMuted: "#66615C",
    warning: "#A9671D",
  },
} as const satisfies Record<"dark" | "light", FitnessFocusTheme>;

export const fitnessFocusSpacing = {
  lg: 16,
  md: 12,
  sm: 8,
  xl: 20,
  xs: 4,
  xxl: 24,
} as const;

export const fitnessFocusRadius = {
  lg: 16,
  md: 14,
  pill: 999,
  sheet: 30,
  sm: 12,
  xl: 20,
} as const;

export const fitnessFocusMotion = {
  completion: 420,
  mode: 260,
  quick: 140,
  sheet: 300,
} as const;

export function getFitnessFocusTheme(isDark: boolean, appTheme: AppTheme): FitnessFocusTheme {
  const realm = isDark ? fitnessFocusTheme.dark : fitnessFocusTheme.light;

  return {
    ...realm,
    page: realm.page || appTheme.background,
  };
}
