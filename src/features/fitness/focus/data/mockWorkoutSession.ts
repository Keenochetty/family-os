import type { WorkoutSession } from "@/features/fitness/focus/types";
import { fitnessActiveWorkoutExercises, fitnessTodayData } from "@/features/fitness/data/fitnessPlaceholderData";

function repsFromTarget(target: string): number {
  const match = target.match(/\d+/);

  return match ? Number(match[0]) : 10;
}

export function createMockWorkoutSession(sessionId: string): WorkoutSession {
  return {
    accumulatedPausedMs: 0,
    exerciseIndex: 0,
    exercises: fitnessActiveWorkoutExercises.map((exercise) => ({
      cue: exercise.cue,
      id: exercise.id,
      mediaUri: `placeholder://${exercise.id}`,
      name: exercise.name,
      primaryMuscles: exercise.muscleTags.slice(0, 1),
      restSeconds: exercise.restSeconds,
      secondaryMuscles: exercise.muscleTags.slice(1),
      sets: Array.from({ length: exercise.plannedSets }, (_, index) => {
        const completed = index < exercise.loggedSets;
        const plannedReps = repsFromTarget(exercise.target);
        const plannedWeightKg = exercise.id.includes("raise") ? 8 : exercise.id.includes("incline") ? 20 : 40;

        return {
          chosenReps: plannedReps,
          chosenWeightKg: plannedWeightKg,
          completed,
          completedReps: completed ? plannedReps : undefined,
          completedWeightKg: completed ? plannedWeightKg : undefined,
          id: `${exercise.id}-${index + 1}`,
          kind: "planned",
          plannedReps,
          plannedWeightKg,
          rpe: completed ? 7 : undefined,
        };
      }),
    })),
    focusMode: "guided",
    id: sessionId,
    phase: "preparing",
    setIndex: 0,
    startedAt: Date.now(),
    title: fitnessTodayData.workout.title,
  };
}
