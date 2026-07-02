import type { PrivacyLabelKey, RealmColorKey } from "@/theme";

export type HealthRealmWidget = {
  actionLabel: string;
  description: string;
  id: string;
  miniMetric: string;
  privacy: PrivacyLabelKey;
  realm: RealmColorKey;
  route: string;
  status: string;
  title: string;
};

export type HealthToolGroup = {
  id: string;
  title: string;
  tools: HealthTool[];
};

export type HealthTool = {
  id: string;
  label: string;
  locked?: boolean;
  privacy: PrivacyLabelKey;
  realm: RealmColorKey;
  route: string;
};

export type RealmArticleCard = {
  id: string;
  realm: RealmColorKey;
  source: string;
  summary: string;
  title: string;
};

export const topRealmWidgets: HealthRealmWidget[] = [
  {
    actionLabel: "Start",
    description: "Strength plan is ready. Long press for records, charts, privacy, or AI.",
    id: "realm-fitness",
    miniMetric: "3/5 sessions",
    privacy: "private",
    realm: "fitness",
    route: "/fitness",
    status: "On track",
    title: "Fitness",
  },
  {
    actionLabel: "Log meal",
    description: "Food, water, grocery, and scanner shortcuts stay private until shared.",
    id: "realm-nutrition",
    miniMetric: "2 meals",
    privacy: "private",
    realm: "nutrition",
    route: "/food",
    status: "Lunch due",
    title: "Nutrition",
  },
  {
    actionLabel: "Review",
    description: "Family health summaries show only mock permission-approved updates.",
    id: "realm-family",
    miniMetric: "2 updates",
    privacy: "circle",
    realm: "familyHealth",
    route: "/family",
    status: "Needs review",
    title: "Family Health",
  },
  {
    actionLabel: "Open",
    description: "Documents and history are private by default and require privacy review before sharing.",
    id: "realm-records",
    miniMetric: "1 new doc",
    privacy: "private",
    realm: "records",
    route: "/records",
    status: "Private",
    title: "Records",
  },
];

export const moreToolGroups: HealthToolGroup[] = [
  {
    id: "body",
    title: "Health Body",
    tools: [
      { id: "fitness", label: "Fitness", privacy: "private", realm: "fitness", route: "/fitness" },
      { id: "sports", label: "Sports", privacy: "private", realm: "sport", route: "/fitness/sports" },
      { id: "vitals", label: "Vitals", privacy: "private", realm: "vitals", route: "/health" },
      { id: "medication", label: "Medication", privacy: "private", realm: "medication", route: "/medication" },
    ],
  },
  {
    id: "food",
    title: "Food & Nutrition",
    tools: [
      { id: "meal-plans", label: "Meal plans", privacy: "private", realm: "nutrition", route: "/food" },
      { id: "scanner", label: "Food scanner", privacy: "private", realm: "nutrition", route: "/scan" },
      { id: "allergies", label: "Allergies", privacy: "private", realm: "doctorWarning", route: "/health" },
      { id: "lunches", label: "Child lunches", privacy: "circle", realm: "kids", route: "/family" },
    ],
  },
  {
    id: "mind",
    title: "Mind & Lifestyle",
    tools: [
      { id: "mood", label: "Mood", privacy: "private", realm: "mentalHealth", route: "/mental-health" },
      { id: "stress", label: "Stress", privacy: "private", realm: "mentalHealth", route: "/mental-health" },
      { id: "journaling", label: "Journaling", locked: true, privacy: "private", realm: "mentalHealth", route: "/health" },
      { id: "articles", label: "Articles", privacy: "private", realm: "records", route: "/profile/settings/articles-sources" },
    ],
  },
  {
    id: "women",
    title: "Women's Health",
    tools: [
      { id: "period", label: "Period", privacy: "private", realm: "period", route: "/cycle" },
      { id: "ovulation", label: "Ovulation", privacy: "private", realm: "ovulation", route: "/cycle" },
      { id: "pregnancy", label: "Pregnancy", privacy: "private", realm: "pregnancy", route: "/pregnancy" },
      { id: "contraception", label: "Contraception notes", privacy: "private", realm: "period", route: "/cycle" },
    ],
  },
  {
    id: "baby",
    title: "Baby & Kids",
    tools: [
      { id: "feeding", label: "Feeding", privacy: "private", realm: "baby", route: "/baby-child" },
      { id: "growth", label: "Growth", privacy: "private", realm: "kids", route: "/baby-child" },
      { id: "milestones", label: "Milestones", privacy: "private", realm: "baby", route: "/baby-child" },
      { id: "school", label: "School notes", privacy: "circle", realm: "school", route: "/family" },
    ],
  },
  {
    id: "care",
    title: "Family & Care",
    tools: [
      { id: "caregiver", label: "Caregiver", privacy: "circle", realm: "caregiver", route: "/family" },
      { id: "emergency", label: "Emergency", privacy: "private", realm: "emergency", route: "/emergency" },
      { id: "tasks", label: "Shared tasks", privacy: "circle", realm: "familyHealth", route: "/family" },
      { id: "permissions", label: "Permissions", privacy: "private", realm: "records", route: "/profile/settings/privacy" },
    ],
  },
  {
    id: "records",
    title: "Records",
    tools: [
      { id: "documents", label: "Documents", privacy: "private", realm: "documents", route: "/records" },
      { id: "test-results", label: "Test results", privacy: "private", realm: "records", route: "/records" },
      { id: "vaccinations", label: "Vaccinations", privacy: "private", realm: "kids", route: "/records" },
      { id: "exports", label: "Exports", locked: true, privacy: "private", realm: "records", route: "/reports" },
    ],
  },
];

export const realmArticles: RealmArticleCard[] = [
  {
    id: "article-activity",
    realm: "fitness",
    source: "World Health Organization",
    summary: "Educational movement guidance. Source metadata and original links are required before production content.",
    title: "Physical activity basics",
  },
  {
    id: "article-food-safety",
    realm: "nutrition",
    source: "Approved public health source",
    summary: "Food safety summaries must include source, country, review date, license, and original link.",
    title: "Food safety at home",
  },
  {
    id: "article-child-health",
    realm: "kids",
    source: "Local health authority",
    summary: "Child health content needs region-aware routing and medical disclaimers.",
    title: "Child health checklist",
  },
];
