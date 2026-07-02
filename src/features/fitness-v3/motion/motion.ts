import { Easing } from 'react-native-reanimated';

export const motion = {
  micro: 140,
  standard: 210,
  content: 240,
  mode: 270,
  layer: 320,
  achievement: 460,
  stagger: 45,
  easing: {
    enter: Easing.bezier(0.16, 1, 0.3, 1),
    standard: Easing.bezier(0.2, 0, 0, 1),
    exit: Easing.bezier(0.7, 0, 0.84, 0),
  },
} as const;
