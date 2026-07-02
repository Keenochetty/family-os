import { baseColors, brandColors, statusColors } from "./colors";

export type SemanticColorRole =
  | "background"
  | "surface"
  | "surfaceAlt"
  | "surfaceOverlay"
  | "scrim"
  | "textPrimary"
  | "textSecondary"
  | "textMuted"
  | "border"
  | "borderStrong"
  | "focus"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "ai"
  | "private"
  | "shared"
  | "caution"
  | "locked";

export type SemanticColors = Record<SemanticColorRole, string>;

export const lightSemanticColors: SemanticColors = {
  background: baseColors.backgroundLight,
  surface: baseColors.surfaceLight,
  surfaceAlt: baseColors.surfaceLightAlt,
  surfaceOverlay: "rgba(255,255,255,0.86)",
  scrim: "rgba(15,23,42,0.34)",
  textPrimary: baseColors.textPrimaryLight,
  textSecondary: baseColors.textSecondaryLight,
  textMuted: "#8E96A3",
  border: baseColors.borderLight,
  borderStrong: "rgba(0,0,0,0.16)",
  focus: brandColors.primary,
  success: brandColors.success,
  warning: brandColors.warning,
  danger: brandColors.danger,
  info: brandColors.info,
  ai: brandColors.ai,
  private: statusColors.private,
  shared: statusColors.shared,
  caution: statusColors.caution,
  locked: statusColors.locked,
};

export const darkSemanticColors: SemanticColors = {
  background: baseColors.backgroundDark,
  surface: baseColors.surfaceDark,
  surfaceAlt: baseColors.surfaceDarkAlt,
  surfaceOverlay: "rgba(17,23,34,0.86)",
  scrim: "rgba(2,6,23,0.58)",
  textPrimary: baseColors.textPrimaryDark,
  textSecondary: baseColors.textSecondaryDark,
  textMuted: "#7D8795",
  border: baseColors.borderDark,
  borderStrong: "rgba(255,255,255,0.18)",
  focus: brandColors.primarySoft,
  success: brandColors.success,
  warning: brandColors.warning,
  danger: brandColors.danger,
  info: brandColors.info,
  ai: brandColors.ai,
  private: statusColors.private,
  shared: brandColors.primarySoft,
  caution: statusColors.caution,
  locked: "#A8B0BD",
};
