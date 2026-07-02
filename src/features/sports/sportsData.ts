import type { ChartPoint, HeartRateZone } from "@/components/charts";
import { brandColors, statusColors } from "@/theme";

export type SportType =
  | "Soccer"
  | "Padel"
  | "Running"
  | "Cycling"
  | "Walking"
  | "Gym"
  | "Swimming"
  | "Hiking"
  | "Basketball"
  | "Tennis"
  | "Cricket"
  | "Rugby"
  | "Netball"
  | "Yoga"
  | "Pilates"
  | "Custom";

export type SportMetric = {
  label: string;
  value: string;
};

export type SportActivity = {
  id: string;
  importedFrom?: string;
  metrics: SportMetric[];
  sport: SportType;
  status: "planned" | "imported" | "needs_label" | "completed";
  title: string;
};

export const sportTypes: SportType[] = [
  "Soccer",
  "Padel",
  "Running",
  "Cycling",
  "Walking",
  "Gym",
  "Swimming",
  "Hiking",
  "Basketball",
  "Tennis",
  "Cricket",
  "Rugby",
  "Netball",
  "Yoga",
  "Pilates",
  "Custom",
];

export const plannedSportDay = {
  date: "Saturday",
  invitees: ["Partner", "Liam", "Caregiver"],
  privacy: "Circle",
  sport: "Soccer" as SportType,
  title: "Plan sport day",
};

export const sportActivities: SportActivity[] = [
  {
    id: "sport-running",
    importedFrom: "Garmin Forerunner",
    metrics: [
      { label: "Duration", value: "42 min" },
      { label: "Distance", value: "6.8 km" },
      { label: "Pace", value: "6:10 /km" },
      { label: "Energy", value: "420 kcal" },
    ],
    sport: "Running",
    status: "completed",
    title: "Morning run",
  },
  {
    id: "sport-unknown-watch",
    importedFrom: "Apple Watch",
    metrics: [
      { label: "Duration", value: "38 min" },
      { label: "Heart rate", value: "132 avg" },
      { label: "Steps", value: "4,180" },
      { label: "Effort", value: "Moderate" },
    ],
    sport: "Custom",
    status: "needs_label",
    title: "Unknown workout",
  },
  {
    id: "sport-soccer",
    metrics: [
      { label: "Duration", value: "60 min" },
      { label: "Hydration", value: "500 ml planned" },
      { label: "Climate", value: "Warm placeholder" },
      { label: "Injury notes", value: "None added" },
    ],
    sport: "Soccer",
    status: "planned",
    title: "Saturday soccer",
  },
];

export const sportTrendData: ChartPoint[] = [
  { id: "mon", label: "M", value: 32 },
  { id: "tue", label: "T", value: 45 },
  { id: "wed", label: "W", value: 28 },
  { id: "thu", label: "T", value: 52 },
  { id: "fri", label: "F", value: 38 },
  { id: "sat", label: "S", value: 60 },
  { id: "sun", label: "S", value: 35 },
];

export const sportDistanceData: ChartPoint[] = [
  { id: "w1", label: "W1", value: 14 },
  { id: "w2", label: "W2", value: 18 },
  { id: "w3", label: "W3", value: 12 },
  { id: "w4", label: "W4", value: 21 },
];

export const sportHeartRateZones: HeartRateZone[] = [
  { id: "z1", label: "Easy", minutes: 18, zoneColor: statusColors.normal },
  { id: "z2", label: "Steady", minutes: 16, zoneColor: brandColors.info },
  { id: "z3", label: "Hard", minutes: 8, zoneColor: statusColors.high },
  { id: "z4", label: "Peak", minutes: 3, zoneColor: statusColors.urgent },
];

export const sportSafetyNotes = [
  "Insights are trend-based and educational, not medical advice.",
  "Perceived effort and injury notes are private by default.",
  "Imported workouts should be labeled before adding to weekly goals.",
  "Route, climate, and hydration placeholders require consent before sync.",
];
