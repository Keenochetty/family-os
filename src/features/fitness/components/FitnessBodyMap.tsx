import type { JSX } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { G, Path } from "react-native-svg";

import { BODY_MAP_PATHS, type BodyMapKey } from "@/features/fitness/muscle-map/bodyMapPaths";
import type { BodyMapSide, BodyMapVariant, MuscleHeatValue } from "@/features/fitness/types/fitness";

type FitnessBodyMapProps = {
  accent: string;
  borderColor: string;
  isDark: boolean;
  muscleHeat: MuscleHeatValue[];
  side: BodyMapSide;
  style?: StyleProp<ViewStyle>;
  variant?: BodyMapVariant;
};

const heatColors = {
  dark: ["#242829", "#4A342A", "#70402D", "#D9825B", "#E38D63"],
  light: ["#E6E1DA", "#F5DDD2", "#D6A08A", "#B86545", "#A95638"],
} as const;

export function FitnessBodyMap({ accent, borderColor, isDark, muscleHeat, side, style, variant = "male" }: FitnessBodyMapProps): JSX.Element {
  const key: BodyMapKey = `${variant}${side === "front" ? "Front" : "Back"}` as BodyMapKey;
  const pathSet = BODY_MAP_PATHS[key];
  const heat = new Map(muscleHeat.map((item) => [item.muscleId, item]));
  const palette = isDark ? heatColors.dark : heatColors.light;
  const baseFill = isDark ? "#222627" : "#E9E5DF";
  const cosmeticFill = isDark ? "#303334" : "#D8D4CE";
  const stroke = isDark ? "rgba(255,255,255,0.12)" : "rgba(23,24,23,0.12)";

  return (
    <View pointerEvents="none" style={[styles.shell, { borderColor }, style]}>
      <Svg
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`${pathSet.viewBox.x} ${pathSet.viewBox.y} ${pathSet.viewBox.width} ${pathSet.viewBox.height}`}
        width="100%"
      >
        <G>
          {pathSet.parts.map((part) => {
            const load = heat.get(part.slug)?.load ?? 0;
            const isCosmetic = part.slug === "hair" || part.slug === "head" || part.slug === "hands" || part.slug === "feet";
            const fill = load > 0 ? palette[load] : isCosmetic ? cosmeticFill : baseFill;
            const opacity = load > 0 ? 1 : isCosmetic ? 0.62 : 0.82;
            const paths = [...part.common, ...part.left, ...part.right];

            return paths.map((d, index) => (
              <Path
                d={d}
                fill={fill}
                key={`${part.slug}-${index}`}
                opacity={opacity}
                stroke={load >= 3 ? accent : stroke}
                strokeLinejoin="round"
                strokeWidth={load >= 3 ? 1.8 : 1}
              />
            ));
          })}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    aspectRatio: 0.58,
    borderRadius: 18,
    borderWidth: 1,
    maxHeight: 230,
    minHeight: 176,
    overflow: "hidden",
    width: "48%",
  },
});
