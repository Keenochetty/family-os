export type HapticIntensity = "off" | "selection" | "light" | "medium" | "heavy" | "success" | "warning" | "error";

export const hapticIntents = {
  disabled: "off",
  select: "selection",
  open: "light",
  confirm: "success",
  warning: "warning",
  destructive: "error",
  dragStart: "light",
  dragEnd: "medium",
  importantTransition: "heavy",
} satisfies Record<string, HapticIntensity>;

export type HapticIntentKey = keyof typeof hapticIntents;
