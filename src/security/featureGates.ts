export type PlanId = "free" | "plus" | "family" | "care_school" | "enterprise";

export type FeatureKey =
  | "advancedCharts"
  | "aiChats"
  | "caregiverProfiles"
  | "connectedDevices"
  | "documentStorage"
  | "familyCircles"
  | "momentExports"
  | "reports"
  | "scans";

export type FeatureLimit = {
  enabled: boolean;
  limit?: number;
  reason?: string;
};

export type FeatureGateResult = FeatureLimit & {
  currentUsage?: number;
  feature: FeatureKey;
  planId: PlanId;
  remaining?: number;
  requiredPlan?: PlanId;
  resetPeriod?: "daily" | "weekly" | "monthly" | "yearly" | "none";
  trialAvailable?: boolean;
  upgradeMessage?: string;
};

export type FeatureGateModel = {
  currentUsage: number;
  featureKey: FeatureKey;
  requiredPlan: PlanId;
  resetPeriod: "daily" | "weekly" | "monthly" | "yearly" | "none";
  trialAvailable: boolean;
  upgradeMessage: string;
  usageLimit?: number;
};

export const planFeatureLimits: Record<PlanId, Record<FeatureKey, FeatureLimit>> = {
  free: {
    advancedCharts: { enabled: false, reason: "Advanced charts are included in Plus and higher." },
    aiChats: { enabled: true, limit: 10 },
    caregiverProfiles: { enabled: false, reason: "Caregiver profiles require Family or Care/School." },
    connectedDevices: { enabled: false, reason: "Connected device insights are included in Plus and higher." },
    documentStorage: { enabled: true, limit: 25 },
    familyCircles: { enabled: true, limit: 1 },
    momentExports: { enabled: true, limit: 3 },
    reports: { enabled: false, reason: "Reports are included in Plus and higher." },
    scans: { enabled: true, limit: 5 },
  },
  plus: {
    advancedCharts: { enabled: true },
    aiChats: { enabled: true, limit: 100 },
    caregiverProfiles: { enabled: false, reason: "Caregiver profiles require Family or Care/School." },
    connectedDevices: { enabled: true },
    documentStorage: { enabled: true, limit: 250 },
    familyCircles: { enabled: true, limit: 1 },
    momentExports: { enabled: true, limit: 25 },
    reports: { enabled: true },
    scans: { enabled: true, limit: 100 },
  },
  family: {
    advancedCharts: { enabled: true },
    aiChats: { enabled: true, limit: 250 },
    caregiverProfiles: { enabled: true, limit: 5 },
    connectedDevices: { enabled: true },
    documentStorage: { enabled: true, limit: 1000 },
    familyCircles: { enabled: true },
    momentExports: { enabled: true },
    reports: { enabled: true },
    scans: { enabled: true, limit: 250 },
  },
  care_school: {
    advancedCharts: { enabled: true },
    aiChats: { enabled: true },
    caregiverProfiles: { enabled: true },
    connectedDevices: { enabled: true },
    documentStorage: { enabled: true },
    familyCircles: { enabled: true },
    momentExports: { enabled: true },
    reports: { enabled: true },
    scans: { enabled: true },
  },
  enterprise: {
    advancedCharts: { enabled: true },
    aiChats: { enabled: true },
    caregiverProfiles: { enabled: true },
    connectedDevices: { enabled: true },
    documentStorage: { enabled: true },
    familyCircles: { enabled: true },
    momentExports: { enabled: true },
    reports: { enabled: true },
    scans: { enabled: true },
  },
};

export function evaluateFeatureGate(planId: PlanId, feature: FeatureKey, used = 0): FeatureGateResult {
  const limit = planFeatureLimits[planId][feature];
  const remaining = typeof limit.limit === "number" ? Math.max(limit.limit - used, 0) : undefined;

  return {
    ...limit,
    currentUsage: used,
    enabled: limit.enabled && (typeof limit.limit !== "number" || used < limit.limit),
    feature,
    planId,
    remaining,
    reason: limit.enabled && remaining === 0 ? "Usage limit reached for the current plan." : limit.reason,
  };
}
