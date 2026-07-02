import { getHealthOSTheme, type HealthOSTheme } from "@/theme";
import { useAppTheme } from "@/lib/theme";

export function useHealthOSTheme(): HealthOSTheme {
  const { isDark } = useAppTheme();

  return getHealthOSTheme(isDark ? "dark" : "light");
}
