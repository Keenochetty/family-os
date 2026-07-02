export const radius = {
  xs: 8,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 24,
  xxl: 28,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radius;
