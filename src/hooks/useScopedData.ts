import { useMemo } from "react";

import { canAccessVisibility } from "@/security";
import type { AccessSubject, OwnedResource, PermissionAction } from "@/types/permissions";

export function useScopedData<TResource extends OwnedResource>(
  subject: AccessSubject,
  resources: TResource[],
  action: PermissionAction,
): TResource[] {
  return useMemo(
    () => resources.filter((resource) => canAccessVisibility(subject, resource, action)),
    [action, resources, subject],
  );
}
