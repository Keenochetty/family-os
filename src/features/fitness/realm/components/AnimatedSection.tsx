import type { JSX, PropsWithChildren } from "react";
import Animated, { FadeIn, LinearTransition, ReduceMotion } from "react-native-reanimated";
import type { StyleProp, ViewStyle } from "react-native";

import { fitnessMotion } from "@/features/fitness/realm/motion/fitnessMotion";

type AnimatedSectionProps = PropsWithChildren<{
  index?: number;
  style?: StyleProp<ViewStyle>;
}>;

export function AnimatedSection({ children, index = 0, style }: AnimatedSectionProps): JSX.Element {
  return (
    <Animated.View
      entering={FadeIn.duration(fitnessMotion.duration.standard).delay(index * fitnessMotion.stagger.section).reduceMotion(ReduceMotion.System)}
      layout={LinearTransition.duration(fitnessMotion.duration.standard).reduceMotion(ReduceMotion.System)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
