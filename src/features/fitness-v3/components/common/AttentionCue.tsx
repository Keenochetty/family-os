import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { motion } from '../../motion/motion';

type Props = {
  active?: boolean;
  colour: string;
  children: React.ReactNode;
};

export function AttentionCue({ active = false, colour, children }: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!active) return;

    scale.value = withDelay(
      350,
      withRepeat(
        withSequence(
          withTiming(1.018, { duration: motion.micro, reduceMotion: ReduceMotion.System }),
          withTiming(1, { duration: motion.standard, reduceMotion: ReduceMotion.System }),
        ),
        2,
        false,
      ),
    );

    opacity.value = withDelay(
      350,
      withRepeat(
        withSequence(
          withTiming(0.16, { duration: motion.micro, reduceMotion: ReduceMotion.System }),
          withTiming(0, { duration: motion.standard, reduceMotion: ReduceMotion.System }),
        ),
        2,
        false,
      ),
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [active, opacity, scale]);

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value + 0.08 }],
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View
        pointerEvents="none"
        style={[styles.halo, { backgroundColor: colour, borderColor: colour }, haloStyle]}
      />
      <Animated.View style={contentStyle}>{children}</Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  halo: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    borderWidth: 1,
    borderRadius: 18,
  },
});
