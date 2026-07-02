import type { UnitPreferences } from "./user";

export type RegionalHealthProfile = {
  countryCode: string;
  regionName: string;
  whoRegion: "AFRO" | "AMRO" | "EMRO" | "EURO" | "SEARO" | "WPRO";
  primaryHealthAuthority?: string;
  emergencyNumber?: string;
};

export type UserLocalizationPreferences = {
  countryCode: string;
  language: string;
  aiLanguage: string;
  units: UnitPreferences;
};
