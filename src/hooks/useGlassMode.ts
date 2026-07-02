import { useCallback, useState } from "react";

import type { GlassMode } from "@/theme";

export function useGlassMode(initialMode: GlassMode = "reduced"): {
  glassMode: GlassMode;
  setGlassMode: (mode: GlassMode) => void;
  glassEnabled: boolean;
} {
  const [glassMode, setGlassModeState] = useState<GlassMode>(initialMode);

  const setGlassMode = useCallback((mode: GlassMode) => {
    setGlassModeState(mode);
  }, []);

  return {
    glassEnabled: glassMode !== "off",
    glassMode,
    setGlassMode,
  };
}
