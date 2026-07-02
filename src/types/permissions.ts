export type VisibilityLevel = "private" | "partner" | "circle" | "caregiver" | "school" | "custom";

export type Visibility = {
  level: VisibilityLevel;
  circleIds?: string[];
  userIds?: string[];
  expiresAt?: string;
};

export type PermissionSet = {
  canViewSummary: boolean;
  canViewRecords: boolean;
  canViewDocuments: boolean;
  canViewPhotos: boolean;
  canViewCalendar: boolean;
  canCreateEvents: boolean;
  canCreateTasks: boolean;
  canUpdateCareLogs: boolean;
  canComment: boolean;
  canShare: boolean;
  canInviteOthers: boolean;
  canManagePermissions: boolean;
};

export type PermissionAction = keyof PermissionSet;

export type AccessSubject = {
  userId: string;
  role?: string;
  circleIds?: string[];
  permissions?: Partial<Record<string, PermissionSet>>;
};

export type OwnedResource = {
  id: string;
  ownerUserId: string;
  personId?: string;
  circleId?: string;
  visibility: Visibility;
  createdBy?: string;
};
