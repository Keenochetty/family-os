import type { RealmColorKey } from "@/theme";

export type ChartPoint = {
  id: string;
  label: string;
  value: number;
};

export type RangePoint = {
  id: string;
  label: string;
  high: number;
  low: number;
  value?: number;
};

export type HeatmapPoint = {
  id: string;
  label: string;
  value: number;
};

export type TimelinePoint = {
  id: string;
  label: string;
  title: string;
  description?: string;
};

export type HeartRateZone = {
  id: string;
  label: string;
  minutes: number;
  zoneColor?: string;
};

export type ChartBaseProps = {
  accessibilityLabel?: string;
  dataSource?: string;
  emptyMessage?: string;
  loading?: boolean;
  onLongPressPoint?: (pointId: string) => void;
  realm?: RealmColorKey;
  timeRange?: string;
  title: string;
  unit?: string;
};
