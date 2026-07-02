import type { PropsWithChildren } from 'react';
import Animated, { FadeInUp, LinearTransition, ReduceMotion } from 'react-native-reanimated';
import { motion } from '../../motion/motion';

type Props = PropsWithChildren<{ index?: number; className?: string }>;

export function EntranceSection({ children, index = 0, className }: Props) {
  return (
    <Animated.View
      entering={FadeInUp
        .duration(motion.content)
        .delay(index * motion.stagger)
        .reduceMotion(ReduceMotion.System)}
      layout={LinearTransition
        .duration(motion.standard)
        .reduceMotion(ReduceMotion.System)}
      className={className}
    >
      {children}
    </Animated.View>
  );
}
