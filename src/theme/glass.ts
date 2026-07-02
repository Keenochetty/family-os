import { Platform, type ViewStyle } from "react-native";

export type GlassMode = "full" | "reduced" | "off";

export type GlassSurfaceOptions = {
  mode: GlassMode;
  isDark?: boolean;
  platform?: typeof Platform.OS;
};

export type GlassSurfaceToken = {
  blurIntensity: number;
  fallbackStyle: ViewStyle;
  surfaceStyle: ViewStyle;
};

export function glassSurface({ mode, isDark = false }: GlassSurfaceOptions): ViewStyle {
  return glassSurfaceToken({ mode, isDark }).surfaceStyle;
}

export function glassSurfaceToken({ mode, isDark = false, platform = Platform.OS }: GlassSurfaceOptions): GlassSurfaceToken {
  if (mode === "off") {
    const solidStyle: ViewStyle = {
      backgroundColor: isDark ? "#151821" : "#FFFFFF",
      borderColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(17,24,39,0.08)",
      borderWidth: 1,
      elevation: 0,
    };

    return { blurIntensity: 0, fallbackStyle: solidStyle, surfaceStyle: solidStyle };
  }

  if (mode === "reduced") {
    const reducedStyle: ViewStyle = {
      backgroundColor: isDark ? "rgba(21,24,33,0.92)" : "rgba(255,255,255,0.92)",
      borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
      borderWidth: 1,
      elevation: platform === "android" ? 6 : 0,
    };

    return { blurIntensity: 24, fallbackStyle: reducedStyle, surfaceStyle: reducedStyle };
  }

  const fullStyle: ViewStyle = {
    backgroundColor: isDark ? "rgba(21,24,33,0.72)" : "rgba(255,255,255,0.72)",
    borderColor: isDark ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.84)",
    borderWidth: 1,
    elevation: platform === "android" ? 8 : 0,
  };

  return { blurIntensity: 48, fallbackStyle: fullStyle, surfaceStyle: fullStyle };
}
