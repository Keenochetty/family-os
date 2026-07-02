import type { Visibility } from "@/types/permissions";

export type SensitiveDataCategory =
  | "ai_chat"
  | "allergy"
  | "child_photo"
  | "document"
  | "emergency"
  | "health_record"
  | "medication"
  | "mental_health"
  | "pregnancy"
  | "scan";

export type PrivacyReviewRequest = {
  actorUserId: string;
  resourceId: string;
  categories: SensitiveDataCategory[];
  currentVisibility: Visibility;
  proposedVisibility: Visibility;
};

export type PrivacyReviewResult = {
  required: boolean;
  warnings: string[];
};

const highRiskCategories: SensitiveDataCategory[] = [
  "allergy",
  "child_photo",
  "document",
  "emergency",
  "health_record",
  "medication",
  "mental_health",
  "pregnancy",
  "scan",
];

export function needsPrivacyReview(request: PrivacyReviewRequest): PrivacyReviewResult {
  const warnings: string[] = [];
  const visibilityChanged = request.currentVisibility.level !== request.proposedVisibility.level;
  const sharingBeyondPrivate = request.proposedVisibility.level !== "private";

  if (visibilityChanged && sharingBeyondPrivate) {
    warnings.push("This changes who can see the item.");
  }

  if (request.categories.some((category) => highRiskCategories.includes(category)) && sharingBeyondPrivate) {
    warnings.push("Sensitive health or family information should be reviewed before sharing.");
  }

  if (request.proposedVisibility.expiresAt) {
    warnings.push("This access expires automatically. Confirm the expiry date is intended.");
  }

  return {
    required: warnings.length > 0,
    warnings,
  };
}
