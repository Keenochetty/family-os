import type { MetricItem, Programme, TrendPoint, WorkoutItem } from '../types';

export const weekDays = [
  { day: 'M', date: 24, state: 'complete' as const },
  { day: 'T', date: 25, state: 'complete' as const },
  { day: 'W', date: 26, state: 'selected' as const },
  { day: 'T', date: 27, state: 'planned' as const },
  { day: 'F', date: 28, state: 'planned' as const },
  { day: 'S', date: 29, state: 'rest' as const },
  { day: 'S', date: 30, state: 'planned' as const },
];

export const todayMetrics: MetricItem[] = [
  { id: 'steps', label: 'Steps', value: '8,432', detail: '78% goal', tone: 'teal' },
  { id: 'calories', label: 'Active kcal', value: '1,872', detail: 'Today', tone: 'accent' },
  { id: 'protein', label: 'Protein', value: '128g', detail: '82% target', tone: 'green' },
  { id: 'hydration', label: 'Hydration', value: '70%', detail: '1.6 L', tone: 'teal' },
];

export const upcomingWorkouts: WorkoutItem[] = [
  { id: 'upper', title: 'Upper Push', dateLabel: 'Today', durationMin: 45, status: 'planned', muscleIds: ['chest', 'shoulders', 'triceps'] },
  { id: 'lower', title: 'Lower Body', dateLabel: 'Thu', durationMin: 50, status: 'planned', muscleIds: ['quads', 'glutes', 'hamstrings'] },
  { id: 'pull', title: 'Pull + Core', dateLabel: 'Sat', durationMin: 45, status: 'planned', muscleIds: ['back', 'biceps', 'core'] },
  { id: 'full', title: 'Full Body', dateLabel: 'Sun', durationMin: 40, status: 'planned', muscleIds: ['full-body'] },
];

export const recommendedProgrammes: Programme[] = [
  {
    id: 'dumbbell-strength',
    title: 'Dumbbell Strength',
    subtitle: 'Build full-body strength with simple equipment',
    weeks: 4,
    daysPerWeek: 3,
    durationMin: 35,
    level: 'Beginner',
  },
  {
    id: 'fat-loss',
    title: 'Fat Loss Accelerator',
    subtitle: 'Strength and conditioning for sustainable progress',
    weeks: 4,
    daysPerWeek: 4,
    durationMin: 30,
    level: 'Intermediate',
  },
];

export const progressMetrics: MetricItem[] = [
  { id: 'workouts', label: 'Workouts', value: '18', detail: 'This month', tone: 'neutral' },
  { id: 'consistency', label: 'Consistency', value: '86%', detail: 'Great', tone: 'green' },
  { id: 'volume', label: 'Total volume', value: '24,380 kg', detail: '+12% vs last month', tone: 'accent' },
  { id: 'minutes', label: 'Active minutes', value: '742', detail: '+18% vs last month', tone: 'teal' },
];

export const volume4W: TrendPoint[] = [
  { id: 'w1', label: 'Jun 1', value: 4100 },
  { id: 'w2', label: 'Jun 8', value: 5350 },
  { id: 'w3', label: 'Jun 15', value: 6940 },
  { id: 'w4', label: 'Jun 22', value: 7990 },
];

export const volume7D: TrendPoint[] = [
  { id: 'd1', label: 'Mon', value: 850 },
  { id: 'd2', label: 'Tue', value: 0 },
  { id: 'd3', label: 'Wed', value: 1350 },
  { id: 'd4', label: 'Thu', value: 980 },
  { id: 'd5', label: 'Fri' },
  { id: 'd6', label: 'Sat', value: 1640 },
  { id: 'd7', label: 'Sun', value: 1240 },
];

export const volume3M: TrendPoint[] = [
  { id: 'm1', label: 'Apr', value: 14800 },
  { id: 'm2', label: 'May', value: 19500 },
  { id: 'm3', label: 'Jun', value: 24380 },
];

export const volume1Y: TrendPoint[] = [
  { id: 'q1', label: 'Q3', value: 49800 },
  { id: 'q2', label: 'Q4', value: 61500 },
  { id: 'q3', label: 'Q1', value: 72400 },
  { id: 'q4', label: 'Q2', value: 81700 },
];
