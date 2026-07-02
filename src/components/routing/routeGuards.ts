import type { AccessSubject, OwnedResource, PermissionAction } from "@/types";
import { canAccessVisibility } from "@/security";

export type RouteGuardResult = {
  allowed: boolean;
  reason?: string;
};

export function requireAuthenticatedRoute(userId?: string): RouteGuardResult {
  return userId ? { allowed: true } : { allowed: false, reason: "Authentication required." };
}

export function requirePermissionRoute(subject: AccessSubject, resource: OwnedResource, action: PermissionAction): RouteGuardResult {
  const allowed = canAccessVisibility(subject, resource, action);

  return allowed ? { allowed } : { allowed, reason: "Permission required." };
}
