export const baseColors = {
  backgroundLight: "#F7F7F5",
  surfaceLight: "#FFFFFF",
  surfaceLightAlt: "#F1F2F4",
  backgroundDark: "#0B0D12",
  surfaceDark: "#151821",
  surfaceDarkAlt: "#202432",
  textPrimaryLight: "#111827",
  textSecondaryLight: "#667085",
  textPrimaryDark: "#F8FAFC",
  textSecondaryDark: "#A8B0C2",
  borderLight: "rgba(17,24,39,0.08)",
  borderDark: "rgba(255,255,255,0.10)",
} as const;

export const brandColors = {
  primary: "#6D5DFB",
  primarySoft: "#A99BFF",
  ai: "#7C3AED",
  success: "#31C77F",
  warning: "#FFB84D",
  danger: "#EF4444",
  info: "#4DA3FF",
} as const;

export const realmColors = {
  fitness: "#FF8A3D",
  nutrition: "#34C759",
  familyHealth: "#3B82F6",
  mentalHealth: "#8E7CFF",
  period: "#FF5FA2",
  ovulation: "#A78BFA",
  pregnancy: "#FFB199",
  baby: "#7DD3FC",
  kids: "#2DD4BF",
  kidsAlt: "#FACC15",
  caregiver: "#22D3EE",
  school: "#22D3EE",
  medication: "#14B8A6",
  vitals: "#0EA5E9",
  doctorWarning: "#EF4444",
  records: "#64748B",
  documents: "#64748B",
  ai: "#7C3AED",
  emergency: "#DC2626",
  sport: "#FF6B35",
  sleep: "#5D6DFF",
  hydration: "#33C7FF",
} as const;

export const statusColors = {
  normal: "#31C77F",
  low: "#4DA3FF",
  high: "#FFB84D",
  urgent: "#EF4444",
  private: "#8E96A3",
  shared: "#6D5DFB",
  locked: "#64748B",
  caution: "#EF4444",
} as const;

export type RealmColorKey = keyof typeof realmColors;
export type StatusColorKey = keyof typeof statusColors;
