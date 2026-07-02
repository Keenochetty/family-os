export const breakpoints = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

export type BreakpointKey = keyof typeof breakpoints;

export type ResponsiveLayout = "phone" | "tablet" | "desktop";

export function getResponsiveLayout(width: number): ResponsiveLayout {
  if (width >= breakpoints.desktop) {
    return "desktop";
  }

  if (width >= breakpoints.tablet) {
    return "tablet";
  }

  return "phone";
}
