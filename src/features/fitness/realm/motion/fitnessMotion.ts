import { Easing, ReduceMotion } from "react-native-reanimated";

export const fitnessMotion = {
  duration: {
    layer: 320,
    micro: 140,
    milestone: 460,
    mode: 270,
    standard: 220,
  },
  easing: {
    enter: Easing.bezier(0.16, 1, 0.3, 1),
    exit: Easing.bezier(0.7, 0, 0.84, 0),
    standard: Easing.bezier(0.2, 0, 0, 1),
  },
  reduceMotion: ReduceMotion.System,
  stagger: {
    metric: 38,
    section: 52,
  },
} as const;

export const attentionRules = {
  firstCueDelayMs: 350,
  haloOpacity: 0.16,
  haloScale: 1.12,
  maxPulses: 2,
  pulseScale: 1.018,
} as const;
