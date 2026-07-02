import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { getResponsiveLayout, type ResponsiveLayout } from "@/theme";

export function useResponsiveLayout(): {
  height: number;
  layoutClass: ResponsiveLayout;
  isDesktop: boolean;
  isPhone: boolean;
  isTablet: boolean;
  width: number;
} {
  const { height, width } = useWindowDimensions();

  return useMemo(() => {
    const layoutClass = getResponsiveLayout(width);

    return {
      height,
      isDesktop: layoutClass === "desktop",
      isPhone: layoutClass === "phone",
      isTablet: layoutClass === "tablet",
      layoutClass,
      width,
    };
  }, [height, width]);
}
