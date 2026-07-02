import { statusColors } from "./colors";

export type PrivacyLabelKey = "private" | "partner" | "circle" | "caregiver" | "school" | "custom" | "publicPreview";

export type StatusLabelKey = "normal" | "low" | "high" | "urgent" | "unknown" | "shared" | "locked";

export type PlanLockLabelKey = "freeLimit" | "plusRequired" | "familyRequired" | "careSchoolRequired" | "enterpriseRequired";

export type TokenLabel = {
  label: string;
  tone: string;
  accessibilityLabel: string;
};

export const privacyLabels: Record<PrivacyLabelKey, TokenLabel> = {
  private: {
    label: "Private",
    tone: statusColors.private,
    accessibilityLabel: "Private. Only you can see this.",
  },
  partner: {
    label: "Partner",
    tone: statusColors.shared,
    accessibilityLabel: "Shared with partner.",
  },
  circle: {
    label: "Circle",
    tone: statusColors.shared,
    accessibilityLabel: "Shared with selected family circle.",
  },
  caregiver: {
    label: "Caregiver",
    tone: statusColors.shared,
    accessibilityLabel: "Shared with selected caregiver.",
  },
  school: {
    label: "School",
    tone: statusColors.shared,
    accessibilityLabel: "Shared with selected school or class.",
  },
  custom: {
    label: "Custom",
    tone: statusColors.shared,
    accessibilityLabel: "Custom sharing permissions.",
  },
  publicPreview: {
    label: "Preview",
    tone: statusColors.private,
    accessibilityLabel: "Safe preview. Private data is hidden.",
  },
};

export const statusLabels: Record<StatusLabelKey, TokenLabel> = {
  normal: {
    label: "Normal",
    tone: statusColors.normal,
    accessibilityLabel: "Status normal.",
  },
  low: {
    label: "Low",
    tone: statusColors.low,
    accessibilityLabel: "Status low.",
  },
  high: {
    label: "High",
    tone: statusColors.high,
    accessibilityLabel: "Status high.",
  },
  urgent: {
    label: "Urgent",
    tone: statusColors.urgent,
    accessibilityLabel: "Urgent status.",
  },
  unknown: {
    label: "Unknown",
    tone: statusColors.private,
    accessibilityLabel: "Status unknown.",
  },
  shared: {
    label: "Shared",
    tone: statusColors.shared,
    accessibilityLabel: "This item is shared.",
  },
  locked: {
    label: "Locked",
    tone: statusColors.locked,
    accessibilityLabel: "Feature locked. Private data remains hidden.",
  },
};

export const planLockLabels: Record<PlanLockLabelKey, TokenLabel> = {
  freeLimit: {
    label: "Limit reached",
    tone: statusColors.locked,
    accessibilityLabel: "Usage limit reached for your current plan.",
  },
  plusRequired: {
    label: "Plus",
    tone: statusColors.shared,
    accessibilityLabel: "Plus plan required.",
  },
  familyRequired: {
    label: "Family",
    tone: statusColors.shared,
    accessibilityLabel: "Family plan required.",
  },
  careSchoolRequired: {
    label: "Care/School",
    tone: statusColors.shared,
    accessibilityLabel: "Care or school plan required.",
  },
  enterpriseRequired: {
    label: "Enterprise",
    tone: statusColors.shared,
    accessibilityLabel: "Enterprise plan required.",
  },
};
