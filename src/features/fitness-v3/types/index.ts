export type FitnessTab = 'today' | 'train' | 'explore' | 'progress';
export type ProgressSection = 'overview' | 'strength' | 'cardio' | 'body' | 'health';
export type ChartRange = '7D' | '4W' | '3M' | '1Y';
export type FitnessRealmDataState = 'loading' | 'empty' | 'partial' | 'normal' | 'offline' | 'error';

export type TrendPoint = {
  id: string;
  label: string;
  value?: number;
};

export type WorkoutItem = {
  id: string;
  title: string;
  dateLabel: string;
  durationMin: number;
  status: 'planned' | 'complete' | 'rest' | 'moved';
  muscleIds: string[];
};

export type Programme = {
  id: string;
  title: string;
  subtitle: string;
  weeks: number;
  daysPerWeek: number;
  durationMin: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  imageUri?: string;
};

export type MetricItem = {
  id: string;
  label: string;
  value: string;
  detail?: string;
  tone?: 'accent' | 'teal' | 'green' | 'gold' | 'neutral';
};
