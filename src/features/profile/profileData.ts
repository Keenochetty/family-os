import type { PrivacyLabelKey, RealmColorKey } from "@/theme";

export type ProfileSummaryItem = {
  label: string;
  value: string;
};

export type ProfilePreviewCard = {
  description: string;
  id: string;
  privacy: PrivacyLabelKey;
  route: string;
  title: string;
  tone: RealmColorKey;
};

export type SettingsItem = {
  description: string;
  id: string;
  reauthRequired?: boolean;
  route: string;
  title: string;
};

export type SettingsGroup = {
  id: string;
  items: SettingsItem[];
  title: string;
};

export const profileIdentity = {
  accountType: "Personal + family owner",
  displayName: "Keeno",
  languageUnits: "English, kg, cm, km, 24h",
  plan: "Family Plus",
  region: "South Africa",
  role: "Owner",
};

export const healthSummary: ProfileSummaryItem[] = [
  { label: "Top realms", value: "Fitness, Nutrition, Family, Records" },
  { label: "Last scan", value: "Medication label, reviewed" },
  { label: "Privacy", value: "Private by default" },
];

export const profilePreviews: ProfilePreviewCard[] = [
  {
    description: "Family walk saved privately. Review children, location, and health notes before sharing.",
    id: "latest-moment",
    privacy: "private",
    route: "/profile/moments",
    title: "Latest Moment",
    tone: "familyHealth",
  },
  {
    description: "Household, Care team, and School circles are active. Each role has separate permissions.",
    id: "family-circles",
    privacy: "circle",
    route: "/family",
    title: "Family circles",
    tone: "familyHealth",
  },
  {
    description: "Apple Health ready. Wearable sync and scale imports remain off until consent is confirmed.",
    id: "connected-devices",
    privacy: "private",
    route: "/profile/settings/connected-devices",
    title: "Connected devices",
    tone: "vitals",
  },
  {
    description: "AI memory off for sensitive items. Family sharing and caregiver access require privacy review.",
    id: "privacy-status",
    privacy: "private",
    route: "/profile/settings/privacy",
    title: "Privacy status",
    tone: "records",
  },
];

export const settingsGroups: SettingsGroup[] = [
  {
    id: "account",
    title: "Account",
    items: [
      { description: "Email, phone, account status, and profile details.", id: "account", route: "/profile/settings/account", title: "Account" },
      { description: "Avatar, display name, role, and visible profile metadata.", id: "profile", route: "/profile/avatar", title: "Profile" },
      { description: "Current plan, billing state, and upgrade controls.", id: "plan", route: "/profile/plan", title: "Plan & billing" },
    ],
  },
  {
    id: "privacy",
    title: "Privacy and access",
    items: [
      { description: "Sharing defaults, family visibility, and private-by-default rules.", id: "privacy", reauthRequired: true, route: "/profile/settings/privacy", title: "Privacy & sharing" },
      { description: "2FA, passkeys, sessions, and sensitive-screen lock.", id: "security", reauthRequired: true, route: "/profile/settings/security", title: "Security / 2FA" },
      { description: "Consent records for AI, family sharing, devices, and support.", id: "consent", reauthRequired: true, route: "/profile/settings/consent-center", title: "Consent center" },
    ],
  },
  {
    id: "preferences",
    title: "Preferences",
    items: [
      { description: "Country, language, units, dates, and time format.", id: "region", route: "/profile/settings/region-language-units", title: "Region, language & units" },
      { description: "Theme, Glass Mode, motion, haptics, text size, and contrast.", id: "appearance", route: "/profile/settings/appearance", title: "Appearance" },
      { description: "Health, family, calendar, AI, and system notification controls.", id: "notifications", route: "/profile/settings/notifications", title: "Notifications" },
    ],
  },
  {
    id: "health",
    title: "Health OS",
    items: [
      { description: "Metric visibility, units, trends, and sensitive data review.", id: "health-data", reauthRequired: true, route: "/profile/settings/health-data", title: "Health data & metrics" },
      { description: "Wearables, imports, Apple Health, Google Fit, and manual sources.", id: "devices", route: "/profile/settings/connected-devices", title: "Connected devices" },
      { description: "Family circles, roles, invites, child access, and shared tasks.", id: "family", route: "/family", title: "Family & circles" },
      { description: "Caregiver and school views with limited approved access.", id: "caregiver-school", reauthRequired: true, route: "/family/permissions", title: "Caregiver / school mode" },
      { description: "AI memory, saved summaries, medical caution, and sharing review.", id: "ai", route: "/profile/settings/ai-settings", title: "AI settings" },
      { description: "Private memory cards, sharing defaults, and export review.", id: "moments", route: "/profile/moments", title: "Moments settings" },
      { description: "Source preferences, medical review labels, region, and licensing.", id: "articles", route: "/profile/settings/articles-sources", title: "Articles & sources" },
    ],
  },
  {
    id: "data",
    title: "Data and support",
    items: [
      { description: "Export account, health, scan, family, and AI data after confirmation.", id: "export", reauthRequired: true, route: "/profile/settings/export-data", title: "Data export" },
      { description: "Support sessions, diagnostics, and help center access.", id: "support", route: "/profile/settings/support", title: "Help & support" },
      { description: "Common questions about privacy, family sharing, scans, AI, and plans.", id: "faq", route: "/profile/settings/faq", title: "FAQ" },
    ],
  },
  {
    id: "legal",
    title: "Legal",
    items: [
      { description: "Service terms and account rules.", id: "terms", route: "/profile/settings/terms", title: "Terms" },
      { description: "Privacy policy, consent, data retention, and user rights.", id: "privacy-policy", route: "/profile/settings/privacy-policy", title: "Privacy Policy" },
      { description: "Medical safety limits and emergency guidance.", id: "medical-disclaimer", route: "/profile/settings/medical-disclaimer", title: "Medical Disclaimer" },
      { description: "Permanent account deletion with confirmation and revocation.", id: "delete-account", reauthRequired: true, route: "/profile/settings/delete-account", title: "Delete account" },
    ],
  },
];
