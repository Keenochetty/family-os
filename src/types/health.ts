import type { Visibility } from "./permissions";

export type HealthRealmPrivacy = "private" | "shared" | "custom";

export type HealthRealm = {
  id: string;
  key: string;
  name: string;
  color: string;
  icon: string;
  enabled: boolean;
  pinned: boolean;
  order: number;
  privacy: HealthRealmPrivacy;
};

export type HealthRecord = {
  id: string;
  ownerUserId: string;
  personId?: string;
  realmKey: string;
  metricKey: string;
  value: number | string | boolean;
  unitCanonical?: string;
  displayUnit?: string;
  recordedAt: string;
  source: "manual" | "device" | "scan" | "ai" | "calendar" | "import";
  sourceId?: string;
  status?: "normal" | "low" | "high" | "urgent" | "unknown";
  notes?: string;
  attachments?: string[];
  visibility: Visibility;
  createdBy: string;
  updatedAt: string;
};
