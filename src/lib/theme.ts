import { createContext, createElement, useContext, useMemo, useState, type PropsWithChildren, type ReactElement } from "react";
import { useColorScheme, type ViewStyle } from "react-native";

export type AppTheme = {
  background: string;
  backgroundDeep: string;
  calendar: CalendarTheme;
  nav: NavTheme;
  surface: string;
  surfaceRaised: string;
  surfaceRecessed: string;
  surfacePressed: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderSoft: string;
  borderHighlight: string;
  shadowSoft: string;
  shadowDeep: string;
  iconPrimary: string;
  iconSecondary: string;
};

export type CalendarTheme = {
  background: string;
  backgroundDeep: string;
  calendarSurface: string;
  calendarInnerShadow: string;
  calendarBottomHighlight: string;
  calendarBorder: string;
  controlSurface: string;
  controlBorder: string;
  controlHighlight: string;
  iconPrimary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  outOfMonthText: string;
  selectedDaySurface: string;
  selectedDayText: string;
  selectedDayShadow: string;
  todayRing: string;
  selectedDayPanel: string;
  selectedDayPanelBorder: string;
  selectedDayAccent: string;
  eventCard: string;
  eventCardBorder: string;
  eventCardHighlight: string;
  eventCardShadow: string;
  privacyChip: string;
  privacyChipBorder: string;
  privacyText: string;
  faint: string;
  muted: string;
  panel: string;
  selected: string;
  selectedText: string;
  text: string;
};

export type NavTheme = {
  activeIcon: string;
  activeNavSurface: string;
  inactiveIcon: string;
  navHighlight: string;
  navOuterTray: string;
  navSurface: string;
};

export const lightTheme: AppTheme = {
  background: "#F2F3F0",
  backgroundDeep: "#E8EAE6",
  borderHighlight: "rgba(255, 255, 255, 0.92)",
  borderSoft: "rgba(20, 24, 28, 0.08)",
  calendar: {
    background: "#F1F2EF",
    backgroundDeep: "#E7E9E5",
    calendarBorder: "rgba(20,24,28,0.06)",
    calendarBottomHighlight: "rgba(255,255,255,0.80)",
    calendarInnerShadow: "rgba(20,24,28,0.09)",
    calendarSurface: "#F8F9F6",
    controlBorder: "rgba(20,24,28,0.08)",
    controlHighlight: "rgba(255,255,255,0.95)",
    controlSurface: "#FFFFFF",
    eventCard: "#FAFBF8",
    eventCardBorder: "rgba(20,24,28,0.07)",
    eventCardHighlight: "rgba(255,255,255,0.95)",
    eventCardShadow: "rgba(20,24,28,0.10)",
    faint: "rgba(20,24,28,0.07)",
    iconPrimary: "#17191C",
    muted: "#656A70",
    outOfMonthText: "#B0B4B7",
    panel: "#FFFFFF",
    privacyChip: "#EFF1ED",
    privacyChipBorder: "rgba(20,24,28,0.07)",
    privacyText: "#60656B",
    selected: "#16181B",
    selectedDayAccent: "#38B8ED",
    selectedDayPanel: "#FFFFFF",
    selectedDayPanelBorder: "rgba(20,24,28,0.07)",
    selectedDayShadow: "rgba(20,24,28,0.16)",
    selectedDaySurface: "#E2E5E0",
    selectedDayText: "#111315",
    selectedText: "#111315",
    text: "#111315",
    textMuted: "#92979C",
    textPrimary: "#111315",
    textSecondary: "#656A70",
    todayRing: "#45BFF2",
  },
  iconPrimary: "#17191C",
  iconSecondary: "#747A80",
  nav: {
    activeIcon: "#FFFFFF",
    activeNavSurface: "#17191C",
    inactiveIcon: "#72787E",
    navHighlight: "rgba(255,255,255,0.95)",
    navOuterTray: "#E3E5E1",
    navSurface: "#FAFBF8",
  },
  shadowDeep: "rgba(20, 24, 28, 0.20)",
  shadowSoft: "rgba(20, 24, 28, 0.12)",
  surface: "#FAFBF8",
  surfacePressed: "#DDE0DB",
  surfaceRaised: "#FFFFFF",
  surfaceRecessed: "#E7E9E5",
  textMuted: "#92979C",
  textPrimary: "#111315",
  textSecondary: "#656A70",
};

export const darkTheme: AppTheme = {
  background: "#070809",
  backgroundDeep: "#030405",
  borderHighlight: "rgba(255, 255, 255, 0.16)",
  borderSoft: "rgba(255, 255, 255, 0.08)",
  calendar: {
    background: "#070809",
    backgroundDeep: "#030405",
    calendarBorder: "rgba(255,255,255,0.055)",
    calendarBottomHighlight: "rgba(255,255,255,0.035)",
    calendarInnerShadow: "rgba(0,0,0,0.55)",
    calendarSurface: "#0A0C0F",
    controlBorder: "rgba(255,255,255,0.09)",
    controlHighlight: "rgba(255,255,255,0.12)",
    controlSurface: "#15181D",
    eventCard: "#14171C",
    eventCardBorder: "rgba(255,255,255,0.075)",
    eventCardHighlight: "rgba(255,255,255,0.035)",
    eventCardShadow: "rgba(0,0,0,0.40)",
    faint: "rgba(255,255,255,0.08)",
    iconPrimary: "#F5F6F7",
    muted: "#A7ACB4",
    outOfMonthText: "#555B64",
    panel: "#15191F",
    privacyChip: "#0C0E11",
    privacyChipBorder: "rgba(255,255,255,0.10)",
    privacyText: "#B8BDC4",
    selected: "#F5F6F7",
    selectedDayAccent: "#45BFF2",
    selectedDayPanel: "#15191F",
    selectedDayPanelBorder: "rgba(255,255,255,0.08)",
    selectedDayShadow: "rgba(0,0,0,0.70)",
    selectedDaySurface: "#020304",
    selectedDayText: "#F5F6F7",
    selectedText: "#F5F6F7",
    text: "#F5F6F7",
    textMuted: "#6F757E",
    textPrimary: "#F5F6F7",
    textSecondary: "#A7ACB4",
    todayRing: "#45BFF2",
  },
  iconPrimary: "#F7F8F9",
  iconSecondary: "#8C929A",
  nav: {
    activeIcon: "#F5F6F7",
    activeNavSurface: "#050607",
    inactiveIcon: "#8C929A",
    navHighlight: "rgba(255,255,255,0.10)",
    navOuterTray: "#111419",
    navSurface: "#1A1D22",
  },
  shadowDeep: "rgba(0, 0, 0, 0.68)",
  shadowSoft: "rgba(0, 0, 0, 0.38)",
  surface: "#111317",
  surfacePressed: "#050607",
  surfaceRaised: "#191C21",
  surfaceRecessed: "#090B0E",
  textMuted: "#70767E",
  textPrimary: "#F5F6F7",
  textSecondary: "#A6ABB2",
};

export type AppThemeMode = "system" | "light" | "dark";

type AppThemeContextValue = {
  mode: AppThemeMode;
  setMode: (mode: AppThemeMode) => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren): ReactElement {
  const [mode, setMode] = useState<AppThemeMode>("system");
  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return createElement(AppThemeContext.Provider, { value }, children);
}

export function useAppTheme(): { isDark: boolean; mode: AppThemeMode; setMode: (mode: AppThemeMode) => void; theme: AppTheme } {
  const systemIsDark = useColorScheme() === "dark";
  const context = useContext(AppThemeContext);
  const mode = context?.mode ?? "system";
  const setMode = context?.setMode ?? (() => undefined);
  const isDark = mode === "system" ? systemIsDark : mode === "dark";

  return { isDark, mode, setMode, theme: isDark ? darkTheme : lightTheme };
}

export function normalSurface(theme: AppTheme): ViewStyle {
  return {
    backgroundColor: theme.surface,
    borderColor: theme.borderSoft,
    borderWidth: 1,
  };
}

export function raisedSurface(theme: AppTheme): ViewStyle {
  return {
    backgroundColor: theme.surfaceRaised,
    borderColor: theme.borderSoft,
    borderWidth: 1,
    elevation: 8,
    shadowColor: theme.shadowDeep,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 14,
  };
}

export function recessedSurface(theme: AppTheme): ViewStyle {
  return {
    backgroundColor: theme.surfaceRecessed,
    borderColor: theme.borderSoft,
    borderWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  };
}

export function selectedSurface(theme: AppTheme): ViewStyle {
  return {
    backgroundColor: theme.surfacePressed,
    borderColor: theme.borderHighlight,
    borderWidth: 1,
    elevation: 4,
    shadowColor: theme.shadowSoft,
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  };
}
