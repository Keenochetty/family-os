import type { PrivacyLabelKey, RealmColorKey } from "@/theme";
import type { Circle, CircleMember, PermissionSet } from "@/types";

export type FamilyPerson = {
  circleIds: string[];
  id: string;
  name: string;
  privacy: PrivacyLabelKey;
  relationship: string;
  roleByCircle: Record<string, string>;
  route: string;
  summary: string;
  tone: RealmColorKey;
};

export type FamilySharedItem = {
  action: string;
  description: string;
  id: string;
  privacy: PrivacyLabelKey;
  route: string;
  title: string;
  tone: RealmColorKey;
};

export const defaultCirclePermissions: PermissionSet = {
  canComment: true,
  canCreateEvents: true,
  canCreateTasks: true,
  canInviteOthers: false,
  canManagePermissions: false,
  canShare: false,
  canUpdateCareLogs: false,
  canViewCalendar: true,
  canViewDocuments: false,
  canViewPhotos: false,
  canViewRecords: false,
  canViewSummary: true,
};

export const familyCircles: Circle[] = [
  {
    createdAt: "2026-07-02T08:00:00.000Z",
    id: "circle-household",
    name: "Household",
    ownerId: "user-keeno",
    privacyLevel: "invite_only",
    type: "household",
  },
  {
    createdAt: "2026-07-02T08:10:00.000Z",
    id: "circle-care",
    name: "Care team",
    ownerId: "user-keeno",
    privacyLevel: "invite_only",
    type: "care_team",
  },
  {
    createdAt: "2026-07-02T08:20:00.000Z",
    id: "circle-school",
    name: "School",
    ownerId: "user-keeno",
    privacyLevel: "organization",
    type: "school",
  },
];

export const circleMembers: CircleMember[] = [
  {
    circleId: "circle-household",
    displayRole: "Owner",
    id: "member-keeno",
    joinedAt: "2026-07-02T08:00:00.000Z",
    permissions: { ...defaultCirclePermissions, canManagePermissions: true, canShare: true, canViewDocuments: true, canViewPhotos: true, canViewRecords: true },
    roleType: "admin",
    status: "active",
    userId: "user-keeno",
  },
  {
    circleId: "circle-household",
    displayRole: "Child",
    id: "member-liam",
    joinedAt: "2026-07-02T08:00:00.000Z",
    permissions: defaultCirclePermissions,
    roleType: "child",
    status: "active",
    userId: "person-liam",
  },
];

export const familyPeople: FamilyPerson[] = [
  {
    circleIds: ["circle-household"],
    id: "person-partner",
    name: "Partner",
    privacy: "circle",
    relationship: "Partner",
    roleByCircle: { "circle-household": "Parent" },
    route: "/family/person/person-partner",
    summary: "Can view shared calendar and summaries. Records remain private unless explicitly shared.",
    tone: "familyHealth",
  },
  {
    circleIds: ["circle-household", "circle-school"],
    id: "person-liam",
    name: "Liam",
    privacy: "private",
    relationship: "Child",
    roleByCircle: { "circle-household": "Child", "circle-school": "Learner" },
    route: "/family/person/person-liam",
    summary: "Child data is private by default. School and caregiver access requires parent approval.",
    tone: "kids",
  },
  {
    circleIds: ["circle-care"],
    id: "person-caregiver",
    name: "Caregiver",
    privacy: "caregiver",
    relationship: "Caregiver",
    roleByCircle: { "circle-care": "Caregiver" },
    route: "/family/caregiver/person-caregiver",
    summary: "Can see only allergies, medication, pickup notes, and care logs explicitly shared by parents.",
    tone: "caregiver",
  },
  {
    circleIds: ["circle-school"],
    id: "person-teacher",
    name: "Teacher",
    privacy: "school",
    relationship: "Teacher",
    roleByCircle: { "circle-school": "Teacher" },
    route: "/family/person/person-teacher",
    summary: "School profile receives only approved school forms, attendance, and parent messages.",
    tone: "school",
  },
];

export const sharedChats: FamilySharedItem[] = [
  {
    action: "Open chat",
    description: "Shared summary only. Full AI chat remains private unless explicitly shared.",
    id: "chat-meal-plan",
    privacy: "circle",
    route: "/family/shared-chat/chat-meal-plan",
    title: "Family meal plan",
    tone: "ai",
  },
];

export const sharedTasks: FamilySharedItem[] = [
  {
    action: "Review task",
    description: "Buy child-safe snacks. Assigned to Household with no medical records attached.",
    id: "task-snacks",
    privacy: "circle",
    route: "/calendar",
    title: "Snack prep",
    tone: "nutrition",
  },
];

export const inviteMethods = [
  "QR code",
  "Share link",
  "Phone contact",
  "Email",
  "SMS or WhatsApp",
  "Caregiver code",
  "School code",
];

export const permissionPreview = [
  "Child data is never shared by default.",
  "Caregivers see only fields parents explicitly share.",
  "Shared chats are private unless a specific sharing mode is selected.",
  "Permission changes require privacy review and audit logging.",
  "Access links and QR codes should expire.",
];
