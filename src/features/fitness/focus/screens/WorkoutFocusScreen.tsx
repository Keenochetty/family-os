import { useCallback, useEffect, useMemo, useRef, useState, type JSX, type PropsWithChildren } from "react";
import { BackHandler, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Speech from "expo-speech";
import Animated, { LinearTransition, useReducedMotion } from "react-native-reanimated";

import { DualProgressRing } from "@/features/fitness/focus/components/DualProgressRing";
import { createMockWorkoutSession } from "@/features/fitness/focus/data/mockWorkoutSession";
import { readFocusMode, writeFocusMode } from "@/features/fitness/focus/hooks/focusModePreference";
import { createSessionHistoryItem, saveWorkoutSessionHistoryItem } from "@/features/fitness/focus/sessionHistory";
import type { EffortFeedback, FeelingState, FocusMode, SetKind, WorkoutPhase, WorkoutSession, WorkoutSet } from "@/features/fitness/focus/types";
import { fitnessFocusMotion, fitnessFocusRadius, fitnessFocusSpacing, getFitnessFocusTheme, type FitnessFocusTheme } from "@/features/fitness/focus/theme/fitnessFocusTheme";
import { startWorkoutLiveActivity } from "@/features/fitness/live/workoutLiveActivity";
import type { FitnessLiveActivityState, FitnessWorkoutActivityHandle } from "@/features/fitness/live/workoutActivityTypes";
import { useAppTheme } from "@/lib/theme";

type WorkoutFocusScreenProps = {
  sessionId: string;
};

type ActiveSheet = "quick" | "heavier" | "afterLastSet" | "addSet" | "completion" | "effort" | "exit" | null;

const feelingOptions: { id: FeelingState; label: string }[] = [
  { id: "strong", label: "Strong" },
  { id: "expected", label: "Expected" },
  { id: "low-energy", label: "Low energy" },
  { id: "sore", label: "Sore" },
];

const effortOptions: { id: EffortFeedback; label: string }[] = [
  { id: "too-easy", label: "Too easy" },
  { id: "good", label: "Good" },
  { id: "too-hard", label: "Too hard" },
  { id: "pain", label: "Pain / discomfort" },
];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(Math.max(0, totalSeconds) / 60);
  const seconds = Math.max(0, totalSeconds) % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function nextIncompleteSetIndex(sets: WorkoutSet[]): number {
  const index = sets.findIndex((set) => !set.completed);

  return index >= 0 ? index : Math.max(0, sets.length - 1);
}

function setLabel(set: WorkoutSet): string {
  return `${set.chosenWeightKg ?? set.plannedWeightKg ?? "-"} kg x ${set.chosenReps ?? set.plannedReps ?? "-"} reps`;
}

export function WorkoutFocusScreen({ sessionId }: WorkoutFocusScreenProps): JSX.Element {
  const router = useRouter();
  const { isDark, theme: appTheme } = useAppTheme();
  const theme = useMemo(() => getFitnessFocusTheme(isDark, appTheme), [appTheme, isDark]);
  const reduceMotion = useReducedMotion();
  const [session, setSession] = useState<WorkoutSession>(() => createMockWorkoutSession(sessionId));
  const [modeReady, setModeReady] = useState(false);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [timerNowMs, setTimerNowMs] = useState(() => Date.now());
  const [elapsedBaseMs, setElapsedBaseMs] = useState(0);
  const liveActivityRef = useRef<FitnessWorkoutActivityHandle | null>(null);
  const exercise = session.exercises[session.exerciseIndex] ?? session.exercises[0];
  const currentSet = exercise.sets[session.setIndex] ?? exercise.sets[0];
  const isComplete = session.phase === "workout-complete";
  const isPaused = session.phase === "paused";
  const isResting = session.phase === "resting";
  const plannedSetCount = useMemo(() => session.exercises.reduce((total, item) => total + item.sets.filter((set) => set.kind === "planned").length, 0), [session.exercises]);
  const completedPlannedSetCount = useMemo(
    () => session.exercises.reduce((total, item) => total + item.sets.filter((set) => set.kind === "planned" && set.completed).length, 0),
    [session.exercises],
  );
  const completedSetCount = useMemo(() => session.exercises.reduce((total, item) => total + item.sets.filter((set) => set.completed).length, 0), [session.exercises]);
  const totalSetCount = useMemo(() => session.exercises.reduce((total, item) => total + item.sets.length, 0), [session.exercises]);
  const restSecondsLeft =
    session.restStartedAt && session.restDurationSeconds && isResting
      ? Math.max(0, session.restDurationSeconds - Math.floor((timerNowMs - session.restStartedAt) / 1000))
      : 0;
  const elapsedSeconds = Math.max(0, Math.floor((timerNowMs - session.startedAt - session.accumulatedPausedMs + elapsedBaseMs) / 1000));
  const workoutProgress = plannedSetCount > 0 ? Math.min(1, completedPlannedSetCount / plannedSetCount) : 0;
  const phaseProgress = isResting && session.restDurationSeconds ? 1 - restSecondsLeft / session.restDurationSeconds : exercise.sets.length > 0 ? exercise.sets.filter((set) => set.completed).length / exercise.sets.length : 0;

  const closeWorkout = useCallback(() => {
    liveActivityRef.current?.end(toActivityState(session, elapsedSeconds, restSecondsLeft, "complete")).catch(() => undefined);
    liveActivityRef.current = null;
    deactivateKeepAwake("active-workout").catch(() => undefined);
    router.back();
  }, [elapsedSeconds, restSecondsLeft, router, session]);

  useEffect(() => {
    let active = true;

    readFocusMode()
      .then((focusMode) => {
        if (active) {
          setSession((current) => ({ ...current, focusMode }));
        }
      })
      .finally(() => {
        if (active) {
          setModeReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isComplete) {
      deactivateKeepAwake("active-workout").catch(() => undefined);
      return undefined;
    }

    activateKeepAwakeAsync("active-workout").catch(() => undefined);

    return () => {
      deactivateKeepAwake("active-workout").catch(() => undefined);
    };
  }, [isComplete]);

  useEffect(() => {
    if (isPaused || isComplete) {
      return undefined;
    }

    const interval = setInterval(() => setTimerNowMs(Date.now()), 500);

    return () => clearInterval(interval);
  }, [isComplete, isPaused]);

  useEffect(() => {
    if (!isResting || restSecondsLeft > 0) {
      return;
    }

    const timeout = setTimeout(() => {
      setSession((current) => ({ ...current, phase: "active-set", restDurationSeconds: undefined, restStartedAt: undefined }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    }, 0);

    return () => clearTimeout(timeout);
  }, [isResting, restSecondsLeft]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!isComplete) {
        setActiveSheet("exit");
        return true;
      }

      return false;
    });

    return () => subscription.remove();
  }, [isComplete]);

  useEffect(() => {
    let mounted = true;
    const state = toActivityState(session, elapsedSeconds, restSecondsLeft);

    startWorkoutLiveActivity(state)
      .then((activity) => {
        if (mounted) {
          liveActivityRef.current = activity;
        }
      })
      .catch(() => {
        if (mounted) {
          liveActivityRef.current = null;
        }
      });

    return () => {
      mounted = false;
      liveActivityRef.current?.end({ ...state, phase: "complete" }).catch(() => undefined);
      liveActivityRef.current = null;
    };
    // Start once per routed session; subsequent state changes are updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.id]);

  useEffect(() => {
    liveActivityRef.current?.update(toActivityState(session, elapsedSeconds, restSecondsLeft)).catch(() => undefined);
  }, [elapsedSeconds, restSecondsLeft, session]);

  function setFocusMode(mode: FocusMode): void {
    setSession((current) => ({ ...current, focusMode: mode }));
    writeFocusMode(mode).catch(() => undefined);
  }

  function updateCurrentSet(updater: (set: WorkoutSet) => WorkoutSet): void {
    setSession((current) => ({
      ...current,
      exercises: current.exercises.map((item, exerciseIndex) =>
        exerciseIndex === current.exerciseIndex
          ? {
              ...item,
              sets: item.sets.map((set, setIndex) => (setIndex === current.setIndex ? updater(set) : set)),
            }
          : item,
      ),
    }));
  }

  function adjustWeight(delta: number): void {
    updateCurrentSet((set) => ({ ...set, chosenWeightKg: clamp((set.chosenWeightKg ?? set.plannedWeightKg ?? 0) + delta, 0, 500) }));
  }

  function adjustReps(delta: number): void {
    updateCurrentSet((set) => ({ ...set, chosenReps: clamp((set.chosenReps ?? set.plannedReps ?? 0) + delta, 1, 100) }));
  }

  function addSet(kind: SetKind): void {
    const baseSet = currentSet;

    setSession((current) => ({
      ...current,
      phase: "active-set",
      setIndex: exercise.sets.length,
      exercises: current.exercises.map((item, exerciseIndex) =>
        exerciseIndex === current.exerciseIndex
          ? {
              ...item,
              sets: [
                ...item.sets,
                {
                  chosenReps: baseSet.chosenReps ?? baseSet.plannedReps,
                  chosenWeightKg: kind === "progression" ? (baseSet.chosenWeightKg ?? baseSet.plannedWeightKg ?? 0) + 2.5 : baseSet.chosenWeightKg ?? baseSet.plannedWeightKg,
                  completed: false,
                  id: `${item.id}-${kind}-${item.sets.length + 1}`,
                  kind,
                  plannedReps: baseSet.plannedReps,
                  plannedWeightKg: baseSet.plannedWeightKg,
                },
              ],
            }
          : item,
      ),
    }));
    setActiveSheet(null);
  }

  function moveToNextExercise(): void {
    setSession((current) => {
      const nextExerciseIndex = Math.min(current.exerciseIndex + 1, current.exercises.length - 1);
      const nextExercise = current.exercises[nextExerciseIndex];
      const complete = current.exerciseIndex >= current.exercises.length - 1;

      return {
        ...current,
        exerciseIndex: complete ? current.exerciseIndex : nextExerciseIndex,
        phase: complete ? "workout-complete" : "active-set",
        restDurationSeconds: undefined,
        restStartedAt: undefined,
        setIndex: complete ? current.setIndex : nextIncompleteSetIndex(nextExercise.sets),
      };
    });
    setActiveSheet(null);
  }

  function logSet(): void {
    if (isComplete || isPaused || !currentSet || currentSet.completed) {
      return;
    }

    const exerciseCompleteAfterLog = exercise.sets.filter((set, index) => set.completed || index === session.setIndex).length >= exercise.sets.length;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);

    setSession((current) => ({
      ...current,
      phase: exerciseCompleteAfterLog ? "exercise-complete" : "resting",
      restDurationSeconds: exerciseCompleteAfterLog ? undefined : exercise.restSeconds,
      restStartedAt: exerciseCompleteAfterLog ? undefined : Date.now(),
      exercises: current.exercises.map((item, exerciseIndex) =>
        exerciseIndex === current.exerciseIndex
          ? {
              ...item,
              sets: item.sets.map((set, setIndex) =>
                setIndex === current.setIndex
                  ? {
                      ...set,
                      completed: true,
                      completedReps: set.chosenReps ?? set.plannedReps,
                      completedWeightKg: set.chosenWeightKg ?? set.plannedWeightKg,
                    }
                  : set,
              ),
            }
          : item,
      ),
      setIndex: exerciseCompleteAfterLog ? current.setIndex : Math.min(current.setIndex + 1, exercise.sets.length - 1),
    }));

    if (exerciseCompleteAfterLog) {
      setActiveSheet("afterLastSet");
    }
  }

  function togglePause(): void {
    setSession((current) => {
      if (current.phase === "workout-complete") {
        return current;
      }

      if (current.phase === "paused") {
        setElapsedBaseMs((value) => value + Date.now() - timerNowMs);
        return { ...current, phase: current.restStartedAt ? "resting" : "active-set" };
      }

      return { ...current, phase: "paused" };
    });
    Haptics.selectionAsync().catch(() => undefined);
  }

  function finishWorkout(): void {
    setSession((current) => {
      const next: WorkoutSession = { ...current, phase: "workout-complete" };

      saveWorkoutSessionHistoryItem(createSessionHistoryItem({ durationSeconds: elapsedSeconds, session: next })).catch(() => undefined);

      return next;
    });
    setActiveSheet("completion");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    Speech.speak("Workout complete");
  }

  function setFeedback(feedback: EffortFeedback): void {
    setSession((current) => {
      const next: WorkoutSession = { ...current, feedback, phase: feedback === "pain" ? "pain-reported" : current.phase };

      saveWorkoutSessionHistoryItem(createSessionHistoryItem({ durationSeconds: elapsedSeconds, session: next })).catch(() => undefined);

      return next;
    });
    setActiveSheet(feedback === "pain" ? null : "completion");
  }

  if (!modeReady) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.page }]}>
        <Text style={[styles.bodyText, { color: theme.textMuted }]}>Preparing workout...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.page }]}>
      <WorkoutStatusHeader
        elapsedSeconds={elapsedSeconds}
        isComplete={isComplete}
        isPaused={isPaused}
        onClose={() => setActiveSheet(isComplete ? null : "exit")}
        onFinish={finishWorkout}
        onPause={togglePause}
        phase={session.phase}
        restSecondsLeft={restSecondsLeft}
        theme={theme}
      />
      <FocusModeTabs mode={session.focusMode} onChange={setFocusMode} theme={theme} />
      <Animated.View layout={reduceMotion ? undefined : LinearTransition.duration(fitnessFocusMotion.mode)} style={styles.modeWrap}>
        {session.focusMode === "guided" ? (
          <GuidedFocusLayout
            adjustReps={adjustReps}
            adjustWeight={adjustWeight}
            currentSet={currentSet}
            exercise={exercise}
            exerciseIndex={session.exerciseIndex}
            exerciseTotal={session.exercises.length}
            feeling={session.feeling}
            onAdjust={() => setActiveSheet("quick")}
            onFeeling={(feeling) => setSession((current) => ({ ...current, feeling }))}
            onLogSet={logSet}
            onNext={moveToNextExercise}
            onPrevious={() => setSession((current) => ({ ...current, exerciseIndex: Math.max(0, current.exerciseIndex - 1), setIndex: 0 }))}
            theme={theme}
          />
        ) : (
          <CompactFocusLayout
            completedSetCount={completedSetCount}
            currentSet={currentSet}
            exercise={exercise}
            exerciseIndex={session.exerciseIndex}
            exerciseTotal={session.exercises.length}
            feeling={session.feeling}
            onAdjustRest={(delta) => setSession((current) => ({ ...current, restDurationSeconds: Math.max(15, (current.restDurationSeconds ?? exercise.restSeconds) + delta) }))}
            onFeeling={(feeling) => setSession((current) => ({ ...current, feeling }))}
            onLogSet={logSet}
            onQuickAdjust={() => setActiveSheet("quick")}
            onSkipRest={() => setSession((current) => ({ ...current, phase: "active-set", restDurationSeconds: undefined, restStartedAt: undefined }))}
            phase={session.phase}
            phaseProgress={phaseProgress}
            restSecondsLeft={restSecondsLeft}
            theme={theme}
            totalSetCount={totalSetCount}
            workoutProgress={workoutProgress}
          />
        )}
      </Animated.View>

      {session.phase === "pain-reported" ? <PainReviewBanner theme={theme} /> : null}

      <ActionSheet onClose={() => setActiveSheet(null)} theme={theme} title="Adjust workout" visible={activeSheet === "quick"}>
        <SheetButton label="Add another set" onPress={() => setActiveSheet("addSet")} theme={theme} />
        <SheetButton label="Try heavier" onPress={() => setActiveSheet("heavier")} theme={theme} />
        <SheetButton label="Add reps" onPress={() => { adjustReps(1); setActiveSheet(null); }} theme={theme} />
        <SheetButton label="Back-off set" onPress={() => addSet("back-off")} theme={theme} />
        <SheetButton label="Replace exercise" onPress={() => setActiveSheet(null)} theme={theme} />
        <SheetButton label="End exercise" onPress={moveToNextExercise} theme={theme} />
      </ActionSheet>
      <ActionSheet onClose={() => setActiveSheet(null)} theme={theme} title="Try heavier" visible={activeSheet === "heavier"}>
        <Text style={[styles.bodyText, { color: theme.textMuted }]}>Planned: {setLabel(currentSet)}. Small progression adds 2.5 kg and keeps the same rep target.</Text>
        <SheetButton label="Use planned option" onPress={() => setActiveSheet(null)} theme={theme} />
        <SheetButton label="+2.5 kg progression" onPress={() => { adjustWeight(2.5); setActiveSheet(null); }} theme={theme} />
        <SheetButton label="Custom weight +5 kg" onPress={() => { adjustWeight(5); setActiveSheet(null); }} theme={theme} />
      </ActionSheet>
      <ActionSheet onClose={() => setActiveSheet(null)} theme={theme} title="Exercise complete" visible={activeSheet === "afterLastSet"}>
        <SheetButton label="Next exercise" onPress={moveToNextExercise} primary theme={theme} />
        <SheetButton label="Add another set" onPress={() => setActiveSheet("addSet")} theme={theme} />
        <SheetButton label="Try heavier set" onPress={() => addSet("progression")} theme={theme} />
        <SheetButton label="Add back-off set" onPress={() => addSet("back-off")} theme={theme} />
        <SheetButton label="Finish workout" onPress={finishWorkout} theme={theme} />
      </ActionSheet>
      <ActionSheet onClose={() => setActiveSheet(null)} theme={theme} title="Add set" visible={activeSheet === "addSet"}>
        <SheetButton label="Repeat last set" onPress={() => addSet("repeat")} theme={theme} />
        <SheetButton label="Progression set" onPress={() => addSet("progression")} theme={theme} />
        <SheetButton label="Back-off set" onPress={() => addSet("back-off")} theme={theme} />
        <SheetButton label="Custom set" onPress={() => addSet("custom")} theme={theme} />
      </ActionSheet>
      <ActionSheet onClose={() => setActiveSheet(null)} theme={theme} title="Workout complete" visible={activeSheet === "completion"}>
        <WorkoutCompletionCard completedSets={completedSetCount} elapsedSeconds={elapsedSeconds} exerciseCount={session.exercises.length} theme={theme} />
        <SheetButton label="Effort feedback" onPress={() => setActiveSheet("effort")} theme={theme} />
        <SheetButton label="Done" onPress={closeWorkout} primary theme={theme} />
      </ActionSheet>
      <ActionSheet onClose={() => setActiveSheet(null)} theme={theme} title="How did it feel?" visible={activeSheet === "effort"}>
        {effortOptions.map((option) => (
          <SheetButton key={option.id} label={option.label} onPress={() => setFeedback(option.id)} theme={theme} tone={option.id === "pain" ? "danger" : "normal"} />
        ))}
      </ActionSheet>
      <ActionSheet onClose={() => setActiveSheet(null)} theme={theme} title="Leave workout?" visible={activeSheet === "exit"}>
        <Text style={[styles.bodyText, { color: theme.textMuted }]}>Android Back and close require confirmation so an active workout is not discarded accidentally.</Text>
        <SheetButton label="Keep workout open" onPress={() => setActiveSheet(null)} primary theme={theme} />
        <SheetButton label="End and leave" onPress={closeWorkout} theme={theme} tone="danger" />
      </ActionSheet>
    </View>
  );
}

function toActivityState(session: WorkoutSession, elapsedSeconds: number, restSecondsLeft: number, forcedPhase?: FitnessLiveActivityState["phase"]): FitnessLiveActivityState {
  const exercise = session.exercises[session.exerciseIndex] ?? session.exercises[0];
  const setTotal = session.exercises.reduce((total, item) => total + item.sets.filter((set) => set.kind === "planned").length, 0);
  const setIndex = session.exercises.reduce((total, item) => total + item.sets.filter((set) => set.kind === "planned" && set.completed).length, 0);
  const phase =
    forcedPhase ??
    (session.phase === "workout-complete"
      ? "complete"
      : session.phase === "paused"
        ? "paused"
        : session.phase === "resting"
          ? "rest"
          : "work");

  return {
    elapsedSeconds,
    exerciseIndex: session.exerciseIndex,
    exerciseName: exercise.name,
    exerciseTotal: session.exercises.length,
    heartRateFreshness: "unavailable",
    phase,
    remainingSeconds: restSecondsLeft > 0 ? restSecondsLeft : undefined,
    sessionId: session.id,
    setIndex,
    setTotal,
    workoutId: session.id,
    workoutName: session.title,
  };
}

function WorkoutStatusHeader({
  elapsedSeconds,
  isComplete,
  isPaused,
  onClose,
  onFinish,
  onPause,
  phase,
  restSecondsLeft,
  theme,
}: {
  elapsedSeconds: number;
  isComplete: boolean;
  isPaused: boolean;
  onClose: () => void;
  onFinish: () => void;
  onPause: () => void;
  phase: WorkoutPhase;
  restSecondsLeft: number;
  theme: FitnessFocusTheme;
}): JSX.Element {
  return (
    <View style={[styles.statusHeader, { borderColor: theme.line }]}>
      <Pressable accessibilityLabel="Close workout" accessibilityRole="button" onPress={onClose} style={[styles.iconButton, { backgroundColor: theme.surface2 }]}>
        <Text style={[styles.iconText, { color: theme.text }]}>‹</Text>
      </Pressable>
      <View style={styles.headerCopy}>
        <Text style={[styles.timerText, { color: theme.text }]}>{formatDuration(elapsedSeconds)}</Text>
        <Text style={[styles.metaText, { color: theme.textMuted }]}>
          {phase === "resting" ? `Rest ${formatDuration(restSecondsLeft)}` : phase === "pain-reported" ? "Pain review" : "Heart rate optional"}
        </Text>
      </View>
      <Pressable accessibilityRole="button" onPress={isComplete ? onFinish : onPause} style={[styles.pauseButton, { backgroundColor: isPaused ? theme.rest : theme.surface2, borderColor: theme.line }]}>
        <Text style={[styles.buttonLabel, { color: isPaused ? "#FFFFFF" : theme.text }]}>{isPaused ? "Resume" : isComplete ? "Done" : "Pause"}</Text>
      </Pressable>
    </View>
  );
}

function FocusModeTabs({ mode, onChange, theme }: { mode: FocusMode; onChange: (mode: FocusMode) => void; theme: FitnessFocusTheme }): JSX.Element {
  return (
    <View style={[styles.modeTabs, { backgroundColor: theme.surface2, borderColor: theme.line }]}>
      {(["guided", "compact"] as const).map((item) => {
        const active = item === mode;

        return (
          <Pressable key={item} accessibilityRole="button" onPress={() => onChange(item)} style={[styles.modeTab, { backgroundColor: active ? theme.surface1 : "transparent" }]}>
            <Text style={[styles.modeTabText, { color: active ? theme.text : theme.textMuted }]}>{item === "guided" ? "Guided" : "Compact"}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function GuidedFocusLayout({
  adjustReps,
  adjustWeight,
  currentSet,
  exercise,
  exerciseIndex,
  exerciseTotal,
  feeling,
  onAdjust,
  onFeeling,
  onLogSet,
  onNext,
  onPrevious,
  theme,
}: {
  adjustReps: (delta: number) => void;
  adjustWeight: (delta: number) => void;
  currentSet: WorkoutSet;
  exercise: WorkoutSession["exercises"][number];
  exerciseIndex: number;
  exerciseTotal: number;
  feeling?: FeelingState;
  onAdjust: () => void;
  onFeeling: (feeling: FeelingState) => void;
  onLogSet: () => void;
  onNext: () => void;
  onPrevious: () => void;
  theme: FitnessFocusTheme;
}): JSX.Element {
  return (
    <Animated.ScrollView contentContainerStyle={styles.guidedContent} layout={LinearTransition.duration(fitnessFocusMotion.mode)} showsVerticalScrollIndicator={false}>
      <View style={styles.positionRow}>
        <Text style={[styles.metaText, { color: theme.textMuted }]}>Exercise {exerciseIndex + 1} of {exerciseTotal}</Text>
        <Pressable accessibilityRole="button" onPress={onAdjust} style={[styles.secondaryButton, { borderColor: theme.line }]}>
          <Text style={[styles.buttonLabel, { color: theme.text }]}>Adjust</Text>
        </Pressable>
      </View>
      <View style={styles.titleBlock}>
        <Text style={[styles.exerciseTitle, { color: theme.text }]}>{exercise.name}</Text>
        <View style={styles.chipRow}>
          {[...exercise.primaryMuscles, ...exercise.secondaryMuscles].map((muscle, index) => (
            <View key={muscle} style={[styles.chip, { backgroundColor: index === 0 ? theme.accentSoft : theme.surface2, borderColor: index === 0 ? theme.accent : theme.line }]}>
              <Text style={[styles.chipText, { color: index === 0 ? theme.accent : theme.textMuted }]}>{muscle}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={[styles.mediaCard, { backgroundColor: theme.surface2, borderColor: theme.line }]}>
        <View style={[styles.mediaBar, { backgroundColor: theme.accent }]} />
        <View style={[styles.mediaCircle, { backgroundColor: theme.rest }]} />
        <Text style={[styles.mediaText, { color: theme.textMuted }]}>Exercise media placeholder</Text>
      </View>
      <View style={styles.twoColumn}>
        <Surface theme={theme} style={styles.flexSurface}>
          <Text style={[styles.eyebrow, { color: theme.accent }]}>Form cue</Text>
          <Text style={[styles.bodyText, { color: theme.text }]}>{exercise.cue}</Text>
          <Text style={[styles.metaText, { color: theme.textMuted }]}>View all instructions</Text>
        </Surface>
        <Surface theme={theme} style={styles.flexSurface}>
          <Text style={[styles.eyebrow, { color: theme.rest }]}>Muscle map</Text>
          <Text style={[styles.bodyText, { color: theme.textMuted }]}>Placeholder slot for supplied muscle maps.</Text>
        </Surface>
      </View>
      <Surface theme={theme}>
        <View style={styles.targetGrid}>
          <Metric label="Planned" value={`${currentSet.plannedWeightKg ?? "-"} kg`} theme={theme} />
          <Metric label="Chosen" value={`${currentSet.chosenWeightKg ?? "-"} kg`} theme={theme} />
          <Metric label="Reps" value={String(currentSet.chosenReps ?? currentSet.plannedReps ?? "-")} theme={theme} />
          <Metric label="Rest" value={`${exercise.restSeconds}s`} theme={theme} />
        </View>
      </Surface>
      <View style={styles.twoColumn}>
        <SetEditor label="Weight" onMinus={() => adjustWeight(-2.5)} onPlus={() => adjustWeight(2.5)} theme={theme} value={`${currentSet.chosenWeightKg ?? currentSet.plannedWeightKg ?? 0} kg`} />
        <SetEditor label="Reps" onMinus={() => adjustReps(-1)} onPlus={() => adjustReps(1)} theme={theme} value={String(currentSet.chosenReps ?? currentSet.plannedReps ?? 0)} />
      </View>
      <FeelingSelector feeling={feeling} onChange={onFeeling} theme={theme} />
      <View style={styles.actionDock}>
        <Pressable accessibilityRole="button" onPress={onPrevious} style={[styles.dockButton, { borderColor: theme.line }]}>
          <Text style={[styles.buttonLabel, { color: theme.text }]}>Previous</Text>
        </Pressable>
        <Pressable accessibilityRole="button" disabled={currentSet.completed} onPress={onLogSet} style={[styles.primaryDockButton, { backgroundColor: currentSet.completed ? theme.surface3 : theme.accent }]}>
          <Text style={styles.primaryDockText}>{currentSet.completed ? "Set logged" : "Log set"}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onNext} style={[styles.dockButton, { borderColor: theme.line }]}>
          <Text style={[styles.buttonLabel, { color: theme.text }]}>Next</Text>
        </Pressable>
      </View>
    </Animated.ScrollView>
  );
}

function CompactFocusLayout({
  completedSetCount,
  currentSet,
  exercise,
  exerciseIndex,
  exerciseTotal,
  feeling,
  onAdjustRest,
  onFeeling,
  onLogSet,
  onQuickAdjust,
  onSkipRest,
  phase,
  phaseProgress,
  restSecondsLeft,
  theme,
  totalSetCount,
  workoutProgress,
}: {
  completedSetCount: number;
  currentSet: WorkoutSet;
  exercise: WorkoutSession["exercises"][number];
  exerciseIndex: number;
  exerciseTotal: number;
  feeling?: FeelingState;
  onAdjustRest: (delta: number) => void;
  onFeeling: (feeling: FeelingState) => void;
  onLogSet: () => void;
  onQuickAdjust: () => void;
  onSkipRest: () => void;
  phase: WorkoutPhase;
  phaseProgress: number;
  restSecondsLeft: number;
  theme: FitnessFocusTheme;
  totalSetCount: number;
  workoutProgress: number;
}): JSX.Element {
  const resting = phase === "resting";

  return (
    <Animated.ScrollView contentContainerStyle={styles.compactContent} layout={LinearTransition.duration(fitnessFocusMotion.mode)} showsVerticalScrollIndicator={false}>
      <View style={styles.positionRow}>
        <Text style={[styles.metaText, { color: theme.textMuted }]}>Exercise {exerciseIndex + 1} of {exerciseTotal}</Text>
        <View style={[styles.chip, { backgroundColor: theme.surface2, borderColor: theme.line }]}>
          <Text style={[styles.chipText, { color: theme.textMuted }]}>Compact</Text>
        </View>
      </View>
      <Text style={[styles.compactSetCount, { color: theme.textMuted }]}>{completedSetCount} of {totalSetCount} sets</Text>
      <DualProgressRing
        phase={phase}
        phaseProgress={phaseProgress}
        primaryText={resting ? formatDuration(restSecondsLeft) : `Set ${currentSet.id.split("-").pop() ?? ""}`}
        secondaryText={resting ? "Next set" : `${currentSet.chosenWeightKg ?? currentSet.plannedWeightKg ?? "-"} kg`}
        tertiaryText={setLabel(currentSet)}
        theme={theme}
        workoutProgress={workoutProgress}
      />
      <Text style={[styles.metaText, { color: theme.textMuted }]}>Heart rate unavailable until a live source is connected.</Text>
      <Surface theme={theme} style={styles.fullWidth}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{exercise.name}</Text>
        <Text style={[styles.metaText, { color: theme.textMuted }]}>{[...exercise.primaryMuscles, ...exercise.secondaryMuscles].join(" - ")}</Text>
      </Surface>
      <Surface theme={theme} style={styles.fullWidth}>
        <Text style={[styles.eyebrow, { color: theme.textMuted }]}>Today target</Text>
        <View style={styles.targetGrid}>
          <Metric label="Sets" value={String(exercise.sets.length)} theme={theme} />
          <Metric label="Reps" value={String(currentSet.chosenReps ?? currentSet.plannedReps ?? "-")} theme={theme} />
          <Metric label="KG" value={String(currentSet.chosenWeightKg ?? currentSet.plannedWeightKg ?? "-")} theme={theme} />
          <Metric label="Rest" value={`${exercise.restSeconds}s`} theme={theme} />
        </View>
      </Surface>
      <FeelingSelector feeling={feeling} onChange={onFeeling} theme={theme} />
      {resting ? (
        <View style={styles.actionDock}>
          <Pressable accessibilityRole="button" onPress={() => onAdjustRest(-15)} style={[styles.dockButton, { borderColor: theme.line }]}>
            <Text style={[styles.buttonLabel, { color: theme.text }]}>-15s</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onSkipRest} style={[styles.primaryDockButton, { backgroundColor: theme.rest }]}>
            <Text style={styles.primaryDockText}>Skip Rest</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => onAdjustRest(15)} style={[styles.dockButton, { borderColor: theme.line }]}>
            <Text style={[styles.buttonLabel, { color: theme.text }]}>+15s</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.compactButtonStack}>
          <Pressable accessibilityRole="button" onPress={onLogSet} style={[styles.primaryWideButton, { backgroundColor: theme.accent }]}>
            <Text style={styles.primaryDockText}>Log Set</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onQuickAdjust} style={[styles.secondaryWideButton, { borderColor: theme.line }]}>
            <Text style={[styles.buttonLabel, { color: theme.text }]}>Adjust weight, reps or exercise</Text>
          </Pressable>
        </View>
      )}
      <Surface theme={theme} style={styles.fullWidth}>
        <Text style={[styles.eyebrow, { color: theme.textMuted }]}>Up next</Text>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Next planned movement</Text>
        <Text style={[styles.metaText, { color: theme.textMuted }]}>Preview updates when the session advances.</Text>
      </Surface>
    </Animated.ScrollView>
  );
}

function Surface({ children, style, theme }: PropsWithChildren<{ style?: object; theme: FitnessFocusTheme }>): JSX.Element {
  return <View style={[styles.surface, { backgroundColor: theme.surface1, borderColor: theme.line }, style]}>{children}</View>;
}

function Metric({ label, theme, value }: { label: string; theme: FitnessFocusTheme; value: string }): JSX.Element {
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
}

function SetEditor({ label, onMinus, onPlus, theme, value }: { label: string; onMinus: () => void; onPlus: () => void; theme: FitnessFocusTheme; value: string }): JSX.Element {
  return (
    <Surface theme={theme} style={styles.flexSurface}>
      <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{label}</Text>
      <View style={styles.editorRow}>
        <Text style={[styles.editorValue, { color: theme.text }]}>{value}</Text>
        <View style={styles.stepper}>
          <Pressable accessibilityRole="button" onPress={onMinus} style={[styles.stepperButton, { borderColor: theme.line }]}>
            <Text style={[styles.buttonLabel, { color: theme.text }]}>-</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onPlus} style={[styles.stepperButton, { borderColor: theme.line }]}>
            <Text style={[styles.buttonLabel, { color: theme.text }]}>+</Text>
          </Pressable>
        </View>
      </View>
    </Surface>
  );
}

function FeelingSelector({ feeling, onChange, theme }: { feeling?: FeelingState; onChange: (feeling: FeelingState) => void; theme: FitnessFocusTheme }): JSX.Element {
  return (
    <View style={styles.feelingRow}>
      {feelingOptions.map((option) => {
        const active = option.id === feeling;

        return (
          <Pressable key={option.id} accessibilityRole="button" onPress={() => onChange(option.id)} style={[styles.feelingButton, { backgroundColor: active ? theme.accentSoft : theme.surface2, borderColor: active ? theme.accent : theme.line }]}>
            <Text style={[styles.feelingText, { color: active ? theme.accent : theme.textMuted }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function PainReviewBanner({ theme }: { theme: FitnessFocusTheme }): JSX.Element {
  return (
    <View style={[styles.painBanner, { backgroundColor: theme.danger, borderColor: theme.danger }]}>
      <Text style={styles.painTitle}>Pain reported</Text>
      <Text style={styles.painText}>Pause, stop the movement, record location, and choose an alternative before continuing.</Text>
    </View>
  );
}

function ActionSheet({ children, onClose, theme, title, visible }: PropsWithChildren<{ onClose: () => void; theme: FitnessFocusTheme; title: string; visible: boolean }>): JSX.Element {
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <Pressable style={styles.sheetScrim} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: theme.surface1, borderColor: theme.line }]}>
        <View style={styles.sheetHandle} />
        <Text style={[styles.sheetTitle, { color: theme.text }]}>{title}</Text>
        <View style={styles.sheetBody}>{children}</View>
      </View>
    </Modal>
  );
}

function SheetButton({ label, onPress, primary = false, theme, tone = "normal" }: { label: string; onPress: () => void; primary?: boolean; theme: FitnessFocusTheme; tone?: "normal" | "danger" }): JSX.Element {
  const backgroundColor = primary ? theme.accent : tone === "danger" ? theme.danger : theme.surface2;
  const color = primary || tone === "danger" ? "#FFFFFF" : theme.text;

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.sheetButton, { backgroundColor, borderColor: tone === "danger" ? theme.danger : theme.line }]}>
      <Text style={[styles.sheetButtonText, { color }]}>{label}</Text>
    </Pressable>
  );
}

function WorkoutCompletionCard({ completedSets, elapsedSeconds, exerciseCount, theme }: { completedSets: number; elapsedSeconds: number; exerciseCount: number; theme: FitnessFocusTheme }): JSX.Element {
  return (
    <View style={[styles.completionCard, { backgroundColor: theme.accentSoft, borderColor: theme.accent }]}>
      <Text style={[styles.eyebrow, { color: theme.achievement }]}>Achievement</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Focused work completed</Text>
      <Text style={[styles.bodyText, { color: theme.textMuted }]}>{`${formatDuration(elapsedSeconds)} - ${exerciseCount} exercises - ${completedSets} sets`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actionDock: {
    flexDirection: "row",
    gap: fitnessFocusSpacing.md,
  },
  bodyText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 20,
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 22,
  },
  chip: {
    borderRadius: fitnessFocusRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: fitnessFocusSpacing.md,
    paddingVertical: 7,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessFocusSpacing.sm,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 15,
  },
  compactButtonStack: {
    gap: fitnessFocusSpacing.sm,
    width: "100%",
  },
  compactContent: {
    alignItems: "center",
    gap: fitnessFocusSpacing.md,
    paddingBottom: 144,
    paddingHorizontal: fitnessFocusSpacing.lg,
  },
  compactSetCount: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 16,
  },
  completionCard: {
    borderRadius: fitnessFocusRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: fitnessFocusSpacing.xs,
    padding: fitnessFocusSpacing.lg,
  },
  dockButton: {
    alignItems: "center",
    borderRadius: fitnessFocusRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    justifyContent: "center",
    minHeight: 52,
  },
  editorRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: fitnessFocusSpacing.sm,
  },
  editorValue: {
    fontSize: 25,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  exerciseTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.3,
    lineHeight: 14,
    textTransform: "uppercase",
  },
  feelingButton: {
    borderRadius: fitnessFocusRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: fitnessFocusSpacing.md,
    paddingVertical: 8,
  },
  feelingRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessFocusSpacing.sm,
  },
  feelingText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 15,
  },
  flexSurface: {
    flex: 1,
  },
  fullWidth: {
    width: "100%",
  },
  guidedContent: {
    gap: fitnessFocusSpacing.md,
    paddingBottom: 144,
    paddingHorizontal: fitnessFocusSpacing.lg,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: fitnessFocusRadius.pill,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  iconText: {
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 34,
  },
  loading: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  mediaBar: {
    borderRadius: 18,
    bottom: 28,
    height: 54,
    left: 24,
    opacity: 0.9,
    position: "absolute",
    transform: [{ rotate: "-8deg" }],
    width: "62%",
  },
  mediaCard: {
    aspectRatio: 16 / 10,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    overflow: "hidden",
    padding: fitnessFocusSpacing.lg,
  },
  mediaCircle: {
    borderRadius: 999,
    height: 42,
    opacity: 0.72,
    position: "absolute",
    right: 30,
    top: 26,
    width: 42,
  },
  mediaText: {
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  metaText: {
    fontSize: 12.5,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 17,
  },
  metric: {
    alignItems: "center",
    flex: 1,
    minWidth: 68,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 14,
    marginTop: 2,
    textTransform: "uppercase",
  },
  metricValue: {
    fontSize: 19,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  modeTab: {
    alignItems: "center",
    borderRadius: fitnessFocusRadius.pill,
    flex: 1,
    justifyContent: "center",
    minHeight: 38,
  },
  modeTabs: {
    alignSelf: "flex-end",
    borderRadius: fitnessFocusRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 4,
    marginHorizontal: fitnessFocusSpacing.lg,
    marginVertical: fitnessFocusSpacing.sm,
    padding: 4,
    width: 212,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 15,
  },
  modeWrap: {
    flex: 1,
  },
  painBanner: {
    borderRadius: fitnessFocusRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    bottom: 98,
    left: fitnessFocusSpacing.lg,
    padding: fitnessFocusSpacing.md,
    position: "absolute",
    right: fitnessFocusSpacing.lg,
  },
  painText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 3,
  },
  painTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 19,
  },
  pauseButton: {
    alignItems: "center",
    borderRadius: fitnessFocusRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: fitnessFocusSpacing.md,
  },
  positionRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryDockButton: {
    alignItems: "center",
    borderRadius: fitnessFocusRadius.lg,
    flex: 1.5,
    justifyContent: "center",
    minHeight: 52,
  },
  primaryDockText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 19,
  },
  primaryWideButton: {
    alignItems: "center",
    borderRadius: fitnessFocusRadius.lg,
    justifyContent: "center",
    minHeight: 56,
  },
  screen: {
    flex: 1,
  },
  secondaryButton: {
    alignItems: "center",
    borderRadius: fitnessFocusRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    minHeight: 36,
    paddingHorizontal: fitnessFocusSpacing.md,
  },
  secondaryWideButton: {
    alignItems: "center",
    borderRadius: fitnessFocusRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    minHeight: 48,
  },
  sheet: {
    borderTopLeftRadius: fitnessFocusRadius.sheet,
    borderTopRightRadius: fitnessFocusRadius.sheet,
    borderWidth: StyleSheet.hairlineWidth,
    bottom: 0,
    left: 0,
    paddingBottom: 28,
    paddingHorizontal: fitnessFocusSpacing.lg,
    paddingTop: fitnessFocusSpacing.sm,
    position: "absolute",
    right: 0,
  },
  sheetBody: {
    gap: fitnessFocusSpacing.sm,
  },
  sheetButton: {
    alignItems: "center",
    borderRadius: fitnessFocusRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: fitnessFocusSpacing.lg,
  },
  sheetButtonText: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 18,
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: "rgba(148,163,184,0.45)",
    borderRadius: 999,
    height: 4,
    marginBottom: fitnessFocusSpacing.md,
    width: 48,
  },
  sheetScrim: {
    backgroundColor: "rgba(0,0,0,0.34)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.2,
    lineHeight: 25,
    marginBottom: fitnessFocusSpacing.md,
  },
  statusHeader: {
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: fitnessFocusSpacing.md,
    paddingHorizontal: fitnessFocusSpacing.lg,
    paddingVertical: fitnessFocusSpacing.md,
  },
  stepper: {
    flexDirection: "row",
    gap: fitnessFocusSpacing.sm,
  },
  stepperButton: {
    alignItems: "center",
    borderRadius: fitnessFocusRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  surface: {
    borderRadius: fitnessFocusRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: fitnessFocusSpacing.sm,
    padding: fitnessFocusSpacing.lg,
  },
  targetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessFocusSpacing.sm,
    justifyContent: "space-between",
  },
  timerText: {
    fontSize: 22,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    letterSpacing: -0.3,
    lineHeight: 27,
  },
  titleBlock: {
    gap: fitnessFocusSpacing.sm,
  },
  twoColumn: {
    flexDirection: "row",
    gap: fitnessFocusSpacing.md,
  },
});
