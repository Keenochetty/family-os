import AsyncStorage from "@react-native-async-storage/async-storage";

export type WorkoutFocusMode = "guided" | "compact";

const STORAGE_KEY = "fitness.focus.mode.v1";

export async function getWorkoutFocusMode(): Promise<WorkoutFocusMode> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);

  return stored === "compact" ? "compact" : "guided";
}

export async function setWorkoutFocusMode(mode: WorkoutFocusMode): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, mode);
}
