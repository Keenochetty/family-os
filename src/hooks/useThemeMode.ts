import { useAppTheme, type AppThemeMode } from "@/lib/theme";

export function useThemeMode(): { isDark: boolean; mode: AppThemeMode; setMode: (mode: AppThemeMode) => void } {
  const { isDark, mode, setMode } = useAppTheme();

  return { isDark, mode, setMode };
}
