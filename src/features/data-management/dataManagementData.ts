import type { PrivacyLabelKey, RealmColorKey } from "@/theme";

export type ReportTemplate = {
  description: string;
  id: string;
  privacy: PrivacyLabelKey;
  realm: RealmColorKey;
  title: string;
};

export type DataScope = {
  description: string;
  enabled: boolean;
  id: string;
  privacy: PrivacyLabelKey;
  realm: RealmColorKey;
  title: string;
};

export const reportTemplates: ReportTemplate[] = [
  { description: "Scoped summary for clinician review with date range and source labels.", id: "doctor", privacy: "private", realm: "records", title: "Doctor report" },
  { description: "Care logs, medication pickup notes, allergies, and caregiver instructions.", id: "child-care", privacy: "caregiver", realm: "caregiver", title: "Child care report" },
  { description: "Milestones, appointments, notes, and private pregnancy trend summaries.", id: "pregnancy", privacy: "private", realm: "pregnancy", title: "Pregnancy report" },
  { description: "Training consistency, sport sessions, trends, and educational progress charts.", id: "fitness", privacy: "private", realm: "fitness", title: "Fitness progress report" },
  { description: "Medication schedule, adherence notes, side-effect notes, and pharmacy reminders.", id: "medication", privacy: "private", realm: "medication", title: "Medication report" },
  { description: "Mood trend summary with sensitive notes removable before export.", id: "mood", privacy: "private", realm: "mentalHealth", title: "Mood trend report" },
];

export const exportScopes: DataScope[] = [
  { description: "Vitals, records, scans, medication, fitness, mood, and family health summaries.", enabled: true, id: "health-records", privacy: "private", realm: "records", title: "Health records" },
  { description: "Uploaded documents, prescriptions, school forms, and clinic cards.", enabled: false, id: "documents", privacy: "private", realm: "documents", title: "Documents" },
  { description: "AI chats and summaries selected after review-before-save.", enabled: false, id: "ai-chats", privacy: "private", realm: "ai", title: "AI chats" },
  { description: "Appointments, reminders, sport days, family tasks, and attendance responses.", enabled: true, id: "calendar", privacy: "private", realm: "records", title: "Calendar" },
  { description: "Private memory cards with sensitive details removable before export.", enabled: false, id: "moments", privacy: "private", realm: "familyHealth", title: "Moments" },
];

export const importSources: DataScope[] = [
  { description: "CSV or PDF health records from a clinician or previous app.", enabled: true, id: "records", privacy: "private", realm: "records", title: "Records" },
  { description: "Documents and images queued for review before saving.", enabled: true, id: "documents", privacy: "private", realm: "documents", title: "Documents" },
  { description: "Scan results requiring review before medication or food data is stored.", enabled: false, id: "scans", privacy: "private", realm: "records", title: "Scans" },
  { description: "Device files and exports mapped only after metric consent.", enabled: false, id: "device-files", privacy: "private", realm: "vitals", title: "Device files" },
];

export const offlineScopes: DataScope[] = [
  { description: "Name, emergency contacts, critical conditions, allergies, and emergency instructions.", enabled: true, id: "emergency-profile", privacy: "private", realm: "emergency", title: "Emergency profile" },
  { description: "Today only, with private details hidden from lock-screen previews.", enabled: true, id: "tasks", privacy: "private", realm: "records", title: "Today's tasks" },
  { description: "Child pickup notes, allergies, medication pickup, and care instructions.", enabled: false, id: "caregiver-child-info", privacy: "caregiver", realm: "caregiver", title: "Caregiver child info" },
  { description: "Selected documents only, never the full document library by default.", enabled: false, id: "documents", privacy: "private", realm: "documents", title: "Important documents" },
  { description: "Medication times, dosage labels, and pharmacy notes selected by the user.", enabled: true, id: "medication-schedule", privacy: "private", realm: "medication", title: "Medication schedule" },
];

export const emergencyProfileItems = [
  "Emergency contacts",
  "Critical allergies",
  "Medication schedule",
  "Blood type placeholder",
  "Care instructions",
  "Preferred hospital placeholder",
];

export const dataSecurityNotes = [
  "Exports require re-auth and privacy confirmation.",
  "Emergency profile must be carefully scoped and minimal.",
  "Offline data is sensitive and should support expiry, device lock, and audit hooks.",
  "Imports must be reviewed before records are created or overwritten.",
];
