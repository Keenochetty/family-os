export type UnitPreferences = {
  weight: "kg" | "lb" | "stone";
  height: "cm" | "ft_in";
  distance: "km" | "mi";
  water: "ml" | "l" | "fl_oz" | "cups";
  temperature: "c" | "f";
  glucose: "mmol_l" | "mg_dl";
  energy: "kcal" | "kj";
  dateFormat: "dd_mm_yyyy" | "mm_dd_yyyy" | "yyyy_mm_dd";
  timeFormat: "12h" | "24h";
};

export type User = {
  id: string;
  email: string;
  phone?: string;
  phoneVerified: boolean;
  displayName: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  animatedAvatarId?: string;
  createdAt: string;
  updatedAt: string;
  accountStatus: "active" | "pending" | "suspended" | "deleted";
};

export type Profile = {
  id: string;
  userId: string;
  region: string;
  countryCode: string;
  language: string;
  aiLanguage: string;
  unitPreferences: UnitPreferences;
  accountType: "personal" | "caregiver" | "enterprise";
  planId: string;
  glassMode: "full" | "reduced" | "off";
  theme: "system" | "light" | "dark";
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  reduceTransparency: boolean;
};
