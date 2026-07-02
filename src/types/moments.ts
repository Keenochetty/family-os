import type { Visibility } from "./permissions";

export type Moment = {
  id: string;
  ownerUserId: string;
  circleId?: string;
  personId?: string;
  type: "celebration" | "progress" | "family" | "pregnancy" | "baby" | "fitness" | "nutrition" | "caregiver" | "sport" | "custom";
  title: string;
  subtitle?: string;
  templateId: string;
  imageUrls: string[];
  stats?: Record<string, string | number>;
  note?: string;
  privacy: Visibility;
  createdAt: string;
};
