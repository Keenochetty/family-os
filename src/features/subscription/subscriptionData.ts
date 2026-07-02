import type { FeatureGateModel, FeatureKey, PlanId } from "@/security";

export type PlanInfo = {
  description: string;
  id: Exclude<PlanId, "enterprise">;
  label: string;
  monthlyPrice: string;
  recommended?: boolean;
};

export const plans: PlanInfo[] = [
  { description: "Private basics, limited scans, limited AI, one family circle.", id: "free", label: "Free", monthlyPrice: "$0" },
  { description: "Advanced charts, reports, connected devices, more scans and AI.", id: "plus", label: "Plus", monthlyPrice: "$8" },
  { description: "Family circles, caregiver profiles, shared tasks, and more storage.", id: "family", label: "Family", monthlyPrice: "$14", recommended: true },
  { description: "Caregiver and school workflows with stronger shared-access controls.", id: "care_school", label: "Care / School", monthlyPrice: "$24" },
];

export const featureGateModels: FeatureGateModel[] = [
  {
    currentUsage: 5,
    featureKey: "scans",
    requiredPlan: "plus",
    resetPeriod: "monthly",
    trialAvailable: true,
    upgradeMessage: "Plus increases monthly scans while keeping scan previews private.",
    usageLimit: 5,
  },
  {
    currentUsage: 1,
    featureKey: "reports",
    requiredPlan: "plus",
    resetPeriod: "monthly",
    trialAvailable: true,
    upgradeMessage: "Reports unlock safe summaries without exposing the report body in the lock state.",
  },
  {
    currentUsage: 1,
    featureKey: "familyCircles",
    requiredPlan: "family",
    resetPeriod: "none",
    trialAvailable: false,
    upgradeMessage: "Family supports multiple circles with explicit permissions.",
    usageLimit: 1,
  },
  {
    currentUsage: 0,
    featureKey: "caregiverProfiles",
    requiredPlan: "family",
    resetPeriod: "none",
    trialAvailable: false,
    upgradeMessage: "Caregiver profiles require Family or Care / School controls.",
  },
  {
    currentUsage: 3,
    featureKey: "momentExports",
    requiredPlan: "plus",
    resetPeriod: "monthly",
    trialAvailable: true,
    upgradeMessage: "Export Moments after privacy review with sensitive data removal.",
    usageLimit: 3,
  },
];

export const featureLabels: Record<FeatureKey, string> = {
  advancedCharts: "Advanced charts",
  aiChats: "AI chats",
  caregiverProfiles: "Caregiver profiles",
  connectedDevices: "Connected devices",
  documentStorage: "Document storage",
  familyCircles: "Family circles",
  momentExports: "Moment exports",
  reports: "Reports",
  scans: "Scans",
};

export const comparisonRows = [
  { care_school: "Included", family: "Included", free: "Limited", label: "AI chats", plus: "Expanded" },
  { care_school: "Included", family: "Included", free: "Locked", label: "Reports", plus: "Included" },
  { care_school: "Included", family: "Included", free: "1 circle", label: "Family circles", plus: "1 circle" },
  { care_school: "Included", family: "5 profiles", free: "Locked", label: "Caregiver profiles", plus: "Locked" },
  { care_school: "Included", family: "Included", free: "Locked", label: "Connected devices", plus: "Included" },
];
