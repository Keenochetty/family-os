import AsyncStorage from "@react-native-async-storage/async-storage";

import type { EffortFeedback, WorkoutSession } from "@/features/fitness/focus/types";

const STORAGE_KEY = "fitness.session.history.v1";
const MAX_HISTORY_ITEMS = 8;

export type WorkoutSessionHistoryItem = {
  completedAt: number;
  completedSets: number;
  durationSeconds: number;
  exerciseCount: number;
  feedback?: EffortFeedback;
  hadPain: boolean;
  plannedSets: number;
  sessionId: string;
  title: string;
};

export type WorkoutSessionHistorySummary = {
  latest?: WorkoutSessionHistoryItem;
  recent: WorkoutSessionHistoryItem[];
  completedThisWeek: number;
  totalCompletedSets: number;
  totalDurationSeconds: number;
};

function parseHistory(value: string | null): WorkoutSessionHistoryItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is WorkoutSessionHistoryItem => {
      return (
        item &&
        typeof item.completedAt === "number" &&
        typeof item.completedSets === "number" &&
        typeof item.durationSeconds === "number" &&
        typeof item.exerciseCount === "number" &&
        typeof item.hadPain === "boolean" &&
        typeof item.plannedSets === "number" &&
        typeof item.sessionId === "string" &&
        typeof item.title === "string"
      );
    });
  } catch {
    return [];
  }
}

function startOfLocalWeek(timestamp: number): number {
  const date = new Date(timestamp);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + diffToMonday);
  date.setHours(0, 0, 0, 0);

  return date.getTime();
}

export function createSessionHistoryItem({
  durationSeconds,
  session,
}: {
  durationSeconds: number;
  session: WorkoutSession;
}): WorkoutSessionHistoryItem {
  const sets = session.exercises.flatMap((exercise) => exercise.sets);

  return {
    completedAt: Date.now(),
    completedSets: sets.filter((set) => set.completed).length,
    durationSeconds,
    exerciseCount: session.exercises.length,
    feedback: session.feedback,
    hadPain: session.feedback === "pain" || session.phase === "pain-reported",
    plannedSets: sets.filter((set) => set.kind === "planned").length,
    sessionId: session.id,
    title: session.title,
  };
}

export async function readWorkoutSessionHistory(): Promise<WorkoutSessionHistorySummary> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const recent = parseHistory(raw).sort((a, b) => b.completedAt - a.completedAt);
  const weekStart = startOfLocalWeek(Date.now());

  return {
    completedThisWeek: recent.filter((item) => item.completedAt >= weekStart && !item.hadPain).length,
    latest: recent[0],
    recent,
    totalCompletedSets: recent.reduce((total, item) => total + item.completedSets, 0),
    totalDurationSeconds: recent.reduce((total, item) => total + item.durationSeconds, 0),
  };
}

export async function saveWorkoutSessionHistoryItem(item: WorkoutSessionHistoryItem): Promise<void> {
  const current = await readWorkoutSessionHistory();
  const next = [item, ...current.recent.filter((existing) => existing.sessionId !== item.sessionId)].slice(0, MAX_HISTORY_ITEMS);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
