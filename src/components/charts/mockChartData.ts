import type { ChartPoint, HeartRateZone, HeatmapPoint, RangePoint, TimelinePoint } from "./chartTypes";

export const weeklyWaterData: ChartPoint[] = [
  { id: "mon", label: "M", value: 1600 },
  { id: "tue", label: "T", value: 2100 },
  { id: "wed", label: "W", value: 1900 },
  { id: "thu", label: "T", value: 2300 },
  { id: "fri", label: "F", value: 1700 },
  { id: "sat", label: "S", value: 2000 },
  { id: "sun", label: "S", value: 1800 },
];

export const weightTrendData: ChartPoint[] = [
  { id: "w1", label: "W1", value: 82.4 },
  { id: "w2", label: "W2", value: 82.1 },
  { id: "w3", label: "W3", value: 81.8 },
  { id: "w4", label: "W4", value: 81.9 },
  { id: "w5", label: "W5", value: 81.5 },
];

export const heartRateRangeData: RangePoint[] = [
  { id: "mon", label: "M", low: 58, high: 142, value: 78 },
  { id: "tue", label: "T", low: 60, high: 138, value: 76 },
  { id: "wed", label: "W", low: 57, high: 151, value: 82 },
  { id: "thu", label: "T", low: 59, high: 133, value: 74 },
  { id: "fri", label: "F", low: 61, high: 146, value: 80 },
];

export const moodHeatmapData: HeatmapPoint[] = Array.from({ length: 28 }, (_, index) => ({
  id: `day-${index}`,
  label: `Day ${index + 1}`,
  value: ((index * 7) % 10) / 10,
}));

export const pregnancyTimelineData: TimelinePoint[] = [
  { id: "week-8", label: "8w", title: "Week 8", description: "Early appointment reminder." },
  { id: "week-12", label: "12w", title: "Week 12", description: "Scan and notes placeholder." },
  { id: "week-20", label: "20w", title: "Week 20", description: "Anatomy scan milestone." },
];

export const heartRateZones: HeartRateZone[] = [
  { id: "z1", label: "Easy", minutes: 22, zoneColor: "#34C759" },
  { id: "z2", label: "Moderate", minutes: 14, zoneColor: "#FFB84D" },
  { id: "z3", label: "Hard", minutes: 6, zoneColor: "#EF4444" },
];
