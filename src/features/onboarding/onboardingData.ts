import type { PlanId } from "@/security";
import type { RealmColorKey } from "@/theme";
import type { RegionalHealthProfile, UserLocalizationPreferences } from "@/types";

export type AccountTypeOption = {
  description: string;
  id: "personal" | "caregiver" | "enterprise";
  title: string;
};

export type PurposeOption = {
  id: string;
  label: string;
  realms: RealmColorKey[];
};

export type OnboardingRealmPreview = {
  description: string;
  key: RealmColorKey;
  name: string;
};

export type OnboardingPlan = {
  description: string;
  id: PlanId;
  title: string;
};

export const detectedAccountDetails = {
  displayName: "Keeno",
  email: "keeno@example.com",
  phone: "+27 82 000 0000",
};

export const accountTypeOptions: AccountTypeOption[] = [
  { id: "personal", title: "Personal", description: "Track your own health, records, calendar, AI chats, and Moments." },
  { id: "caregiver", title: "Caregiver", description: "Create a work profile and access only children or elders explicitly shared with you." },
  { id: "enterprise", title: "Enterprise", description: "Prepare for school, care team, or organization workflows with assigned access." },
];

export const defaultRegionalHealthProfile: RegionalHealthProfile = {
  countryCode: "ZA",
  emergencyNumber: "112",
  primaryHealthAuthority: "National Department of Health",
  regionName: "South Africa",
  whoRegion: "AFRO",
};

export const defaultLocalizationPreferences: UserLocalizationPreferences = {
  aiLanguage: "English",
  countryCode: "ZA",
  language: "English",
  units: {
    dateFormat: "dd_mm_yyyy",
    distance: "km",
    energy: "kcal",
    glucose: "mmol_l",
    height: "cm",
    temperature: "c",
    timeFormat: "24h",
    water: "ml",
    weight: "kg",
  },
};

export const purposeOptions: PurposeOption[] = [
  { id: "fitness", label: "Move more", realms: ["fitness", "sport"] },
  { id: "nutrition", label: "Eat better", realms: ["nutrition", "hydration"] },
  { id: "family", label: "Care for family", realms: ["familyHealth", "caregiver"] },
  { id: "baby", label: "Baby or kids", realms: ["baby", "kids"] },
  { id: "mind", label: "Stress and mood", realms: ["mentalHealth", "sleep"] },
  { id: "records", label: "Organize records", realms: ["records", "documents"] },
  { id: "medication", label: "Medication safety", realms: ["medication", "vitals"] },
  { id: "pregnancy", label: "Pregnancy or period", realms: ["pregnancy", "period"] },
];

export const defaultTopRealms: OnboardingRealmPreview[] = [
  { key: "familyHealth", name: "Family Health", description: "Shared care without exposing private details by default." },
  { key: "fitness", name: "Fitness", description: "Today actions, workouts, and progress trends." },
  { key: "nutrition", name: "Nutrition", description: "Meals, hydration, groceries, and food scans." },
  { key: "records", name: "Records", description: "Documents, doctor notes, scans, and history." },
];

export const permissionPreviewItems = [
  "Camera and photos are used for scans only when you choose Scan or Upload.",
  "Notifications are used for medication, appointments, caregiver updates, and reminders.",
  "Contacts can help invitations later, but family sharing is always explicit.",
  "Health/device data sync will require consent per metric before any connection.",
];

export const onboardingPlans: OnboardingPlan[] = [
  { id: "free", title: "Free", description: "Personal profile, basic logs, calendar, limited AI, one family circle." },
  { id: "plus", title: "Plus", description: "More AI, advanced summaries, scan history, documents, charts, and reports." },
  { id: "family", title: "Family", description: "Multiple people, circles, shared tasks, caregiver invites, and family Moments." },
];
