export type ArticleSourceType =
  | "WHO_HEALTH_TOPIC"
  | "WHO_FACT_SHEET"
  | "WHO_GUIDELINE"
  | "WHO_PUBLICATION"
  | "GOV_HEALTH"
  | "PEER_REVIEWED"
  | "OTHER_APPROVED";

export type ArticleSource = {
  id: string;
  name: string;
  countryCode?: string;
  region?: string;
  language: string;
  url: string;
  type?: ArticleSourceType;
};

export type HealthArticle = {
  id: string;
  realm?: string;
  title: string;
  summary: string;
  keyTakeaways?: string[];
  source: ArticleSource;
  sourceName?: string;
  sourceUrl?: string;
  sourceType?: ArticleSourceType;
  realmKey: string;
  publishedAt?: string;
  updatedAt?: string;
  retrievedAt?: string;
  reviewedAt: string;
  readingTimeMinutes?: number;
  imageUrl?: string;
  imageCredit?: string;
  imageLicense?: string;
  originalUrl: string;
  disclaimer: string;
  medicalDisclaimerRequired?: boolean;
  tags?: string[];
};
