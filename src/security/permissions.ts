import type { AccessSubject, OwnedResource, PermissionAction, PermissionSet, Visibility } from "@/types/permissions";

export const denyAllPermissions: PermissionSet = {
  canViewSummary: false,
  canViewRecords: false,
  canViewDocuments: false,
  canViewPhotos: false,
  canViewCalendar: false,
  canCreateEvents: false,
  canCreateTasks: false,
  canUpdateCareLogs: false,
  canComment: false,
  canShare: false,
  canInviteOthers: false,
  canManagePermissions: false,
};

export const ownerPermissions: PermissionSet = {
  canViewSummary: true,
  canViewRecords: true,
  canViewDocuments: true,
  canViewPhotos: true,
  canViewCalendar: true,
  canCreateEvents: true,
  canCreateTasks: true,
  canUpdateCareLogs: true,
  canComment: true,
  canShare: true,
  canInviteOthers: true,
  canManagePermissions: true,
};

export function isVisibilityExpired(visibility: Visibility, now = new Date()): boolean {
  return Boolean(visibility.expiresAt && new Date(visibility.expiresAt).getTime() <= now.getTime());
}

export function canAccessVisibility(subject: AccessSubject, resource: OwnedResource, action: PermissionAction): boolean {
  if (resource.ownerUserId === subject.userId) {
    return true;
  }

  if (isVisibilityExpired(resource.visibility)) {
    return false;
  }

  if (resource.visibility.level === "private") {
    return false;
  }

  if (resource.visibility.userIds?.includes(subject.userId)) {
    return true;
  }

  const circleId = resource.circleId ?? resource.visibility.circleIds?.find((id) => subject.circleIds?.includes(id));
  if (!circleId || !subject.circleIds?.includes(circleId)) {
    return false;
  }

  const permissions = subject.permissions?.[circleId] ?? denyAllPermissions;
  return permissions[action] === true;
}

export function requirePermission(subject: AccessSubject, resource: OwnedResource, action: PermissionAction): void {
  if (!canAccessVisibility(subject, resource, action)) {
    throw new Error(`Permission denied for ${action} on ${resource.id}`);
  }
}
