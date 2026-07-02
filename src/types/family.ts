import type { PermissionSet } from "./permissions";

export type Circle = {
  id: string;
  ownerId: string;
  name: string;
  type: "household" | "extended_family" | "friends" | "care_team" | "school" | "sport" | "custom";
  avatarUrl?: string;
  createdAt: string;
  privacyLevel: "private" | "invite_only" | "organization";
};

export type CircleMember = {
  id: string;
  circleId: string;
  userId: string;
  displayRole: string;
  roleType: "admin" | "parent" | "partner" | "child" | "family" | "friend" | "caregiver" | "teacher" | "viewer" | "custom";
  permissions: PermissionSet;
  joinedAt: string;
  status: "active" | "invited" | "blocked" | "removed";
};
