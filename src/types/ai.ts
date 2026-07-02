import type { Visibility } from "./permissions";

export type AIMessage = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  createdAt: string;
  reviewedBeforeSave?: boolean;
};

export type AIChat = {
  id: string;
  ownerUserId: string;
  title: string;
  category:
    | "general"
    | "fitness"
    | "nutrition"
    | "family"
    | "baby"
    | "pregnancy"
    | "period"
    | "mental_health"
    | "documents"
    | "scan"
    | "caregiver"
    | "sport";
  linkedPersonId?: string;
  linkedCircleId?: string;
  linkedRealmKey?: string;
  privacy: Visibility;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
};
