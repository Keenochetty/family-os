export const motion = {
  duration: {
    fast: 140,
    normal: 220,
    slow: 360,
  },
  spring: {
    gentle: { damping: 22, stiffness: 180 },
    responsive: { damping: 18, stiffness: 240 },
    firm: { damping: 26, stiffness: 320 },
  },
  scale: {
    pressed: 0.98,
    active: 1.02,
  },
} as const;

export type MotionDurationToken = keyof typeof motion.duration;
