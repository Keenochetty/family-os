import type { AuditEvent } from "@/security";
import type { PrivacyLabelKey, RealmColorKey } from "@/theme";

export type ConsentItem = {
  description: string;
  enabled: boolean;
  id: string;
  label: string;
  realm: RealmColorKey;
  requiresReview?: boolean;
};

export type SharedDataItem = {
  description: string;
  id: string;
  privacy: PrivacyLabelKey;
  sharedWith: string;
  title: string;
  type: string;
};

export const consentItems: ConsentItem[] = [
  { description: "Allow AI to use selected data only after review-before-save.", enabled: false, id: "ai-data", label: "AI can use my data", realm: "ai", requiresReview: true },
  { description: "Family can view records you explicitly share.", enabled: false, id: "family-records", label: "Family can view my records", realm: "familyHealth", requiresReview: true },
  { description: "Caregiver can update approved child care logs.", enabled: true, id: "caregiver-child", label: "Caregiver can update child info", realm: "caregiver", requiresReview: true },
  { description: "School can message you without seeing private records.", enabled: true, id: "school-message", label: "School can message me", realm: "school" },
  { description: "Devices can sync only enabled metrics.", enabled: false, id: "device-sync", label: "Device data sync", realm: "vitals", requiresReview: true },
  { description: "Location is used only for route, emergency, or calendar context after consent.", enabled: false, id: "location", label: "Location usage", realm: "sport", requiresReview: true },
  { description: "Calendar events can power reminders and AI summaries after review.", enabled: true, id: "calendar", label: "Calendar usage", realm: "records" },
  { description: "Contacts can be used for invites only after selecting people.", enabled: false, id: "contacts", label: "Contact usage", realm: "familyHealth" },
  { description: "Product updates and plan messages. Never required for care features.", enabled: false, id: "marketing", label: "Marketing opt-in", realm: "records" },
];

export const sharedDataItems: SharedDataItem[] = [
  { description: "Shared appointment reminder and vaccine due date only.", id: "share-child-calendar", privacy: "circle", sharedWith: "Household", title: "Child appointment summary", type: "Calendar" },
  { description: "Medication pickup note, allergy flag, and care log instructions.", id: "share-caregiver", privacy: "caregiver", sharedWith: "Caregiver", title: "Caregiver care scope", type: "Child care" },
  { description: "School attendance message thread with no health records attached.", id: "share-school", privacy: "school", sharedWith: "School", title: "School messages", type: "Messages" },
];

export const auditEvents: AuditEvent[] = [
  {
    actorUserId: "user-keeno",
    createdAt: "2026-07-02T08:10:00.000Z",
    id: "audit-view-record",
    metadata: { action: "viewed summary", viewer: "Keeno" },
    targetId: "record-week-summary",
    targetType: "health_record",
    type: "sensitive_item_viewed",
  },
  {
    actorUserId: "user-keeno",
    createdAt: "2026-07-02T08:24:00.000Z",
    id: "audit-permission",
    metadata: { changed: "caregiver access", scope: "medication pickup notes" },
    targetId: "permission-caregiver",
    targetType: "permission",
    type: "permission_changed",
  },
  {
    actorUserId: "device-garmin",
    createdAt: "2026-07-02T08:42:00.000Z",
    id: "audit-device-sync",
    metadata: { metrics: "heart rate, workouts", source: "Garmin" },
    targetId: "device-garmin",
    targetType: "device",
    type: "device_sync",
  },
  {
    actorUserId: "support-agent-placeholder",
    createdAt: "2026-07-02T09:00:00.000Z",
    id: "audit-support",
    metadata: { expiry: "30 minutes", scope: "diagnostics only" },
    targetId: "support-session",
    targetType: "support_session",
    type: "support_access",
  },
  {
    actorUserId: "user-keeno",
    createdAt: "2026-07-02T09:15:00.000Z",
    id: "audit-login",
    metadata: { device: "Windows", method: "password" },
    targetId: "user-keeno",
    targetType: "permission",
    type: "login",
  },
];

export const futurePrivacyHooks = [
  "createAuditEvent for views, changes, shares, logins, device syncs, and support access",
  "needsPrivacyReview before any sensitive share, export, AI save, or caregiver/school permission change",
  "requirePermission before loading records, documents, photos, calendar, care logs, or shared chats",
  "consent_changed audit event whenever a consent toggle changes",
];
