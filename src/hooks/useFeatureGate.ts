import { useMemo } from "react";

import { evaluateFeatureGate, type FeatureGateResult, type FeatureKey, type PlanId } from "@/security";

export function useFeatureGate(planId: PlanId, feature: FeatureKey, used = 0): FeatureGateResult {
  return useMemo(() => evaluateFeatureGate(planId, feature, used), [feature, planId, used]);
}
