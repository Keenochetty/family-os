import { useMemo } from "react";

import { canAccessVisibility } from "@/security";
import type { AccessSubject, OwnedResource, PermissionAction } from "@/types/permissions";

export function usePermissions(subject: AccessSubject): {
  canAccess: (resource: OwnedResource, action: PermissionAction) => boolean;
} {
  return useMemo(
    () => ({
      canAccess: (resource: OwnedResource, action: PermissionAction) => canAccessVisibility(subject, resource, action),
    }),
    [subject],
  );
}
