export type AuditEventType =
  | "ai_review_saved"
  | "caregiver_update"
  | "calendar_used"
  | "consent_changed"
  | "device_sync"
  | "document_shared"
  | "feature_locked"
  | "health_record_created"
  | "login"
  | "permission_changed"
  | "privacy_review_completed"
  | "scan_review_saved"
  | "school_message"
  | "sensitive_item_viewed"
  | "support_access";

export type AuditEvent = {
  id: string;
  type: AuditEventType;
  actorUserId: string;
  targetId: string;
  targetType: "ai_chat" | "calendar_event" | "consent" | "device" | "document" | "health_record" | "moment" | "permission" | "scan" | "support_session" | "task";
  circleId?: string;
  personId?: string;
  metadata?: Record<string, string | number | boolean>;
  createdAt: string;
};

export function createAuditEvent(input: Omit<AuditEvent, "id" | "createdAt">): AuditEvent {
  return {
    ...input,
    id: `audit-${Date.now()}-${Math.round(Math.random() * 10000)}`,
    createdAt: new Date().toISOString(),
  };
}
