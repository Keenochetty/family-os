import { realmColors, type RealmColorKey } from "@/theme";

export function chartAccent(realm: RealmColorKey = "vitals"): string {
  return realmColors[realm];
}

export function normalize(value: number, min: number, max: number): number {
  if (max === min) {
    return 0.5;
  }

  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export function extent(values: number[]): { max: number; min: number } {
  if (values.length === 0) {
    return { max: 1, min: 0 };
  }

  return { max: Math.max(...values), min: Math.min(...values) };
}
