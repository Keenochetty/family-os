import { brandColors, realmColors, statusColors } from "./colors";
import { lightSemanticColors, darkSemanticColors, type SemanticColors } from "./semantic";

export type HealthOSThemeMode = "light" | "dark";

export type HealthOSTheme = {
  mode: HealthOSThemeMode;
  colors: SemanticColors;
  brand: typeof brandColors;
  realms: typeof realmColors;
  status: typeof statusColors;
};

export const healthOSLightTheme: HealthOSTheme = {
  mode: "light",
  colors: lightSemanticColors,
  brand: brandColors,
  realms: realmColors,
  status: statusColors,
};

export const healthOSDarkTheme: HealthOSTheme = {
  mode: "dark",
  colors: darkSemanticColors,
  brand: brandColors,
  realms: realmColors,
  status: statusColors,
};

export function getHealthOSTheme(mode: HealthOSThemeMode): HealthOSTheme {
  return mode === "dark" ? healthOSDarkTheme : healthOSLightTheme;
}
