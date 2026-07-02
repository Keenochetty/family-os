import type { RealmColorKey } from "@/theme";

export type Article = {
  id: string;
  keyTakeaways: string[];
  language: string;
  originalUrl: string;
  region: string;
  relatedActions: string[];
  realm: RealmColorKey;
  source: string;
  sourceType: "public health" | "clinical" | "local authority" | "editorial review";
  summary: string;
  title: string;
  topic: string;
};

export type SourcePreference = {
  description: string;
  id: string;
  label: string;
  trusted: boolean;
};

export const articles: Article[] = [
  {
    id: "article-activity",
    keyTakeaways: ["Start with sustainable movement.", "Match intensity to your current health context.", "Ask a clinician before major changes if you have medical concerns."],
    language: "English",
    originalUrl: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
    region: "Global",
    relatedActions: ["Create fitness reminder", "Ask AI for a private summary", "Save to Health"],
    realm: "fitness",
    source: "World Health Organization",
    sourceType: "public health",
    summary: "A short educational summary about physical activity principles, routed by source metadata and region.",
    title: "Physical activity basics",
    topic: "Fitness",
  },
  {
    id: "article-food-safety",
    keyTakeaways: ["Separate raw and ready-to-eat foods.", "Use safe storage temperatures.", "Check local public health advice for regional risks."],
    language: "English",
    originalUrl: "https://www.who.int/health-topics/food-safety",
    region: "Global",
    relatedActions: ["Create grocery note", "Open food scanner", "Save private checklist"],
    realm: "nutrition",
    source: "Approved public health source",
    sourceType: "editorial review",
    summary: "Food safety guidance preview with source label, region, language, and original link required before full routing.",
    title: "Food safety at home",
    topic: "Nutrition",
  },
  {
    id: "article-child-health",
    keyTakeaways: ["Use age-appropriate checklists.", "Keep school and caregiver sharing permission-based.", "Follow local emergency and clinic guidance."],
    language: "English",
    originalUrl: "https://www.health.gov.za/",
    region: "South Africa",
    relatedActions: ["Review child profile", "Create family task", "Open privacy review"],
    realm: "kids",
    source: "Local health authority",
    sourceType: "local authority",
    summary: "Child health checklist preview that must respect region, language, and family permission scope.",
    title: "Child health checklist",
    topic: "Baby & Kids",
  },
];

export const featuredArticle = articles[0];

export const trustedSources: SourcePreference[] = [
  { description: "Global public health guidance with original source links.", id: "who", label: "World Health Organization", trusted: true },
  { description: "Local South African health authority routing for region-specific content.", id: "health-za", label: "South African health sources", trusted: true },
  { description: "Reviewed app summaries that still require a source label and source link.", id: "reviewed", label: "Editorially reviewed summaries", trusted: true },
];

export const hiddenSources: SourcePreference[] = [
  { description: "Hidden until reviewed by the user.", id: "unverified-blogs", label: "Unverified wellness blogs", trusted: false },
  { description: "Hidden when no publication date, source owner, or original link is available.", id: "missing-meta", label: "Missing metadata", trusted: false },
];

export const sourceRoutingRules = [
  "Prefer country: South Africa",
  "Prefer language: English",
  "Show original source link on every article.",
  "Do not show full copied articles inside the app.",
  "Respect region and language before global fallback.",
];
