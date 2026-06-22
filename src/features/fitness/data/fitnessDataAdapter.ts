import { fitnessTodayData } from "@/features/fitness/data/fitnessPlaceholderData";
import type { FitnessTodayData } from "@/features/fitness/types/fitness";

export type FitnessDateRange = {
  end: Date;
  start: Date;
};

export type FitnessStepSample = {
  count: number;
  end: Date;
  source: string;
  start: Date;
};

export type FitnessHeartRateSample = {
  bpm: number;
  freshnessSeconds: number;
  source: string;
  timestamp: Date;
};

export type FitnessEnergySample = {
  calories: number;
  confidence: "estimated" | "device" | "manual";
  source: string;
  timestamp: Date;
};

export type FitnessWorkoutRecord = {
  durationMinutes: number;
  id: string;
  source: string;
  startedAt: Date;
  title: string;
};

export type FitnessLiveWorkoutConfig = {
  plannedDurationMinutes: number;
  title: string;
  workoutId: string;
};

export type FitnessLiveWorkoutSession = {
  id: string;
  startedAt: Date;
  state: "started" | "unsupported";
};

export type FitnessDataAdapter = {
  getActiveEnergy: (range: FitnessDateRange) => Promise<FitnessEnergySample[]>;
  getHeartRate: (range: FitnessDateRange) => Promise<FitnessHeartRateSample[]>;
  getSteps: (range: FitnessDateRange) => Promise<FitnessStepSample[]>;
  getToday: () => Promise<FitnessTodayData>;
  getWorkouts: (range: FitnessDateRange) => Promise<FitnessWorkoutRecord[]>;
  startLiveWorkout: (config: FitnessLiveWorkoutConfig) => Promise<FitnessLiveWorkoutSession>;
  stopLiveWorkout: (sessionId: string) => Promise<void>;
};

export const placeholderFitnessDataAdapter: FitnessDataAdapter = {
  async getActiveEnergy() {
    return [];
  },
  async getHeartRate() {
    return [];
  },
  async getSteps() {
    return [];
  },
  async getToday() {
    return fitnessTodayData;
  },
  async getWorkouts() {
    return [];
  },
  async startLiveWorkout(config) {
    return {
      id: `placeholder-${config.workoutId}`,
      startedAt: new Date(),
      state: "unsupported",
    };
  },
  async stopLiveWorkout() {
    return undefined;
  },
};
