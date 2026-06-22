import { HStack, Text, VStack } from "@expo/ui/swift-ui";
import { createLiveActivity } from "expo-widgets";

import type { FitnessLiveActivityState } from "@/features/fitness/live/workoutActivityTypes";

function phaseLabel(phase: FitnessLiveActivityState["phase"]): string {
  if (phase === "rest") {
    return "Rest";
  }

  if (phase === "paused") {
    return "Paused";
  }

  if (phase === "complete") {
    return "Done";
  }

  return "Work";
}

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.max(0, seconds % 60);

  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

function LiveActivityText({ children }: { children: string }) {
  return <Text>{children}</Text>;
}

function LiveActivityBanner(props: FitnessLiveActivityState) {
  return (
    <VStack spacing={4}>
      <LiveActivityText>{props.workoutName}</LiveActivityText>
      <LiveActivityText>{props.exerciseName}</LiveActivityText>
      <HStack spacing={8}>
        <LiveActivityText>{`${props.exerciseIndex + 1}/${props.exerciseTotal}`}</LiveActivityText>
        <LiveActivityText>{`${props.setIndex}/${props.setTotal} sets`}</LiveActivityText>
        <LiveActivityText>{props.remainingSeconds ? formatSeconds(props.remainingSeconds) : formatSeconds(props.elapsedSeconds)}</LiveActivityText>
      </HStack>
    </VStack>
  );
}

export const FitnessWorkoutActivity = createLiveActivity<FitnessLiveActivityState>(
  "FitnessWorkoutActivity",
  (props) => ({
    banner: <LiveActivityBanner {...props} />,
    compactLeading: <LiveActivityText>{phaseLabel(props.phase)}</LiveActivityText>,
    compactTrailing: <LiveActivityText>{props.remainingSeconds ? formatSeconds(props.remainingSeconds) : formatSeconds(props.elapsedSeconds)}</LiveActivityText>,
    expandedBottom: (
      <HStack spacing={8}>
        <LiveActivityText>{`${props.setIndex}/${props.setTotal} sets`}</LiveActivityText>
        <LiveActivityText>{props.heartRate && props.heartRateFreshness === "live" ? `${props.heartRate} bpm` : "HR optional"}</LiveActivityText>
      </HStack>
    ),
    expandedCenter: <LiveActivityText>{props.exerciseName}</LiveActivityText>,
    expandedLeading: <LiveActivityText>{`${props.exerciseIndex + 1}/${props.exerciseTotal}`}</LiveActivityText>,
    expandedTrailing: <LiveActivityText>{props.remainingSeconds ? formatSeconds(props.remainingSeconds) : formatSeconds(props.elapsedSeconds)}</LiveActivityText>,
    minimal: <LiveActivityText>{phaseLabel(props.phase).charAt(0)}</LiveActivityText>,
  }),
);
