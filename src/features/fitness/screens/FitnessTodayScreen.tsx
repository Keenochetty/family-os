import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type JSX, type PropsWithChildren } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Speech from "expo-speech";
import Animated, { LinearTransition, useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

import { DualWorkoutRings } from "@/features/fitness/components/DualWorkoutRings";
import { FitnessBodyMap } from "@/features/fitness/components/FitnessBodyMap";
import { FitnessSurface } from "@/features/fitness/components/FitnessSurface";
import { readWorkoutSessionHistory, type WorkoutSessionHistorySummary } from "@/features/fitness/focus/sessionHistory";
import { startWorkoutLiveActivity } from "@/features/fitness/live/workoutLiveActivity";
import type { FitnessLiveActivityState, FitnessWorkoutActivityHandle } from "@/features/fitness/live/workoutActivityTypes";
import {
  fitnessAdjustmentOptions,
  fitnessActiveWorkoutExercises,
  fitnessAchievementRecords,
  fitnessDeviceStatuses,
  fitnessExploreItems,
  fitnessPlanCalendarDays,
  fitnessPlanRailItems,
  fitnessPlanSettings,
  fitnessPlanSummary,
  fitnessProgressMetrics,
  fitnessProgressOverview,
  fitnessProgressRanges,
  fitnessSubstitutions,
  fitnessTodayAchievement,
  fitnessTodayData,
  fitnessWeeklyGoalDays,
  fitnessWeightDirection,
} from "@/features/fitness/data/fitnessPlaceholderData";
import { fitnessRadius, fitnessSpacing, getFitnessTheme, type FitnessTheme } from "@/features/fitness/theme/fitnessTheme";
import {
  AnimatedSection,
  AttentionCue,
  FitnessAttentionProvider,
  FitnessRealmHeader,
  getFitnessRealmTheme,
} from "@/features/fitness/realm";
import {
  getWorkoutFocusMode,
  setWorkoutFocusMode,
  type WorkoutFocusMode,
} from "@/features/fitness/preferences/workoutFocusPreference";
import type {
  BodyMapSide,
  BodyMapVariant,
  FitnessAdjustmentOption,
  FitnessAchievement,
  FitnessAchievementRecord,
  FitnessDeviceStatus,
  FitnessExercise,
  FitnessExploreItem,
  FitnessMetric,
  FitnessPlanCalendarDay,
  FitnessPlanRailItem,
  FitnessPlanSetting,
  FitnessPlanSession,
  FitnessProgressOverview,
  FitnessProgressRange,
  FitnessProgressMetric,
  FitnessReadiness,
  FitnessSubstitution,
  FitnessTab,
  FitnessWeeklyGoalDay,
  FitnessWeightDirection,
  MuscleHeatValue,
  MoveFuelMetric,
} from "@/features/fitness/types/fitness";
import { useAppTheme } from "@/lib/theme";

const tabs: { id: FitnessTab; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "train", label: "Train" },
  { id: "explore", label: "Explore" },
  { id: "progress", label: "Progress" },
];

type BodyLoadMode = "target" | "today" | "week" | "recovery";

const fitnessTimerModes = ["Rest", "Stopwatch", "Interval", "EMOM", "AMRAP"] as const;

type FitnessTimerMode = (typeof fitnessTimerModes)[number];

type WorkoutSessionContextValue = {
  canGoBack: boolean;
  canGoNext: boolean;
  canLogSet: boolean;
  currentExercise: FitnessExercise;
  currentExerciseComplete: boolean;
  currentExerciseIndex: number;
  handleEndWorkout: () => void;
  handleLogSet: () => void;
  handleNext: () => void;
  handlePauseToggle: () => void;
  handlePrevious: () => void;
  paused: boolean;
  restSecondsLeft: number;
  sessionId: string;
  totalExercises: number;
  totalLoggedSets: number;
  totalPlannedSets: number;
  workoutComplete: boolean;
};

const WorkoutSessionContext = createContext<WorkoutSessionContextValue | null>(null);

export function FitnessTodayScreen({ initialTab = "today" }: { initialTab?: FitnessTab } = {}): JSX.Element {
  const { isDark, theme: appTheme } = useAppTheme();
  const router = useRouter();
  const theme = useMemo(() => getFitnessTheme(isDark, appTheme), [appTheme, isDark]);
  const realmTheme = useMemo(() => getFitnessRealmTheme(isDark, appTheme), [appTheme, isDark]);
  const [activeTab, setActiveTab] = useState<FitnessTab>(initialTab);
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  function handleTabChange(tab: FitnessTab): void {
    setActiveTab(tab);
    const route = tab === "today" ? "/fitness/today" : `/fitness/${tab}`;
    router.replace(route as Parameters<typeof router.replace>[0]);
  }

  return (
    <FitnessAttentionProvider>
      <View style={[styles.realmScreen, { backgroundColor: theme.background }]}>
        <FitnessRealmHeader
          activeTab={activeTab}
          onTabChange={handleTabChange}
          progressPercent={fitnessPlanSummary.completionPercent}
          scrollY={scrollY}
          selectedDateLabel={fitnessTodayData.selectedDateLabel}
          subtitle={fitnessPlanSummary.name}
          tabs={tabs}
          theme={realmTheme}
          week={fitnessTodayData.week}
        />
        <Animated.ScrollView
          contentContainerStyle={[styles.content, { backgroundColor: theme.background }]}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <AnimatedSection index={0}>
            {activeTab === "today" ? <TodayContent isDark={isDark} theme={theme} /> : <TabPlaceholder tab={activeTab} theme={theme} />}
          </AnimatedSection>
        </Animated.ScrollView>
      </View>
    </FitnessAttentionProvider>
  );
}

function TodayContent({ isDark, theme }: { isDark: boolean; theme: FitnessTheme }): JSX.Element {
  const { workout } = fitnessTodayData;
  const router = useRouter();
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [adjustPanelOpen, setAdjustPanelOpen] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState<FitnessAdjustmentOption | null>(null);

  function handleStartWorkout(): void {
    router.push(`/fitness/session/placeholder-session-${workout.id}` as Parameters<typeof router.push>[0]);
    setAdjustPanelOpen(false);
  }

  return (
    <>
      <FitnessSurface elevated style={styles.hero} theme={theme}>
        <View style={[styles.todayHeroVisual, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
          <View style={[styles.todayHeroBeam, { backgroundColor: theme.accentStrong }]} />
          <View style={[styles.todayHeroOrb, { backgroundColor: theme.recovery }]} />
          <Text style={[styles.todayHeroVisualLabel, { color: theme.accentStrong }]}>Today focus</Text>
        </View>
        <View style={styles.heroTopRow}>
          <View style={styles.heroCopy}>
            <Text style={[styles.eyebrow, { color: theme.accent }]}>{workout.planName}</Text>
            <Text style={[styles.heroTitle, { color: theme.text }]}>{workout.title}</Text>
            <Text style={[styles.bodyText, { color: theme.textMuted }]}>
              {selectedAdjustment
                ? `${selectedAdjustment.title} - ${selectedAdjustment.durationLabel}`
                : `${workout.sessionLabel} - ${workout.durationMinutes} min - ${workout.difficulty}`}
            </Text>
          </View>
          <View style={[styles.progressBadge, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
            <Text style={[styles.progressValue, { color: theme.accentStrong }]}>{workout.progressPercent}%</Text>
            <Text style={[styles.progressLabel, { color: theme.textMuted }]}>plan</Text>
          </View>
        </View>

        <View style={[styles.recommendationBox, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
          <Text style={[styles.metricLabel, { color: theme.accentStrong }]}>Why this now</Text>
          <Text style={[styles.bodyText, { color: theme.text }]}>
            {selectedAdjustment
              ? `Applied: ${selectedAdjustment.detail}`
              : "Your lower body is recovering, readiness is stable, and this upper push session fits today's available training window."}
          </Text>
        </View>

        <View style={styles.todayHeroMetaGrid}>
          <HeroMetaPill label="Duration" theme={theme} value={`${workout.durationMinutes} min`} />
          <HeroMetaPill label="Exercises" theme={theme} value={`${fitnessActiveWorkoutExercises.length}`} />
          <HeroMetaPill label="Equipment" theme={theme} value={workout.equipment.join(", ")} />
        </View>

        <View style={styles.heroTags}>
          {workout.muscles.map((muscle) => (
            <View key={muscle} style={[styles.tag, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
              <Text style={[styles.tagText, { color: theme.textMuted }]}>{muscle}</Text>
            </View>
          ))}
        </View>

        <View style={styles.heroFooter}>
          <AttentionCue
            colour={theme.accentStrong}
            enabled={!workoutStarted}
            id="fitness-today-start"
            reason="first-primary-action"
            style={styles.primaryActionCue}
          >
            <Pressable
              accessibilityRole="button"
              onPress={handleStartWorkout}
              style={({ pressed }) => [styles.primaryButton, { backgroundColor: theme.accentStrong }, pressed && styles.pressed]}
            >
              <Text style={styles.primaryButtonText}>{workoutStarted ? "Continue workout" : "Start workout"}</Text>
            </Pressable>
          </AttentionCue>
          <Pressable
            accessibilityRole="button"
            onPress={() => setAdjustPanelOpen((open) => !open)}
            style={({ pressed }) => [
              styles.secondaryButton,
              { backgroundColor: adjustPanelOpen ? theme.accentSoft : theme.surface3, borderColor: adjustPanelOpen ? theme.accentBorder : theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.secondaryButtonText, { color: adjustPanelOpen ? theme.accentStrong : theme.text }]}>Adjust</Text>
          </Pressable>
        </View>
      </FitnessSurface>

      <WorkoutAdjustPanel
        isOpen={adjustPanelOpen}
        onClear={() => {
          setSelectedAdjustment(null);
          setAdjustPanelOpen(false);
        }}
        onClose={() => setAdjustPanelOpen(false)}
        onSelect={(option) => {
          setSelectedAdjustment(option);
        }}
        selectedAdjustment={selectedAdjustment}
        theme={theme}
      />

      {workoutStarted ? (
        <ActiveWorkoutPanel
          onClose={() => setWorkoutStarted(false)}
          theme={theme}
          totalDurationMinutes={workout.durationMinutes}
          workoutId={workout.id}
          workoutName={workout.title}
        />
      ) : null}

      <View style={styles.metricGrid}>
        {fitnessTodayData.metrics.map((metric) => (
          <MetricTile key={metric.label} metric={metric} theme={theme} />
        ))}
      </View>

      <ReadinessBreakdown readiness={fitnessTodayData.readiness} theme={theme} />

      <FitnessSurface theme={theme}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Move + Fuel</Text>
          <Text style={[styles.sectionHint, { color: theme.textSubtle }]}>Linked</Text>
        </View>
        <View style={styles.bridgeGrid}>
          <BridgeMetric accent={theme.accent} metric={fitnessTodayData.move} soft={theme.accentSoft} theme={theme} />
          <BridgeMetric accent={theme.nutrition} metric={fitnessTodayData.fuel} soft={theme.nutritionSoft} theme={theme} />
        </View>
        <Text style={[styles.bridgeFootnote, { color: theme.textSubtle }]}>Fuel timing follows the training plan. Device values should always show source and freshness.</Text>
      </FitnessSurface>

      <DeviceSourceCard statuses={fitnessDeviceStatuses} theme={theme} />
      <BodyLoadPreview isDark={isDark} muscleHeat={fitnessTodayData.muscleHeat} theme={theme} />
      <ContinuePlanRail theme={theme} />
      <AchievementCapsule achievement={fitnessTodayAchievement} theme={theme} />
    </>
  );
}

function MetricTile({ metric, theme }: { metric: FitnessMetric; theme: FitnessTheme }): JSX.Element {
  const tone = metric.tone === "recovery" ? theme.recovery : metric.tone === "info" ? theme.info : metric.tone === "success" ? theme.success : theme.accent;
  const soft =
    metric.tone === "recovery" ? theme.recoverySoft : metric.tone === "info" ? theme.infoSoft : metric.tone === "success" ? theme.successSoft : theme.accentSoft;

  return (
    <FitnessSurface style={styles.metricTile} theme={theme}>
      <View style={[styles.metricDot, { backgroundColor: tone }]} />
      <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{metric.label}</Text>
      <Text style={[styles.metricValue, { color: theme.text }]}>{metric.value}</Text>
      <View style={[styles.metricPill, { backgroundColor: soft }]}>
        <Text numberOfLines={1} style={[styles.metricDetail, { color: theme.textMuted }]}>
          {metric.detail}
        </Text>
      </View>
    </FitnessSurface>
  );
}

function HeroMetaPill({ label, theme, value }: { label: string; theme: FitnessTheme; value: string }): JSX.Element {
  return (
    <View style={[styles.heroMetaPill, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
      <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text numberOfLines={1} style={[styles.heroMetaValue, { color: theme.text }]}>
        {value}
      </Text>
    </View>
  );
}

function ReadinessBreakdown({ readiness, theme }: { readiness: FitnessReadiness; theme: FitnessTheme }): JSX.Element {
  const items = [
    { label: "Energy", tone: theme.success, value: readiness.energy },
    { label: "Sleep", tone: theme.info, value: readiness.sleep },
    { label: "Soreness", tone: theme.accent, value: readiness.soreness },
    { label: "Stress", tone: theme.recovery, value: readiness.stress },
  ];
  const average = Math.round(((readiness.energy + readiness.sleep + (6 - readiness.soreness) + (6 - readiness.stress)) / 20) * 100);

  return (
    <FitnessSurface style={styles.readinessCard} theme={theme}>
      <View style={styles.sectionHeader}>
        <View style={styles.flexCopy}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Readiness</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Based on current check-in signals</Text>
        </View>
        <View style={[styles.readinessScore, { backgroundColor: theme.recoverySoft, borderColor: theme.recovery }]}>
          <Text style={[styles.readinessScoreText, { color: theme.recovery }]}>{average}</Text>
        </View>
      </View>

      <View style={styles.readinessChipGrid}>
        {items.map((item) => (
          <ReadinessChip key={item.label} label={item.label} theme={theme} tone={item.tone} value={item.value} />
        ))}
      </View>

      <View style={[styles.readinessRecommendation, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
        <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Recommendation</Text>
        <Text style={[styles.bodyText, { color: theme.text }]}>{readiness.recommendation}</Text>
      </View>
    </FitnessSurface>
  );
}

function ReadinessChip({ label, theme, tone, value }: { label: string; theme: FitnessTheme; tone: string; value: number }): JSX.Element {
  return (
    <View style={[styles.readinessChip, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
      <View style={styles.readinessChipHeader}>
        <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{label}</Text>
        <Text style={[styles.readinessChipValue, { color: theme.text }]}>{value}/5</Text>
      </View>
      <View style={[styles.readinessTrack, { backgroundColor: theme.surface2 }]}>
        <View style={[styles.readinessFill, { backgroundColor: tone, width: `${Math.max(0, Math.min(100, (value / 5) * 100))}%` }]} />
      </View>
    </View>
  );
}

function BridgeMetric({
  accent,
  metric,
  soft,
  theme,
}: {
  accent: string;
  metric: MoveFuelMetric;
  soft: string;
  theme: FitnessTheme;
}): JSX.Element {
  return (
    <View style={[styles.bridgeMetric, { backgroundColor: soft, borderColor: theme.border }]}>
      <View style={styles.bridgeHeader}>
        <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{metric.label}</Text>
        <Text style={[styles.bridgeSource, { color: theme.textSubtle }]}>{metric.source}</Text>
      </View>
      <Text style={[styles.bridgeValue, { color: accent }]}>{metric.value}</Text>
      <Text numberOfLines={2} style={[styles.bridgeDetail, { color: theme.textMuted }]}>
        {metric.detail}
      </Text>
      <View style={[styles.bridgeTrack, { backgroundColor: theme.surface2 }]}>
        <View style={[styles.bridgeFill, { backgroundColor: accent, width: `${Math.max(0, Math.min(100, metric.progressPercent))}%` }]} />
      </View>
      <Text style={[styles.bridgeFreshness, { color: theme.textSubtle }]}>{metric.freshness}</Text>
      <View style={styles.bridgeActions}>
        {metric.actions.map((action) => (
          <View key={action} style={[styles.bridgeActionChip, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
            <Text style={[styles.bridgeActionText, { color: theme.textMuted }]}>{action}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function DeviceSourceCard({ statuses, theme }: { statuses: FitnessDeviceStatus[]; theme: FitnessTheme }): JSX.Element {
  return (
    <FitnessSurface style={styles.deviceCard} theme={theme}>
      <View style={styles.sectionHeader}>
        <View style={styles.flexCopy}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Data sources</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Live data appears only after a source is connected.</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: theme.infoSoft, borderColor: theme.info }]}>
          <Text style={[styles.statusPillText, { color: theme.info }]}>Optional</Text>
        </View>
      </View>

      {statuses.map((status) => (
        <DeviceSourceRow key={status.id} status={status} theme={theme} />
      ))}
    </FitnessSurface>
  );
}

function DeviceSourceRow({ status, theme }: { status: FitnessDeviceStatus; theme: FitnessTheme }): JSX.Element {
  const color =
    status.state === "connected"
      ? theme.success
      : status.state === "manual"
        ? theme.accent
        : status.state === "permission-needed"
          ? theme.info
          : theme.textSubtle;
  const soft =
    status.state === "connected"
      ? theme.successSoft
      : status.state === "manual"
        ? theme.accentSoft
        : status.state === "permission-needed"
          ? theme.infoSoft
          : theme.surface3;

  return (
    <View style={[styles.deviceRow, { borderColor: theme.border }]}>
      <View style={[styles.deviceDot, { backgroundColor: color }]} />
      <View style={styles.flexCopy}>
        <Text style={[styles.sessionTitle, { color: theme.text }]}>{status.label}</Text>
        <Text style={[styles.sectionHint, { color: theme.textMuted }]}>{`${status.source} - ${status.freshness}`}</Text>
      </View>
      <View style={[styles.deviceAction, { backgroundColor: soft, borderColor: color }]}>
        <Text style={[styles.deviceActionText, { color }]}>{status.actionLabel}</Text>
      </View>
    </View>
  );
}

function WorkoutAdjustPanel({
  isOpen,
  onClear,
  onClose,
  onSelect,
  selectedAdjustment,
  theme,
}: {
  isOpen: boolean;
  onClear: () => void;
  onClose: () => void;
  onSelect: (option: FitnessAdjustmentOption) => void;
  selectedAdjustment: FitnessAdjustmentOption | null;
  theme: FitnessTheme;
}): JSX.Element {
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={isOpen}>
      <Pressable accessibilityLabel="Close adjust today sheet" accessibilityRole="button" onPress={onClose} style={styles.adjustSheetScrim} />
      <View style={[styles.adjustSheet, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
        <View style={styles.sheetHandle} />
        <View style={styles.sectionHeader}>
          <View style={styles.flexCopy}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Adjust today</Text>
            <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Review the proposed change before applying it.</Text>
          </View>
          {selectedAdjustment ? (
            <Pressable accessibilityRole="button" onPress={onClear} style={({ pressed }) => [styles.clearAdjustButton, pressed && styles.pressed]}>
              <Text style={[styles.clearAdjustText, { color: theme.textMuted }]}>Clear</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.adjustGrid}>
          {fitnessAdjustmentOptions.map((option) => (
            <AdjustOptionCard
              key={option.id}
              option={option}
              selected={selectedAdjustment?.id === option.id}
              theme={theme}
              onPress={() => onSelect(option)}
            />
          ))}
        </View>
        <View style={[styles.adjustPreview, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
          <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Proposed change</Text>
          <Text style={[styles.bodyText, { color: theme.text }]}>
            {selectedAdjustment ? `${selectedAdjustment.title}: ${selectedAdjustment.detail}` : "Choose an adjustment to preview how today's workout changes."}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          style={({ pressed }) => [styles.applyAdjustButton, { backgroundColor: selectedAdjustment ? theme.accentStrong : theme.surface3 }, pressed && styles.pressed]}
        >
          <Text style={[styles.primaryButtonText, !selectedAdjustment && { color: theme.textMuted }]}>{selectedAdjustment ? "Apply adjustment" : "Keep planned workout"}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function AdjustOptionCard({
  onPress,
  option,
  selected,
  theme,
}: {
  onPress: () => void;
  option: FitnessAdjustmentOption;
  selected: boolean;
  theme: FitnessTheme;
}): JSX.Element {
  const color = option.tone === "recovery" ? theme.recovery : option.tone === "success" ? theme.success : option.tone === "info" ? theme.info : theme.accent;
  const soft =
    option.tone === "recovery" ? theme.recoverySoft : option.tone === "success" ? theme.successSoft : option.tone === "info" ? theme.infoSoft : theme.accentSoft;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.adjustCard,
        {
          backgroundColor: selected ? soft : theme.surface3,
          borderColor: selected ? color : theme.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.adjustCardHeader}>
        <Text numberOfLines={1} style={[styles.adjustTitle, { color: theme.text }]}>
          {option.title}
        </Text>
        <View style={[styles.adjustBadge, { backgroundColor: soft, borderColor: color }]}>
          <Text style={[styles.adjustBadgeText, { color }]}>{option.durationLabel}</Text>
        </View>
      </View>
      <Text numberOfLines={2} style={[styles.sectionHint, { color: theme.textMuted }]}>
        {option.detail}
      </Text>
    </Pressable>
  );
}

function WorkoutStatusIsland({
  detail,
  state,
  theme,
  title,
}: {
  detail: string;
  state: "complete" | "running" | "paused";
  theme: FitnessTheme;
  title: string;
}): JSX.Element {
  const color = state === "complete" ? theme.success : state === "paused" ? theme.info : theme.accentStrong;
  const soft = state === "complete" ? theme.successSoft : state === "paused" ? theme.infoSoft : theme.accentSoft;

  return (
    <View style={[styles.statusIsland, { backgroundColor: soft, borderColor: color }]}>
      <View style={[styles.statusIslandDot, { backgroundColor: color }]} />
      <View style={styles.flexCopy}>
        <Text numberOfLines={1} style={[styles.statusIslandTitle, { color: theme.text }]}>
          {title}
        </Text>
        <Text numberOfLines={1} style={[styles.statusIslandDetail, { color: theme.textMuted }]}>
          {detail}
        </Text>
      </View>
    </View>
  );
}

function ActiveWorkoutPanel({
  onClose,
  theme,
  totalDurationMinutes,
  workoutId,
  workoutName,
}: {
  onClose: () => void;
  theme: FitnessTheme;
  totalDurationMinutes: number;
  workoutId: string;
  workoutName: string;
}): JSX.Element {
  const sessionId = `placeholder-session-${workoutId}`;

  return (
    <WorkoutSessionProvider onClose={onClose} sessionId={sessionId}>
      <ActiveWorkoutPanelContent
        theme={theme}
        totalDurationMinutes={totalDurationMinutes}
        workoutId={workoutId}
        workoutName={workoutName}
      />
    </WorkoutSessionProvider>
  );
}

function ActiveWorkoutPanelContent({
  theme,
  totalDurationMinutes,
  workoutId,
  workoutName,
}: {
  theme: FitnessTheme;
  totalDurationMinutes: number;
  workoutId: string;
  workoutName: string;
}): JSX.Element {
  const {
    canGoBack,
    canGoNext,
    canLogSet,
    currentExercise,
    currentExerciseComplete,
    currentExerciseIndex,
    handleEndWorkout,
    handleLogSet,
    handleNext,
    handlePauseToggle,
    handlePrevious,
    paused,
    restSecondsLeft,
    sessionId,
    totalExercises,
    totalLoggedSets,
    totalPlannedSets,
    workoutComplete,
  } = useWorkoutSession();
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [timerMode, setTimerMode] = useState<FitnessTimerMode>("Rest");
  const [focusMode, setFocusModeState] = useState<WorkoutFocusMode>("guided");
  const [voiceCuesEnabled, setVoiceCuesEnabled] = useState(false);
  const [hapticCuesEnabled, setHapticCuesEnabled] = useState(true);
  const [soundCuesEnabled, setSoundCuesEnabled] = useState(false);
  const [notes, setNotes] = useState("");
  const liveActivityRef = useRef<FitnessWorkoutActivityHandle | null>(null);
  const previousCueStateRef = useRef({
    paused,
    restSecondsLeft,
    workoutComplete,
  });
  const endLabel = workoutComplete ? "Done" : confirmEnd ? "Confirm end" : "End workout";
  const workoutProgress = totalPlannedSets > 0 ? totalLoggedSets / totalPlannedSets : 0;
  const phaseProgress = workoutComplete
    ? 1
    : restSecondsLeft > 0
      ? 1 - restSecondsLeft / currentExercise.restSeconds
      : currentExercise.plannedSets > 0
        ? currentExercise.loggedSets / currentExercise.plannedSets
        : 0;
  const centerValue = restSecondsLeft > 0 ? formatDuration(restSecondsLeft) : currentExercise.target;
  const centerLabel = restSecondsLeft > 0 ? "Rest" : "Target";
  const nextExerciseName = fitnessActiveWorkoutExercises[currentExerciseIndex + 1]?.name ?? "Recovery";
  const activityState = useMemo<FitnessLiveActivityState>(
    () => ({
      elapsedSeconds: Math.max(0, Math.round((totalDurationMinutes * 60 * workoutProgress) || 0)),
      exerciseIndex: currentExerciseIndex,
      exerciseName: currentExercise.name,
      exerciseTotal: totalExercises,
      heartRateFreshness: "unavailable",
      phase: workoutComplete ? "complete" : paused ? "paused" : restSecondsLeft > 0 ? "rest" : "work",
      remainingSeconds: restSecondsLeft > 0 ? restSecondsLeft : undefined,
      sessionId,
      setIndex: totalLoggedSets,
      setTotal: totalPlannedSets,
      workoutId,
      workoutName,
    }),
    [currentExercise.name, currentExerciseIndex, restSecondsLeft, paused, sessionId, totalDurationMinutes, totalExercises, totalLoggedSets, totalPlannedSets, workoutComplete, workoutId, workoutName, workoutProgress],
  );

  useEffect(() => {
    let mounted = true;

    getWorkoutFocusMode()
      .then((storedMode) => {
        if (mounted) {
          setFocusModeState(storedMode);
        }
      })
      .catch(() => {
        if (mounted) {
          setFocusModeState("guided");
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (workoutComplete) {
      deactivateKeepAwake("active-workout").catch(() => undefined);
      return undefined;
    }

    activateKeepAwakeAsync("active-workout").catch(() => undefined);

    return () => {
      deactivateKeepAwake("active-workout").catch(() => undefined);
    };
  }, [workoutComplete]);

  useEffect(() => {
    let mounted = true;

    startWorkoutLiveActivity(activityState)
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
      liveActivityRef.current?.end({ ...activityState, phase: "complete" }).catch(() => undefined);
      liveActivityRef.current = null;
    };
    // Start once for this stable session. Updates are handled separately on meaningful state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    liveActivityRef.current?.update(activityState).catch(() => undefined);
  }, [activityState]);

  useEffect(() => {
    const previous = previousCueStateRef.current;
    const restStarted = previous.restSecondsLeft === 0 && restSecondsLeft > 0;
    const restCompleted = previous.restSecondsLeft > 0 && restSecondsLeft === 0 && !paused;
    const pauseChanged = previous.paused !== paused;
    const completedNow = !previous.workoutComplete && workoutComplete;

    if (completedNow) {
      if (hapticCuesEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      }
      if (voiceCuesEnabled) {
        Speech.speak("Workout complete");
      }
    } else if (restCompleted) {
      if (hapticCuesEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      }
      if (voiceCuesEnabled) {
        Speech.speak("Ready for the next set");
      }
    } else if (restStarted && hapticCuesEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    } else if (pauseChanged && hapticCuesEnabled) {
      Haptics.selectionAsync().catch(() => undefined);
    }

    previousCueStateRef.current = {
      paused,
      restSecondsLeft,
      workoutComplete,
    };
  }, [hapticCuesEnabled, paused, restSecondsLeft, voiceCuesEnabled, workoutComplete]);

  function handleFocusModeChange(mode: WorkoutFocusMode): void {
    setFocusModeState(mode);
    setWorkoutFocusMode(mode).catch(() => undefined);
  }

  return (
    <>
      <WorkoutStatusIsland
        detail={
          workoutComplete
            ? `${totalLoggedSets} of ${totalPlannedSets} sets logged`
            : paused
              ? "Paused - resume when ready"
              : `${currentExercise.name} - set ${Math.min(currentExercise.loggedSets + 1, currentExercise.plannedSets)} of ${currentExercise.plannedSets}`
        }
        state={workoutComplete ? "complete" : paused ? "paused" : "running"}
        theme={theme}
        title={workoutName}
      />
      <WorkoutFocusShell>
        <FocusModeSelector focusMode={focusMode} onChange={handleFocusModeChange} theme={theme} />

        {focusMode === "guided" ? (
          <GuidedWorkoutLayout>
            <FitnessSurface elevated style={styles.activeWorkout} theme={theme}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.eyebrow, { color: workoutComplete ? theme.success : theme.accent }]}>{workoutComplete ? "Workout complete" : "Active workout"}</Text>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {totalLoggedSets} of {totalPlannedSets} sets
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={handlePauseToggle}
          style={({ pressed }) => [styles.activeSmallButton, { backgroundColor: theme.surface3, borderColor: theme.border }, pressed && styles.pressed]}
        >
          <Text style={[styles.activeSmallButtonText, { color: theme.text }]}>{paused ? "Resume" : workoutComplete ? "Done" : "Pause"}</Text>
        </Pressable>
      </View>

      <View style={[styles.exerciseMedia, { backgroundColor: workoutComplete ? theme.successSoft : theme.accentSoft, borderColor: workoutComplete ? theme.success : theme.accentBorder }]}>
        <View style={[styles.exerciseMediaBar, { backgroundColor: theme.accentStrong }]} />
        <View style={[styles.exerciseMediaCircle, { backgroundColor: workoutComplete ? theme.success : theme.accentStrong }]} />
      </View>

      <View style={styles.guidedDataRow}>
        <DualWorkoutRings
          centerLabel={centerLabel}
          centerValue={centerValue}
          innerLabel={restSecondsLeft > 0 ? "Rest state" : "Current set"}
          innerProgress={phaseProgress}
          outerLabel="Workout"
          outerProgress={workoutProgress}
          size={132}
          theme={theme}
        />
        <View style={styles.guidedControls}>
          <View style={styles.setProgressRow}>
            <WorkoutInputChip label="Weight" theme={theme} value="40 kg" />
            <WorkoutInputChip label="Reps" theme={theme} value="10" />
            <WorkoutInputChip label="RPE" theme={theme} value="7" />
          </View>
          <View style={[styles.muscleShortcut, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
            <Text style={[styles.metricLabel, { color: theme.accentStrong }]}>Muscle map</Text>
            <Text numberOfLines={1} style={[styles.sectionHint, { color: theme.textMuted }]}>
              {currentExercise.muscleTags.join(", ")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.activeExerciseCopy}>
        <Text style={[styles.heroTitle, { color: theme.text }]}>{workoutComplete ? "Session complete" : currentExercise.name}</Text>
        <Text style={[styles.bodyText, { color: theme.textMuted }]}>
          {workoutComplete ? "Review your session, hydrate, and move into recovery." : currentExercise.cue}
        </Text>
        <View style={styles.heroTags}>
          {currentExercise.muscleTags.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
              <Text style={[styles.tagText, { color: theme.textMuted }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {workoutComplete ? (
        <WorkoutCompleteSummary
          theme={theme}
          totalDurationMinutes={totalDurationMinutes}
          totalExercises={totalExercises}
          totalLoggedSets={totalLoggedSets}
        />
      ) : (
        <View style={styles.setProgressRow}>
          <View style={[styles.setProgressBlock, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Sets</Text>
            <Text style={[styles.bridgeValue, { color: theme.text }]}>
              {currentExercise.loggedSets}/{currentExercise.plannedSets}
            </Text>
          </View>
          <View style={[styles.setProgressBlock, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Target</Text>
            <Text style={[styles.activeTargetText, { color: theme.text }]}>{currentExercise.target}</Text>
          </View>
          <View style={[styles.setProgressBlock, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Rest</Text>
            <Text style={[styles.activeTargetText, { color: restSecondsLeft > 0 ? theme.accentStrong : theme.text }]}>
              {restSecondsLeft > 0 ? formatDuration(restSecondsLeft) : `${currentExercise.restSeconds}s`}
            </Text>
          </View>
        </View>
      )}

      <TimerModeDock mode={timerMode} onChange={setTimerMode} restSecondsLeft={restSecondsLeft} theme={theme} />

      <View style={styles.activeControls}>
        <Pressable
          accessibilityRole="button"
          disabled={!canGoBack || workoutComplete}
          onPress={handlePrevious}
          style={({ pressed }) => [
            styles.activeControlButton,
            { backgroundColor: theme.surface3, borderColor: theme.border, opacity: canGoBack && !workoutComplete ? 1 : 0.45 },
            pressed && canGoBack && !workoutComplete && styles.pressed,
          ]}
        >
          <Text style={[styles.activeControlText, { color: theme.text }]}>Previous</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={!canLogSet}
          onPress={handleLogSet}
          style={({ pressed }) => [
            styles.activePrimaryButton,
            { backgroundColor: canLogSet ? theme.accentStrong : theme.surface3, opacity: canLogSet ? 1 : 0.62 },
            pressed && canLogSet && styles.pressed,
          ]}
        >
          <Text style={[styles.primaryButtonText, !canLogSet && { color: theme.textMuted }]}>
            {workoutComplete ? "Complete" : currentExerciseComplete ? "Set done" : "Log set"}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={!canGoNext || workoutComplete}
          onPress={handleNext}
          style={({ pressed }) => [
            styles.activeControlButton,
            { backgroundColor: theme.surface3, borderColor: theme.border, opacity: canGoNext && !workoutComplete ? 1 : 0.45 },
            pressed && canGoNext && !workoutComplete && styles.pressed,
          ]}
        >
          <Text style={[styles.activeControlText, { color: theme.text }]}>Next</Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          if (workoutComplete || confirmEnd) {
            handleEndWorkout();
            return;
          }

          setConfirmEnd(true);
        }}
        style={({ pressed }) => [
          workoutComplete || confirmEnd ? styles.doneWorkoutButton : styles.endWorkoutButton,
          (workoutComplete || confirmEnd) && { backgroundColor: workoutComplete ? theme.success : theme.accentStrong },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[workoutComplete || confirmEnd ? styles.doneWorkoutText : styles.endWorkoutText, { color: workoutComplete || confirmEnd ? "#FFFFFF" : theme.textMuted }]}>
          {endLabel}
        </Text>
      </Pressable>
      {confirmEnd && !workoutComplete ? (
        <Pressable accessibilityRole="button" onPress={() => setConfirmEnd(false)} style={({ pressed }) => [styles.cancelEndButton, pressed && styles.pressed]}>
          <Text style={[styles.endWorkoutText, { color: theme.textMuted }]}>Keep workout open</Text>
        </Pressable>
      ) : null}
            </FitnessSurface>
          </GuidedWorkoutLayout>
        ) : (
          <CompactWorkoutLayout
            canLogSet={canLogSet}
            centerLabel={centerLabel}
            centerValue={centerValue}
            currentExercise={currentExercise}
            endLabel={endLabel}
            hapticCuesEnabled={hapticCuesEnabled}
            innerProgress={phaseProgress}
            nextExerciseName={nextExerciseName}
            notes={notes}
            onEnd={() => {
              if (workoutComplete || confirmEnd) {
                handleEndWorkout();
                return;
              }

              setConfirmEnd(true);
            }}
            onLogSet={handleLogSet}
            onPauseToggle={handlePauseToggle}
            onSetHapticCuesEnabled={setHapticCuesEnabled}
            onSetNotes={setNotes}
            onSetSoundCuesEnabled={setSoundCuesEnabled}
            onSetVoiceCuesEnabled={setVoiceCuesEnabled}
            outerProgress={workoutProgress}
            paused={paused}
            restSecondsLeft={restSecondsLeft}
            soundCuesEnabled={soundCuesEnabled}
            theme={theme}
            totalLoggedSets={totalLoggedSets}
            totalPlannedSets={totalPlannedSets}
            voiceCuesEnabled={voiceCuesEnabled}
            workoutComplete={workoutComplete}
          />
        )}
      </WorkoutFocusShell>
    </>
  );
}

function WorkoutSessionProvider({
  children,
  onClose,
  sessionId,
}: PropsWithChildren<{
  onClose: () => void;
  sessionId: string;
}>): JSX.Element {
  const [paused, setPaused] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [restEndsAt, setRestEndsAt] = useState<number | null>(null);
  const [timerNowMs, setTimerNowMs] = useState(() => Date.now());
  const [loggedSetsByExerciseId, setLoggedSetsByExerciseId] = useState<Record<string, number>>(() =>
    Object.fromEntries(fitnessActiveWorkoutExercises.map((exercise) => [exercise.id, exercise.loggedSets])),
  );
  const baseExercise = fitnessActiveWorkoutExercises[currentExerciseIndex] ?? fitnessActiveWorkoutExercises[0];
  const currentExercise = {
    ...baseExercise,
    loggedSets: loggedSetsByExerciseId[baseExercise.id] ?? baseExercise.loggedSets,
  };
  const totalExercises = fitnessActiveWorkoutExercises.length;
  const totalLoggedSets = fitnessActiveWorkoutExercises.reduce((total, exercise) => total + (loggedSetsByExerciseId[exercise.id] ?? exercise.loggedSets), 0);
  const totalPlannedSets = fitnessActiveWorkoutExercises.reduce((total, exercise) => total + exercise.plannedSets, 0);
  const restSecondsLeft = restEndsAt === null ? 0 : Math.max(0, Math.ceil((restEndsAt - timerNowMs) / 1000));
  const canGoBack = currentExerciseIndex > 0;
  const canGoNext = currentExerciseIndex < totalExercises - 1;
  const currentExerciseComplete = currentExercise.loggedSets >= currentExercise.plannedSets;
  const canLogSet = !paused && !workoutComplete && !currentExerciseComplete;

  useEffect(() => {
    if (paused || restEndsAt === null || workoutComplete) {
      return undefined;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      setTimerNowMs(now);

      if (now >= restEndsAt) {
        setRestEndsAt(null);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [paused, restEndsAt, workoutComplete]);

  function handleEndWorkout(): void {
    setPaused(false);
    setWorkoutComplete(false);
    setCurrentExerciseIndex(0);
    setRestEndsAt(null);
    setLoggedSetsByExerciseId(Object.fromEntries(fitnessActiveWorkoutExercises.map((exercise) => [exercise.id, exercise.loggedSets])));
    onClose();
  }

  function handleLogSet(): void {
    if (!canLogSet) {
      return;
    }

    const nextLoggedSets = Math.min(currentExercise.plannedSets, currentExercise.loggedSets + 1);
    const nextMap = {
      ...loggedSetsByExerciseId,
      [currentExercise.id]: nextLoggedSets,
    };
    const nextTotalLoggedSets = fitnessActiveWorkoutExercises.reduce((total, exercise) => total + (nextMap[exercise.id] ?? exercise.loggedSets), 0);

    setLoggedSetsByExerciseId(nextMap);
    setRestEndsAt(nextLoggedSets >= currentExercise.plannedSets ? null : Date.now() + currentExercise.restSeconds * 1000);

    if (nextTotalLoggedSets >= totalPlannedSets) {
      setWorkoutComplete(true);
      setRestEndsAt(null);
      return;
    }

    if (nextLoggedSets >= currentExercise.plannedSets) {
      setCurrentExerciseIndex((index) => Math.min(index + 1, totalExercises - 1));
    }
  }

  function handleNext(): void {
    setCurrentExerciseIndex((index) => Math.min(index + 1, totalExercises - 1));
    setRestEndsAt(null);
  }

  function handlePauseToggle(): void {
    if (!workoutComplete) {
      setPaused((current) => !current);
    }
  }

  function handlePrevious(): void {
    setCurrentExerciseIndex((index) => Math.max(index - 1, 0));
    setRestEndsAt(null);
  }

  const value: WorkoutSessionContextValue = {
    canGoBack,
    canGoNext,
    canLogSet,
    currentExercise,
    currentExerciseComplete,
    currentExerciseIndex,
    handleEndWorkout,
    handleLogSet,
    handleNext,
    handlePauseToggle,
    handlePrevious,
    paused,
    restSecondsLeft,
    sessionId,
    totalExercises,
    totalLoggedSets,
    totalPlannedSets,
    workoutComplete,
  };

  return <WorkoutSessionContext.Provider value={value}>{children}</WorkoutSessionContext.Provider>;
}

function useWorkoutSession(): WorkoutSessionContextValue {
  const session = useContext(WorkoutSessionContext);

  if (!session) {
    throw new Error("useWorkoutSession must be used inside WorkoutSessionProvider");
  }

  return session;
}

function WorkoutFocusShell({ children }: PropsWithChildren): JSX.Element {
  return (
    <Animated.View layout={LinearTransition.duration(260)} style={styles.workoutFocusShell}>
      {children}
    </Animated.View>
  );
}

function GuidedWorkoutLayout({ children }: PropsWithChildren): JSX.Element {
  return <Animated.View layout={LinearTransition.duration(260)}>{children}</Animated.View>;
}

function FocusModeSelector({
  focusMode,
  onChange,
  theme,
}: {
  focusMode: WorkoutFocusMode;
  onChange: (mode: WorkoutFocusMode) => void;
  theme: FitnessTheme;
}): JSX.Element {
  const session = useContext(WorkoutSessionContext);

  return (
    <View style={[styles.focusModeSelector, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
      <View style={styles.flexCopy}>
        <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Workout focus</Text>
        <Text numberOfLines={1} style={[styles.sectionHint, { color: theme.textSubtle }]}>
          {session ? session.sessionId : "Session"}
        </Text>
      </View>
      {(["guided", "compact"] as const).map((mode) => {
        const active = mode === focusMode;

        return (
          <Pressable
            accessibilityRole="button"
            key={mode}
            onPress={() => onChange(mode)}
            style={({ pressed }) => [
              styles.focusModeButton,
              { backgroundColor: active ? theme.surface1 : "transparent" },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.focusModeText, { color: active ? theme.text : theme.textMuted }]}>{mode === "guided" ? "Guided" : "Compact"}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function WorkoutInputChip({ label, theme, value }: { label: string; theme: FitnessTheme; value: string }): JSX.Element {
  return (
    <View style={[styles.workoutInputChip, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
      <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.activeTargetText, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

function CueToggle({
  enabled,
  label,
  onChange,
  theme,
}: {
  enabled: boolean;
  label: string;
  onChange: (enabled: boolean) => void;
  theme: FitnessTheme;
}): JSX.Element {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      onPress={() => onChange(!enabled)}
      style={({ pressed }) => [
        styles.cueToggle,
        { backgroundColor: enabled ? theme.accentSoft : theme.surface3, borderColor: enabled ? theme.accentBorder : theme.border },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.cueToggleText, { color: enabled ? theme.accentStrong : theme.textMuted }]}>{label}</Text>
    </Pressable>
  );
}

function CompactWorkoutLayout({
  canLogSet,
  centerLabel,
  centerValue,
  currentExercise,
  endLabel,
  hapticCuesEnabled,
  innerProgress,
  nextExerciseName,
  notes,
  onEnd,
  onLogSet,
  onPauseToggle,
  onSetHapticCuesEnabled,
  onSetNotes,
  onSetSoundCuesEnabled,
  onSetVoiceCuesEnabled,
  outerProgress,
  paused,
  restSecondsLeft,
  soundCuesEnabled,
  theme,
  totalLoggedSets,
  totalPlannedSets,
  voiceCuesEnabled,
  workoutComplete,
}: {
  canLogSet: boolean;
  centerLabel: string;
  centerValue: string;
  currentExercise: FitnessExercise;
  endLabel: string;
  hapticCuesEnabled: boolean;
  innerProgress: number;
  nextExerciseName: string;
  notes: string;
  onEnd: () => void;
  onLogSet: () => void;
  onPauseToggle: () => void;
  onSetHapticCuesEnabled: (enabled: boolean) => void;
  onSetNotes: (notes: string) => void;
  onSetSoundCuesEnabled: (enabled: boolean) => void;
  onSetVoiceCuesEnabled: (enabled: boolean) => void;
  outerProgress: number;
  paused: boolean;
  restSecondsLeft: number;
  soundCuesEnabled: boolean;
  theme: FitnessTheme;
  totalLoggedSets: number;
  totalPlannedSets: number;
  voiceCuesEnabled: boolean;
  workoutComplete: boolean;
}): JSX.Element {
  return (
    <FitnessSurface elevated style={styles.compactWorkout} theme={theme}>
      <View style={styles.compactRingWrap}>
        <DualWorkoutRings
          centerLabel={centerLabel}
          centerValue={centerValue}
          innerLabel={restSecondsLeft > 0 ? "Rest" : "Set"}
          innerProgress={innerProgress}
          outerLabel="Workout"
          outerProgress={outerProgress}
          size={224}
          theme={theme}
        />
      </View>

      <View style={styles.compactCopy}>
        <Text style={[styles.eyebrow, { color: workoutComplete ? theme.success : theme.accent }]}>
          {workoutComplete ? "Workout complete" : paused ? "Paused" : "Hands-free"}
        </Text>
        <Text numberOfLines={1} style={[styles.heroTitle, { color: theme.text }]}>
          {workoutComplete ? "Session complete" : currentExercise.name}
        </Text>
        <Text numberOfLines={2} style={[styles.bodyText, { color: theme.textMuted }]}>
          {workoutComplete ? "Hydrate and recover." : currentExercise.cue}
        </Text>
        <Text style={[styles.sectionHint, { color: theme.textSubtle }]}>Heart rate unavailable until a live source is connected.</Text>
      </View>

      <View style={styles.compactControls}>
        <Pressable
          accessibilityRole="button"
          onPress={onPauseToggle}
          style={({ pressed }) => [styles.compactControlButton, { backgroundColor: theme.surface3, borderColor: theme.border }, pressed && styles.pressed]}
        >
          <Text style={[styles.compactControlText, { color: theme.text }]}>{paused ? "Resume" : "Pause"}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={!canLogSet}
          onPress={onLogSet}
          style={({ pressed }) => [
            styles.compactLogButton,
            { backgroundColor: canLogSet ? theme.accentStrong : theme.surface3, opacity: canLogSet ? 1 : 0.62 },
            pressed && canLogSet && styles.pressed,
          ]}
        >
          <Text style={[styles.primaryButtonText, !canLogSet && { color: theme.textMuted }]}>{workoutComplete ? "Complete" : "Log set"}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onEnd}
          style={({ pressed }) => [styles.compactControlButton, { backgroundColor: theme.surface3, borderColor: theme.border }, pressed && styles.pressed]}
        >
          <Text style={[styles.compactControlText, { color: theme.text }]}>{endLabel === "End workout" ? "Skip" : endLabel}</Text>
        </Pressable>
      </View>

      <View style={[styles.nextPreview, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
        <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Next</Text>
        <Text numberOfLines={1} style={[styles.planSettingValue, { color: theme.text }]}>{nextExerciseName}</Text>
      </View>

      <View style={styles.cueRow}>
        <CueToggle enabled={voiceCuesEnabled} label="Voice" onChange={onSetVoiceCuesEnabled} theme={theme} />
        <CueToggle enabled={hapticCuesEnabled} label="Haptic" onChange={onSetHapticCuesEnabled} theme={theme} />
        <CueToggle enabled={soundCuesEnabled} label="Sound" onChange={onSetSoundCuesEnabled} theme={theme} />
      </View>

      <TextInput
        multiline
        onChangeText={onSetNotes}
        placeholder="Session notes"
        placeholderTextColor={theme.textSubtle}
        style={[styles.workoutNotes, { backgroundColor: theme.surface3, borderColor: theme.border, color: theme.text }]}
        value={notes}
      />
    </FitnessSurface>
  );
}

function WorkoutCompleteSummary({
  theme,
  totalDurationMinutes,
  totalExercises,
  totalLoggedSets,
}: {
  theme: FitnessTheme;
  totalDurationMinutes: number;
  totalExercises: number;
  totalLoggedSets: number;
}): JSX.Element {
  return (
    <View style={styles.completionSummary}>
      <View style={[styles.completionMetric, { backgroundColor: theme.successSoft, borderColor: theme.success }]}>
        <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Duration</Text>
        <Text style={[styles.completionValue, { color: theme.success }]}>{totalDurationMinutes}m</Text>
      </View>
      <View style={[styles.completionMetric, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
        <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Exercises</Text>
        <Text style={[styles.completionValue, { color: theme.text }]}>{totalExercises}</Text>
      </View>
      <View style={[styles.completionMetric, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
        <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Sets</Text>
        <Text style={[styles.completionValue, { color: theme.text }]}>{totalLoggedSets}</Text>
      </View>
      <View style={[styles.recoveryNote, { backgroundColor: theme.recoverySoft, borderColor: theme.recovery }]}>
        <Text style={[styles.metricLabel, { color: theme.recovery }]}>Recovery next</Text>
        <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Log water, protein, and a short cooldown when you are ready.</Text>
      </View>
    </View>
  );
}

function TimerModeDock({
  mode,
  onChange,
  restSecondsLeft,
  theme,
}: {
  mode: FitnessTimerMode;
  onChange: (mode: FitnessTimerMode) => void;
  restSecondsLeft: number;
  theme: FitnessTheme;
}): JSX.Element {
  const timerText = mode === "Rest" ? (restSecondsLeft > 0 ? formatDuration(restSecondsLeft) : "Ready") : "Manual";
  const detail =
    mode === "Rest"
      ? "Rest starts after logged sets."
      : mode === "Stopwatch"
        ? "Use for timed holds or steady cardio."
        : mode === "Interval"
          ? "Prepared for custom work/rest blocks."
          : mode === "EMOM"
            ? "Every-minute pacing placeholder."
            : "As many rounds as planned.";

  return (
    <View style={[styles.timerDock, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Timer</Text>
          <Text style={[styles.timerValue, { color: mode === "Rest" && restSecondsLeft > 0 ? theme.accentStrong : theme.text }]}>{timerText}</Text>
        </View>
        <Text numberOfLines={2} style={[styles.timerDetail, { color: theme.textMuted }]}>
          {detail}
        </Text>
      </View>
      <View style={styles.timerModeRail}>
        {fitnessTimerModes.map((item) => {
          const active = item === mode;

          return (
            <Pressable
              accessibilityRole="button"
              key={item}
              onPress={() => onChange(item)}
              style={({ pressed }) => [
                styles.timerModeChip,
                { backgroundColor: active ? theme.accentSoft : theme.surface1, borderColor: active ? theme.accentBorder : theme.border },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.timerModeText, { color: active ? theme.accentStrong : theme.textMuted }]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function BodyLoadPreview({ isDark, muscleHeat, theme }: { isDark: boolean; muscleHeat: MuscleHeatValue[]; theme: FitnessTheme }): JSX.Element {
  const [side, setSide] = useState<BodyMapSide>("front");
  const [variant, setVariant] = useState<BodyMapVariant>("male");
  const [mode, setMode] = useState<BodyLoadMode>("today");
  const [inspectedMuscleId, setInspectedMuscleId] = useState<string | null>(null);
  const displayHeat = getBodyLoadModeHeat(muscleHeat, mode);
  const activeMuscles = displayHeat.filter((item) => item.load > 0);
  const highestLoad = activeMuscles.reduce((max, item) => Math.max(max, item.load), 0);
  const inspectedMuscle = activeMuscles.find((item) => item.muscleId === inspectedMuscleId) ?? activeMuscles[0] ?? null;
  const summary = activeMuscles
    .slice()
    .sort((a, b) => b.load - a.load)
    .slice(0, 3)
    .map((item) => formatMuscleName(item.muscleId))
    .join(", ");

  return (
    <FitnessSurface elevated style={styles.bodyLoad} theme={theme}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Body load</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Muscles trained today and this week</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
          <Text style={[styles.statusPillText, { color: theme.accentStrong }]}>Upper focus</Text>
        </View>
      </View>
      <View style={styles.bodyMapControls}>
        <SegmentedToggle
          onChange={setSide}
          options={[
            { label: "Front", value: "front" },
            { label: "Back", value: "back" },
          ]}
          selected={side}
          theme={theme}
        />
        <SegmentedToggle
          onChange={setVariant}
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
          selected={variant}
          theme={theme}
        />
      </View>
      <SegmentedToggle
        onChange={setMode}
        options={[
          { label: "Target", value: "target" },
          { label: "Today", value: "today" },
          { label: "Week", value: "week" },
          { label: "Recovery", value: "recovery" },
        ]}
        selected={mode}
        theme={theme}
      />

      <View style={styles.bodyMapDetail}>
        <Pressable
          accessibilityLabel={`Body load map. ${summary || "No loaded muscles yet"}. Tap to inspect the next muscle.`}
          accessibilityRole="button"
          onPress={() => {
            if (activeMuscles.length === 0) {
              setInspectedMuscleId(null);
              return;
            }

            const currentIndex = activeMuscles.findIndex((item) => item.muscleId === inspectedMuscle?.muscleId);
            const next = activeMuscles[(currentIndex + 1) % activeMuscles.length];
            setInspectedMuscleId(next.muscleId);
          }}
          style={({ pressed }) => [styles.bodyMapPressable, pressed && styles.pressed]}
        >
          <FitnessBodyMap
            accent={theme.accentStrong}
            borderColor={theme.border}
            isDark={isDark}
            muscleHeat={displayHeat}
            side={side}
            style={styles.bodyMapLarge}
            variant={variant}
          />
        </Pressable>
        <View style={styles.bodyMapSummary}>
          <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Load summary</Text>
          <Text style={[styles.bodyMapSummaryValue, { color: theme.text }]}>{highestLoad}/4</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>{summary || "No loaded muscles yet"}</Text>
          <View style={[styles.bodyMapInspect, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Inspect</Text>
            <Text numberOfLines={1} style={[styles.planSettingValue, { color: theme.text }]}>
              {inspectedMuscle ? formatMuscleName(inspectedMuscle.muscleId) : "Tap map"}
            </Text>
            <Text style={[styles.sectionHint, { color: theme.textSubtle }]}>
              {inspectedMuscle ? `${inspectedMuscle.state ?? mode} load ${inspectedMuscle.load}/4` : "No current load"}
            </Text>
          </View>
          <View style={styles.loadLegend}>
            {[1, 2, 3, 4].map((level) => (
              <View key={level} style={styles.loadLegendRow}>
                <View
                  style={[
                    styles.loadLegendDot,
                    {
                      backgroundColor: level <= highestLoad ? theme.accentStrong : theme.surface3,
                      borderColor: theme.border,
                      opacity: level <= highestLoad ? 1 : 0.62,
                    },
                  ]}
                />
                <Text style={[styles.loadLegendText, { color: theme.textMuted }]}>Level {level}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </FitnessSurface>
  );
}

function getBodyLoadModeHeat(muscleHeat: MuscleHeatValue[], mode: BodyLoadMode): MuscleHeatValue[] {
  if (mode === "today") {
    return muscleHeat;
  }

  if (mode === "target") {
    return muscleHeat.map((item) => ({
      ...item,
      load: item.state === "target" ? 4 : 0,
      state: item.state === "target" ? "target" : item.state,
    }));
  }

  if (mode === "recovery") {
    return muscleHeat.map((item) => ({
      ...item,
      load: item.state === "recovering" || item.state === "sore" ? toMuscleLoad(Math.max(2, item.load)) : 0,
      state: item.state === "sore" ? "sore" : item.state === "recovering" ? "recovering" : item.state,
    }));
  }

  return muscleHeat.map((item) => ({
    ...item,
    load: toMuscleLoad(item.load + (item.state === "trained" ? 1 : 0)),
    state: item.state === "target" ? "trained" : item.state,
  }));
}

function toMuscleLoad(value: number): MuscleHeatValue["load"] {
  return Math.max(0, Math.min(4, Math.round(value))) as MuscleHeatValue["load"];
}

function SegmentedToggle<T extends string>({
  onChange,
  options,
  selected,
  theme,
}: {
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
  selected: T;
  theme: FitnessTheme;
}): JSX.Element {
  return (
    <View style={[styles.segmentedToggle, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
      {options.map((option) => {
        const active = option.value === selected;

        return (
          <Pressable
            accessibilityRole="button"
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segmentedToggleButton,
              { backgroundColor: active ? theme.surface1 : "transparent" },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.segmentedToggleText, { color: active ? theme.text : theme.textMuted }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function formatMuscleName(muscleId: string): string {
  return muscleId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ContinuePlanRail({ theme }: { theme: FitnessTheme }): JSX.Element {
  return (
    <View style={styles.railSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Continue your plan</Text>
        <Text style={[styles.sectionHint, { color: theme.textSubtle }]}>Next up</Text>
      </View>
      <ScrollView contentContainerStyle={styles.planRail} horizontal showsHorizontalScrollIndicator={false}>
        {fitnessPlanRailItems.map((item) => (
          <PlanRailCard item={item} key={item.id} theme={theme} />
        ))}
      </ScrollView>
    </View>
  );
}

function PlanRailCard({ item, theme }: { item: FitnessPlanRailItem; theme: FitnessTheme }): JSX.Element {
  const color = item.tone === "recovery" ? theme.recovery : item.tone === "success" ? theme.success : item.tone === "info" ? theme.info : theme.accent;
  const soft =
    item.tone === "recovery" ? theme.recoverySoft : item.tone === "success" ? theme.successSoft : item.tone === "info" ? theme.infoSoft : theme.accentSoft;

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.planRailCard,
        { backgroundColor: theme.surface1, borderColor: theme.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.planRailVisual, { backgroundColor: soft }]}>
        <View style={[styles.planRailMarkLarge, { backgroundColor: color }]} />
        <View style={[styles.planRailMarkSmall, { backgroundColor: color }]} />
      </View>
      <View style={styles.planRailCopy}>
        <Text style={[styles.metricLabel, { color }]}>{item.label}</Text>
        <Text numberOfLines={1} style={[styles.sessionTitle, { color: theme.text }]}>
          {item.title}
        </Text>
        <Text numberOfLines={2} style={[styles.sectionHint, { color: theme.textMuted }]}>
          {item.subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

function AchievementCapsule({ achievement, theme }: { achievement: FitnessAchievement; theme: FitnessTheme }): JSX.Element {
  return (
    <FitnessSurface style={styles.achievementCapsule} theme={theme}>
      <View style={[styles.achievementIcon, { backgroundColor: theme.successSoft, borderColor: theme.success }]}>
        <Text style={[styles.achievementIconText, { color: theme.success }]}>OK</Text>
      </View>
      <View style={styles.flexCopy}>
        <Text style={[styles.sessionTitle, { color: theme.text }]}>{achievement.title}</Text>
        <Text style={[styles.sectionHint, { color: theme.textMuted }]}>{achievement.detail}</Text>
      </View>
    </FitnessSurface>
  );
}

function TabPlaceholder({ tab, theme }: { tab: FitnessTab; theme: FitnessTheme }): JSX.Element {
  if (tab === "train") {
    return <TrainTab theme={theme} />;
  }

  if (tab === "explore") {
    return <ExploreTab theme={theme} />;
  }

  if (tab === "progress") {
    return <ProgressTab theme={theme} />;
  }

  return (
    <FitnessSurface elevated style={styles.placeholder} theme={theme}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Today</Text>
    </FitnessSurface>
  );
}

function TrainTab({ theme }: { theme: FitnessTheme }): JSX.Element {
  const router = useRouter();
  const [selectedPlanTool, setSelectedPlanTool] = useState<string | null>(null);

  return (
    <>
      <FitnessSurface elevated style={styles.trainHeroCard} theme={theme}>
        <View style={[styles.trainHeroVisual, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
          <View style={[styles.trainHeroBlockLarge, { backgroundColor: theme.accentStrong }]} />
          <View style={[styles.trainHeroBlockSmall, { backgroundColor: theme.recovery }]} />
          <Text style={[styles.trainHeroVisualLabel, { color: theme.accentStrong }]}>Programme</Text>
        </View>
        <View style={styles.sectionHeader}>
          <View style={styles.flexCopy}>
            <Text style={[styles.eyebrow, { color: theme.accent }]}>{fitnessPlanSummary.weekLabel}</Text>
            <Text style={[styles.heroTitle, { color: theme.text }]}>{fitnessPlanSummary.name}</Text>
            <Text style={[styles.bodyText, { color: theme.textMuted }]}>{fitnessPlanSummary.goal}</Text>
          </View>
          <View style={[styles.progressBadge, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
            <Text style={[styles.progressValue, { color: theme.accentStrong }]}>{fitnessPlanSummary.completionPercent}%</Text>
            <Text style={[styles.progressLabel, { color: theme.textMuted }]}>done</Text>
          </View>
        </View>
        <View style={[styles.phaseProgressPanel, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.flexCopy}>
              <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Current phase</Text>
              <Text style={[styles.planMetaValue, { color: theme.text }]}>Build consistency</Text>
            </View>
            <Text style={[styles.sectionHint, { color: theme.textSubtle }]}>Week 3 of 5</Text>
          </View>
          <View style={[styles.phaseTrack, { backgroundColor: theme.surface2 }]}>
            <View style={[styles.phaseFill, { backgroundColor: theme.accentStrong, width: `${fitnessPlanSummary.completionPercent}%` }]} />
          </View>
        </View>
        <View style={styles.planMetaRow}>
          <PlanMeta label="Next" theme={theme} value={fitnessPlanSummary.nextSession} />
          <PlanMeta label="Weekly time" theme={theme} value={fitnessPlanSummary.expectedWeeklyTime} />
        </View>
        <View style={styles.planActionRow}>
          <PlanActionButton label="Open next session" primary theme={theme} onPress={() => router.push(`/fitness/session/placeholder-session-${fitnessTodayData.workout.id}` as Parameters<typeof router.push>[0])} />
          <PlanActionButton label="Download offline" theme={theme} onPress={() => setSelectedPlanTool("Download workouts")} />
        </View>
      </FitnessSurface>

      <FitnessSurface style={styles.weeklyGoalCard} theme={theme}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Weekly goal</Text>
            <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Planned sessions and recovery days</Text>
          </View>
          <Text style={[styles.weeklyGoalCount, { color: theme.accentStrong }]}>{fitnessWeeklyGoalDays.filter((day) => day.completed).length}/4</Text>
        </View>
        <WeeklyGoalTracker days={fitnessWeeklyGoalDays} theme={theme} />
      </FitnessSurface>

      <PlanCalendarCard days={fitnessPlanCalendarDays} theme={theme} />

      <PlanToolsCard onSelect={setSelectedPlanTool} selectedTool={selectedPlanTool} theme={theme} />

      <FitnessSurface style={styles.planSettingsCard} theme={theme}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Plan settings</Text>
          <Text style={[styles.sectionHint, { color: theme.textSubtle }]}>Editable later</Text>
        </View>
        <View style={styles.planSettingsGrid}>
          {fitnessPlanSettings.map((setting) => (
            <PlanSettingChip key={setting.label} setting={setting} theme={theme} />
          ))}
        </View>
      </FitnessSurface>

      <SubstitutionCard substitutions={fitnessSubstitutions} theme={theme} />

      <FitnessSurface style={styles.sessionList} theme={theme}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Next sessions</Text>
          <Text style={[styles.sectionHint, { color: theme.textSubtle }]}>Plan</Text>
        </View>
        {fitnessPlanSummary.sessions.map((session) => (
          <PlanSessionRow key={session.id} session={session} theme={theme} />
        ))}
      </FitnessSurface>
      <PlanToolSheet onClose={() => setSelectedPlanTool(null)} selectedTool={selectedPlanTool} theme={theme} />
    </>
  );
}

function PlanMeta({ label, theme, value }: { label: string; theme: FitnessTheme; value: string }): JSX.Element {
  return (
    <View style={[styles.planMeta, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
      <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text numberOfLines={1} style={[styles.planMetaValue, { color: theme.text }]}>
        {value}
      </Text>
    </View>
  );
}

function PlanActionButton({ label, onPress, primary = false, theme }: { label: string; onPress?: () => void; primary?: boolean; theme: FitnessTheme }): JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.planActionButton,
        { backgroundColor: primary ? theme.accentStrong : theme.surface3, borderColor: primary ? theme.accentStrong : theme.border },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.planActionText, { color: primary ? "#FFFFFF" : theme.text }]}>{label}</Text>
    </Pressable>
  );
}

function PlanToolsCard({
  onSelect,
  selectedTool,
  theme,
}: {
  onSelect: (tool: string) => void;
  selectedTool: string | null;
  theme: FitnessTheme;
}): JSX.Element {
  const tools = [
    { detail: "Tune days, duration, or intensity", label: "Adjust plan", tone: theme.accent },
    { detail: "Move this week around safely", label: "Reschedule week", tone: theme.info },
    { detail: "Swap movements around soreness", label: "Substitute exercises", tone: theme.recovery },
    { detail: "Lower load without losing rhythm", label: "Deload week", tone: theme.success },
    { detail: "Temporarily stop programme prompts", label: "Pause plan", tone: theme.textSubtle },
  ];

  return (
    <FitnessSurface style={styles.planToolsCard} theme={theme}>
      <View style={styles.sectionHeader}>
        <View style={styles.flexCopy}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Plan tools</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Every change is previewed before it affects your programme.</Text>
        </View>
      </View>
      <View style={styles.planToolsGrid}>
        {tools.map((tool) => {
          const active = selectedTool === tool.label;

          return (
            <Pressable
              accessibilityRole="button"
              key={tool.label}
              onPress={() => onSelect(tool.label)}
              style={({ pressed }) => [
                styles.planToolButton,
                {
                  backgroundColor: active ? theme.accentSoft : theme.surface3,
                  borderColor: active ? theme.accentBorder : theme.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.planToolDot, { backgroundColor: tool.tone }]} />
              <Text style={[styles.planToolTitle, { color: theme.text }]}>{tool.label}</Text>
              <Text style={[styles.planToolDetail, { color: theme.textMuted }]}>{tool.detail}</Text>
            </Pressable>
          );
        })}
      </View>
    </FitnessSurface>
  );
}

function PlanToolSheet({ onClose, selectedTool, theme }: { onClose: () => void; selectedTool: string | null; theme: FitnessTheme }): JSX.Element {
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={Boolean(selectedTool)}>
      <Pressable accessibilityLabel="Close plan tool preview" accessibilityRole="button" onPress={onClose} style={styles.adjustSheetScrim} />
      <View style={[styles.adjustSheet, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
        <View style={styles.sheetHandle} />
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{selectedTool ?? "Plan tool"}</Text>
        <View style={[styles.adjustPreview, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
          <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Preview only</Text>
          <Text style={[styles.bodyText, { color: theme.text }]}>
            This phase shows the control boundary. Applying this change will require programme persistence in a later backend phase.
          </Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onClose} style={({ pressed }) => [styles.applyAdjustButton, { backgroundColor: theme.accentStrong }, pressed && styles.pressed]}>
          <Text style={styles.primaryButtonText}>Keep current plan</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function PlanCalendarCard({ days, theme }: { days: FitnessPlanCalendarDay[]; theme: FitnessTheme }): JSX.Element {
  return (
    <FitnessSurface style={styles.planCalendarCard} theme={theme}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Plan calendar</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>This week at a glance</Text>
        </View>
        <Text style={[styles.sectionHint, { color: theme.textSubtle }]}>Editable later</Text>
      </View>
      <View style={styles.planCalendarGrid}>
        {days.map((day) => (
          <PlanCalendarDay key={`${day.dayLabel}-${day.dateLabel}`} day={day} theme={theme} />
        ))}
      </View>
    </FitnessSurface>
  );
}

function PlanCalendarDay({ day, theme }: { day: FitnessPlanCalendarDay; theme: FitnessTheme }): JSX.Element {
  const active = day.status === "next";
  const completed = day.status === "completed";
  const color = completed ? theme.success : active ? theme.accentStrong : day.status === "scheduled" ? theme.info : theme.textSubtle;
  const soft = completed ? theme.successSoft : active ? theme.accentSoft : day.status === "scheduled" ? theme.infoSoft : theme.surface3;

  return (
    <View style={[styles.planCalendarDay, { backgroundColor: soft, borderColor: active ? theme.accentBorder : theme.border }]}>
      <Text style={[styles.metricLabel, { color }]}>{day.dayLabel}</Text>
      <Text style={[styles.planCalendarDate, { color: theme.text }]}>{day.dateLabel}</Text>
      <Text numberOfLines={2} style={[styles.planCalendarFocus, { color: theme.textMuted }]}>
        {day.focus}
      </Text>
    </View>
  );
}

function SubstitutionCard({ substitutions, theme }: { substitutions: FitnessSubstitution[]; theme: FitnessTheme }): JSX.Element {
  return (
    <FitnessSurface style={styles.substitutionCard} theme={theme}>
      <View style={styles.sectionHeader}>
        <View style={styles.flexCopy}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Substitutions</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Visible alternatives keep gestures optional.</Text>
        </View>
      </View>
      {substitutions.map((substitution) => (
        <SubstitutionRow key={substitution.id} substitution={substitution} theme={theme} />
      ))}
    </FitnessSurface>
  );
}

function SubstitutionRow({ substitution, theme }: { substitution: FitnessSubstitution; theme: FitnessTheme }): JSX.Element {
  const color =
    substitution.tone === "recovery" ? theme.recovery : substitution.tone === "success" ? theme.success : substitution.tone === "info" ? theme.info : theme.accent;
  const soft =
    substitution.tone === "recovery" ? theme.recoverySoft : substitution.tone === "success" ? theme.successSoft : substitution.tone === "info" ? theme.infoSoft : theme.accentSoft;

  return (
    <View style={[styles.substitutionRow, { borderColor: theme.border }]}>
      <View style={styles.flexCopy}>
        <Text style={[styles.sessionTitle, { color: theme.text }]}>{substitution.title}</Text>
        <Text style={[styles.sectionHint, { color: theme.textMuted }]}>{substitution.detail}</Text>
      </View>
      <View style={[styles.adjustBadge, { backgroundColor: soft, borderColor: color }]}>
        <Text style={[styles.adjustBadgeText, { color }]}>{substitution.durationLabel}</Text>
      </View>
    </View>
  );
}

function WeeklyGoalTracker({ days, theme }: { days: FitnessWeeklyGoalDay[]; theme: FitnessTheme }): JSX.Element {
  return (
    <View style={styles.weeklyGoalTracker}>
      {days.map((day, index) => {
        const label = day.day === "T2" ? "T" : day.day === "S2" ? "S" : day.day;
        const filled = day.planned && day.completed;
        const planned = day.planned && !day.completed;

        return (
          <View key={`${day.day}-${index}`} style={styles.weeklyGoalDay}>
            <Text style={[styles.weeklyGoalDayLabel, { color: day.planned ? theme.text : theme.textSubtle }]}>{label}</Text>
            <View
              style={[
                styles.weeklyGoalDot,
                {
                  backgroundColor: filled ? theme.accentStrong : planned ? "transparent" : theme.surface3,
                  borderColor: day.planned ? theme.accentStrong : theme.border,
                  opacity: day.planned ? 1 : 0.58,
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

function PlanSettingChip({ setting, theme }: { setting: FitnessPlanSetting; theme: FitnessTheme }): JSX.Element {
  const color = setting.tone === "recovery" ? theme.recovery : setting.tone === "success" ? theme.success : setting.tone === "info" ? theme.info : theme.accent;
  const soft =
    setting.tone === "recovery" ? theme.recoverySoft : setting.tone === "success" ? theme.successSoft : setting.tone === "info" ? theme.infoSoft : theme.accentSoft;

  return (
    <View style={[styles.planSettingChip, { backgroundColor: soft, borderColor: color }]}>
      <Text style={[styles.metricLabel, { color }]}>{setting.label}</Text>
      <Text numberOfLines={1} style={[styles.planSettingValue, { color: theme.text }]}>
        {setting.value}
      </Text>
    </View>
  );
}

function PlanSessionRow({ session, theme }: { session: FitnessPlanSession; theme: FitnessTheme }): JSX.Element {
  const next = session.state === "next";
  const stateColor = next ? theme.accentStrong : session.state === "scheduled" ? theme.info : theme.recovery;
  const stateSoft = next ? theme.accentSoft : session.state === "scheduled" ? theme.infoSoft : theme.recoverySoft;

  return (
    <View style={[styles.sessionRow, { borderColor: theme.border }]}>
      <View style={[styles.sessionDate, { backgroundColor: next ? theme.accentSoft : theme.surface3, borderColor: next ? theme.accentBorder : theme.border }]}>
        <Text style={[styles.sessionDateText, { color: next ? theme.accentStrong : theme.textMuted }]}>{session.dayLabel}</Text>
      </View>
      <View style={[styles.sessionThumb, { backgroundColor: stateSoft, borderColor: stateColor }]}>
        <View style={[styles.sessionThumbMark, { backgroundColor: stateColor }]} />
      </View>
      <View style={styles.flexCopy}>
        <Text style={[styles.sessionTitle, { color: theme.text }]}>{session.title}</Text>
        <Text numberOfLines={1} style={[styles.sectionHint, { color: theme.textMuted }]}>
          {`${session.durationMinutes} min - ${session.focus}`}
        </Text>
      </View>
      <View style={[styles.sessionStatePill, { backgroundColor: stateSoft, borderColor: stateColor }]}>
        <Text style={[styles.sessionStateText, { color: stateColor }]}>{next ? "Next" : session.state}</Text>
      </View>
    </View>
  );
}

function ExploreTab({ theme }: { theme: FitnessTheme }): JSX.Element {
  const filters = ["For you", "Strength", "Weight Loss", "Cardio", "Mobility", "Beginner", "No Equipment", "Short Workouts"];
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("For you");
  const [showFilters, setShowFilters] = useState(false);
  const [savedItemIds, setSavedItemIds] = useState<Set<string>>(() => new Set(["short-strength"]));
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = fitnessExploreItems.filter((item) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.subtitle.toLowerCase().includes(normalizedQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
    const matchesFilter =
      activeFilter === "For you" ||
      item.tags.some((tag) => tag.toLowerCase() === activeFilter.toLowerCase()) ||
      item.category.toLowerCase() === activeFilter.toLowerCase();

    return matchesQuery && matchesFilter;
  });
  const recommendedItems = fitnessExploreItems.filter((item) => item.category === "For you").slice(0, 4);
  const groupedItems = filteredItems.reduce<Record<string, FitnessExploreItem[]>>((groups, item) => {
    groups[item.category] = [...(groups[item.category] ?? []), item];
    return groups;
  }, {});
  const selectedFilters = [activeFilter !== "For you" ? activeFilter : null, normalizedQuery.length > 0 ? query.trim() : null].filter(
    (label): label is string => Boolean(label),
  );

  function toggleSaved(itemId: string): void {
    setSavedItemIds((current) => {
      const next = new Set(current);

      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }

      return next;
    });
  }

  return (
    <>
      <FitnessSurface elevated style={styles.exploreHeroCard} theme={theme}>
        <View style={[styles.exploreHeroVisual, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
          <View style={[styles.exploreHeroBlock, { backgroundColor: theme.accentStrong }]} />
          <View style={[styles.exploreHeroDot, { backgroundColor: theme.info }]} />
          <Text style={[styles.exploreHeroLabel, { color: theme.accentStrong }]}>Discover</Text>
        </View>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Find what fits today</Text>
        <Text style={[styles.bodyText, { color: theme.textMuted }]}>Image-led programmes, short sessions, no-equipment options, mobility, and exercise library results matched to your constraints.</Text>
        <View style={[styles.searchField, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
          <Text style={[styles.searchIcon, { color: theme.textSubtle }]}>Search</Text>
          <TextInput
            accessibilityLabel="Search workouts"
            onChangeText={setQuery}
            placeholder="Exercise, muscle, equipment"
            placeholderTextColor={theme.textSubtle}
            style={[styles.searchInput, { color: theme.text }]}
            value={query}
          />
        </View>
        <View style={styles.filterRail}>
          {filters.map((label) => (
            <Pressable
              accessibilityRole="button"
              key={label}
              onPress={() => setActiveFilter(label)}
                style={({ pressed }) => [
                  styles.tag,
                  {
                    backgroundColor: activeFilter === label ? theme.accentSoft : theme.surface3,
                    borderColor: activeFilter === label ? theme.accentBorder : theme.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.tagText, { color: activeFilter === label ? theme.accentStrong : theme.textMuted }]}>{label}</Text>
            </Pressable>
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowFilters((open) => !open)}
            style={({ pressed }) => [
              styles.tag,
              { backgroundColor: showFilters ? theme.infoSoft : theme.surface3, borderColor: showFilters ? theme.info : theme.border },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.tagText, { color: showFilters ? theme.info : theme.textMuted }]}>{showFilters ? "Hide filters" : "More filters"}</Text>
          </Pressable>
        </View>
        {selectedFilters.length > 0 ? (
          <View style={styles.selectedFilterRow}>
            {selectedFilters.map((label) => (
              <Pressable
                accessibilityRole="button"
                key={label}
                onPress={() => {
                  if (label === activeFilter) {
                    setActiveFilter("For you");
                  } else {
                    setQuery("");
                  }
                }}
                style={({ pressed }) => [
                  styles.selectedFilter,
                  { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.selectedFilterText, { color: theme.accentStrong }]}>{label} x</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </FitnessSurface>

      <View style={styles.exploreSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recommended for you</Text>
          <Text style={[styles.sectionHint, { color: theme.textSubtle }]}>Plan matched</Text>
        </View>
        <ScrollView contentContainerStyle={styles.recommendedRail} horizontal showsHorizontalScrollIndicator={false}>
          {recommendedItems.map((item) => (
            <ExploreProgrammeCard
              isSaved={savedItemIds.has(item.id)}
              item={item}
              key={item.id}
              onToggleSaved={() => toggleSaved(item.id)}
              theme={theme}
            />
          ))}
        </ScrollView>
      </View>

      {filteredItems.length === 0 ? (
        <FitnessSurface style={styles.emptyExploreCard} theme={theme}>
          <Text style={[styles.sessionTitle, { color: theme.text }]}>No workouts found</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Try a different muscle, goal, or equipment filter.</Text>
        </FitnessSurface>
      ) : (
        Object.entries(groupedItems).map(([category, items]) => (
          <View key={category} style={styles.exploreSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{category}</Text>
              <Text style={[styles.sectionHint, { color: theme.textSubtle }]}>{items.length} shown</Text>
            </View>
            {items.map((item) => (
              <ExploreCard
                isSaved={savedItemIds.has(item.id)}
                item={item}
                key={item.id}
                onToggleSaved={() => toggleSaved(item.id)}
                theme={theme}
              />
            ))}
          </View>
        ))
      )}
      <FitnessSurface style={styles.exerciseLibraryBoundary} theme={theme}>
        <View style={styles.sectionHeader}>
          <View style={styles.flexCopy}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Exercise library</Text>
            <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Virtualized list boundary for the complete library.</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: theme.infoSoft, borderColor: theme.info }]}>
            <Text style={[styles.statusPillText, { color: theme.info }]}>Deferred</Text>
          </View>
        </View>
        <Text style={[styles.bodyText, { color: theme.textMuted }]}>Full exercise-library rendering should move to a virtualized list when real library data is connected.</Text>
      </FitnessSurface>
      <ExploreFilterSheet
        activeFilter={activeFilter}
        filters={filters}
        onClose={() => setShowFilters(false)}
        onSelect={(filter) => {
          setActiveFilter(filter);
          setShowFilters(false);
        }}
        theme={theme}
        visible={showFilters}
      />
    </>
  );
}

function ExploreFilterSheet({
  activeFilter,
  filters,
  onClose,
  onSelect,
  theme,
  visible,
}: {
  activeFilter: string;
  filters: string[];
  onClose: () => void;
  onSelect: (filter: string) => void;
  theme: FitnessTheme;
  visible: boolean;
}): JSX.Element {
  const rows = [
    { label: "Duration", value: "10-45 min" },
    { label: "Level", value: "Beginner to intermediate" },
    { label: "Equipment", value: "Dumbbells, bench, bodyweight" },
    { label: "Safety", value: "Shoulder-aware options visible" },
  ];

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <Pressable accessibilityLabel="Close explore filters" accessibilityRole="button" onPress={onClose} style={styles.adjustSheetScrim} />
      <View style={[styles.adjustSheet, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
        <View style={styles.sheetHandle} />
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore filters</Text>
        <View style={styles.filterRail}>
          {filters.map((filter) => {
            const active = filter === activeFilter;

            return (
              <Pressable
                accessibilityRole="button"
                key={filter}
                onPress={() => onSelect(filter)}
                style={({ pressed }) => [
                  styles.tag,
                  {
                    backgroundColor: active ? theme.accentSoft : theme.surface3,
                    borderColor: active ? theme.accentBorder : theme.border,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.tagText, { color: active ? theme.accentStrong : theme.textMuted }]}>{filter}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={[styles.filterPanel, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
          {rows.map((row) => (
            <View key={row.label} style={styles.filterPanelRow}>
              <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{row.label}</Text>
              <Text numberOfLines={1} style={[styles.filterPanelValue, { color: theme.text }]}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

function ExploreProgrammeCard({
  isSaved,
  item,
  onToggleSaved,
  theme,
}: {
  isSaved: boolean;
  item: FitnessExploreItem;
  onToggleSaved: () => void;
  theme: FitnessTheme;
}): JSX.Element {
  return (
    <View style={[styles.programmeCard, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
      <View style={[styles.programmeVisual, { backgroundColor: theme.accentSoft }]}>
        <View style={[styles.programmeVisualMark, { backgroundColor: theme.accentStrong }]} />
        <Pressable accessibilityRole="button" onPress={onToggleSaved} style={[styles.saveButton, { backgroundColor: isSaved ? theme.accentStrong : theme.surface1 }]}>
          <Text style={[styles.saveButtonText, { color: isSaved ? "#FFFFFF" : theme.textMuted }]}>{isSaved ? "Saved" : "Save"}</Text>
        </Pressable>
      </View>
      <View style={styles.programmeCopy}>
        <Text style={[styles.metricLabel, { color: theme.accentStrong }]}>{item.category}</Text>
        <Text numberOfLines={2} style={[styles.sessionTitle, { color: theme.text }]}>{item.title}</Text>
        <Text numberOfLines={2} style={[styles.sectionHint, { color: theme.textMuted }]}>{item.subtitle}</Text>
        <Text style={[styles.sectionHint, { color: theme.textSubtle }]}>{item.durationLabel} - {item.tags.join(", ")}</Text>
      </View>
    </View>
  );
}

function ExploreCard({
  isSaved,
  item,
  onToggleSaved,
  theme,
}: {
  isSaved: boolean;
  item: FitnessExploreItem;
  onToggleSaved: () => void;
  theme: FitnessTheme;
}): JSX.Element {
  return (
    <FitnessSurface style={styles.exploreCard} theme={theme}>
      <View style={[styles.exploreThumbnail, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
        <View style={[styles.exploreThumbnailMark, { backgroundColor: theme.accentStrong }]} />
      </View>
      <View style={styles.flexCopy}>
        <Text style={[styles.sessionTitle, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.sectionHint, { color: theme.textMuted }]}>{item.subtitle}</Text>
        <View style={styles.miniTagRow}>
          {item.tags.map((tag) => (
            <Text key={tag} style={[styles.miniTag, { color: theme.textSubtle }]}>
              {tag}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.exploreActions}>
        <View style={[styles.exploreMark, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
          <Text style={[styles.exploreMarkText, { color: theme.accentStrong }]}>{item.durationLabel}</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onToggleSaved} style={[styles.compactSaveButton, { borderColor: isSaved ? theme.accentStrong : theme.border }]}>
          <Text style={[styles.compactSaveText, { color: isSaved ? theme.accentStrong : theme.textMuted }]}>{isSaved ? "Saved" : "Save"}</Text>
        </Pressable>
      </View>
    </FitnessSurface>
  );
}

function ProgressTab({ theme }: { theme: FitnessTheme }): JSX.Element {
  const [range, setRange] = useState<FitnessProgressRange>("Week");
  const [historySummary, setHistorySummary] = useState<WorkoutSessionHistorySummary | null>(null);
  const rangeInsight = getProgressRangeInsight(range);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      readWorkoutSessionHistory()
        .then((summary) => {
          if (active) {
            setHistorySummary(summary);
          }
        })
        .catch(() => {
          if (active) {
            setHistorySummary(null);
          }
        });

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <>
      <FitnessSurface elevated style={styles.progressHeroCard} theme={theme}>
        <View style={[styles.progressHeroVisual, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
          <View style={[styles.progressHeroLine, { backgroundColor: theme.accentStrong }]} />
          <View style={[styles.progressHeroDot, { backgroundColor: theme.success }]} />
          <Text style={[styles.progressHeroLabel, { color: theme.accentStrong }]}>Insight</Text>
        </View>
        <View style={styles.sectionHeader}>
          <View style={styles.flexCopy}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{rangeInsight.title}</Text>
            <Text style={[styles.bodyText, { color: theme.textMuted }]}>{rangeInsight.detail}</Text>
          </View>
        </View>
        <RangeToggle onChange={setRange} range={range} theme={theme} />
      </FitnessSurface>

      <View style={styles.progressOverviewGrid}>
        {fitnessProgressOverview.map((item) => (
          <ProgressOverviewTile item={item} key={item.label} theme={theme} />
        ))}
      </View>

      <WeightDirectionCard direction={fitnessWeightDirection} theme={theme} />

      <ProgressMuscleLoadCard theme={theme} />
      <LatestSessionCard historySummary={historySummary} theme={theme} />

      <FitnessSurface style={styles.progressIntro} theme={theme}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{range} charts</Text>
          <Text style={[styles.sectionHint, { color: theme.textSubtle }]}>Accessible summary</Text>
        </View>
        <Text style={[styles.bodyText, { color: theme.textMuted }]}>
          These placeholder charts show trend direction only. Real device and workout data will show units, source, and missing-data states.
        </Text>
      </FitnessSurface>
      {fitnessProgressMetrics.map((metric) => (
        <InterpretedChartCard key={metric.label} metric={metric} range={range} theme={theme} />
      ))}

      <WeeklyReviewCard historySummary={historySummary} range={range} theme={theme} />
      <ProgressMomentumCard historySummary={historySummary} theme={theme} />
      <AchievementGallery achievements={fitnessAchievementRecords} theme={theme} />
    </>
  );
}

function getProgressRangeInsight(range: FitnessProgressRange): { detail: string; title: string } {
  if (range === "Month") {
    return {
      detail: "Your monthly view connects training consistency, recovery choices, and nutrition support before looking at scale direction.",
      title: "Month trend: consistency first",
    };
  }

  if (range === "3 months") {
    return {
      detail: "Longer trends should show whether effort is becoming sustainable, not just whether individual workouts were hard.",
      title: "3-month trend: sustainable progress",
    };
  }

  if (range === "Year") {
    return {
      detail: "Annual progress will emphasize routine, strength retention, active minutes, and healthy self-directed decisions.",
      title: "Year trend: durable habits",
    };
  }

  return {
    detail: "Progress focuses on consistency, active minutes, and strength load without judgemental weight-loss framing.",
    title: "Weekly direction",
  };
}

function RangeToggle({
  onChange,
  range,
  theme,
}: {
  onChange: (range: FitnessProgressRange) => void;
  range: FitnessProgressRange;
  theme: FitnessTheme;
}): JSX.Element {
  return (
    <View style={[styles.rangeToggle, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
      {fitnessProgressRanges.map((item) => {
        const active = item === range;

        return (
          <Pressable
            accessibilityRole="button"
            key={item}
            onPress={() => onChange(item)}
            style={({ pressed }) => [
              styles.rangeToggleButton,
              { backgroundColor: active ? theme.surface1 : "transparent" },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.rangeToggleText, { color: active ? theme.text : theme.textMuted }]}>{item}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ProgressOverviewTile({ item, theme }: { item: FitnessProgressOverview; theme: FitnessTheme }): JSX.Element {
  const color = item.tone === "recovery" ? theme.recovery : item.tone === "success" ? theme.success : item.tone === "info" ? theme.info : theme.accent;
  const soft =
    item.tone === "recovery" ? theme.recoverySoft : item.tone === "success" ? theme.successSoft : item.tone === "info" ? theme.infoSoft : theme.accentSoft;

  return (
    <FitnessSurface style={styles.progressOverviewTile} theme={theme}>
      <View style={[styles.metricDot, { backgroundColor: color }]} />
      <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{item.label}</Text>
      <Text style={[styles.progressOverviewValue, { color }]}>{item.value}</Text>
      <View style={[styles.metricPill, { backgroundColor: soft }]}>
        <Text numberOfLines={1} style={[styles.metricDetail, { color: theme.textMuted }]}>
          {item.detail}
        </Text>
      </View>
    </FitnessSurface>
  );
}

function WeightDirectionCard({ direction, theme }: { direction: FitnessWeightDirection; theme: FitnessTheme }): JSX.Element {
  return (
    <FitnessSurface style={styles.weightDirectionCard} theme={theme}>
      <View style={styles.sectionHeader}>
        <View style={styles.flexCopy}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{direction.trendLabel}</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>{direction.summary}</Text>
        </View>
      </View>
      <View style={styles.weightMetricGrid}>
        {direction.metrics.map((metric) => (
          <View key={metric.label} style={[styles.weightMetric, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{metric.label}</Text>
            <Text style={[styles.planSettingValue, { color: theme.text }]}>{metric.value}</Text>
          </View>
        ))}
      </View>
      <View style={[styles.recoveryNote, { backgroundColor: theme.nutritionSoft, borderColor: theme.nutrition }]}>
        <Text style={[styles.metricLabel, { color: theme.nutrition }]}>Suggested action</Text>
        <Text style={[styles.sectionHint, { color: theme.textMuted }]}>{direction.action}</Text>
      </View>
    </FitnessSurface>
  );
}

function AchievementGallery({ achievements, theme }: { achievements: FitnessAchievementRecord[]; theme: FitnessTheme }): JSX.Element {
  return (
    <FitnessSurface style={styles.achievementGallery} theme={theme}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Grouped by controllable habits</Text>
        </View>
      </View>
      {achievements.map((achievement) => (
        <View key={achievement.id} style={[styles.achievementRow, { borderColor: theme.border }]}>
          <View
            style={[
              styles.achievementStateDot,
              { backgroundColor: achievement.unlocked ? theme.success : theme.surface3, borderColor: achievement.unlocked ? theme.success : theme.border },
            ]}
          />
          <View style={styles.flexCopy}>
            <Text style={[styles.sessionTitle, { color: theme.text }]}>{achievement.title}</Text>
            <Text style={[styles.sectionHint, { color: theme.textMuted }]}>{`${achievement.category} - ${achievement.detail}`}</Text>
          </View>
        </View>
      ))}
    </FitnessSurface>
  );
}

function ProgressMuscleLoadCard({ theme }: { theme: FitnessTheme }): JSX.Element {
  const highestLoad = Math.max(...fitnessTodayData.muscleHeat.map((item) => item.load), 0);
  const focusMuscles = fitnessTodayData.muscleHeat
    .filter((item) => item.load > 0)
    .slice(0, 4)
    .map((item) => formatMuscleName(item.muscleId));

  return (
    <FitnessSurface style={styles.progressMuscleCard} theme={theme}>
      <View style={styles.sectionHeader}>
        <View style={styles.flexCopy}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Muscle-load preview</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Placeholder until final male/female SVG maps are supplied.</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
          <Text style={[styles.statusPillText, { color: theme.accentStrong }]}>Load {highestLoad}/4</Text>
        </View>
      </View>
      <View style={styles.progressMuscleGrid}>
        {fitnessTodayData.muscleHeat.map((item) => (
          <View key={item.muscleId} style={[styles.progressMusclePill, { backgroundColor: item.load > 0 ? theme.accentSoft : theme.surface3, borderColor: item.load > 0 ? theme.accentBorder : theme.border }]}>
            <Text numberOfLines={1} style={[styles.metricLabel, { color: item.load > 0 ? theme.accentStrong : theme.textMuted }]}>{formatMuscleName(item.muscleId)}</Text>
            <View style={[styles.progressMuscleTrack, { backgroundColor: theme.surface2 }]}>
              <View style={[styles.progressMuscleFill, { backgroundColor: item.state === "recovering" ? theme.recovery : theme.accentStrong, width: `${(item.load / 4) * 100}%` }]} />
            </View>
          </View>
        ))}
      </View>
      <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Current focus: {focusMuscles.join(", ")}</Text>
    </FitnessSurface>
  );
}

function formatSessionDuration(totalSeconds: number): string {
  const minutes = Math.max(0, Math.round(totalSeconds / 60));

  return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function LatestSessionCard({ historySummary, theme }: { historySummary: WorkoutSessionHistorySummary | null; theme: FitnessTheme }): JSX.Element {
  const latest = historySummary?.latest;

  return (
    <FitnessSurface style={styles.latestSessionCard} theme={theme}>
      <View style={styles.sectionHeader}>
        <View style={styles.flexCopy}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Latest completed session</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>
            {latest ? `${latest.title} - ${formatSessionDuration(latest.durationSeconds)}` : "Finish a focus session to populate this card."}
          </Text>
        </View>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: latest?.hadPain ? theme.dangerSoft : latest ? theme.successSoft : theme.surface3,
              borderColor: latest?.hadPain ? theme.danger : latest ? theme.success : theme.border,
            },
          ]}
        >
          <Text style={[styles.statusPillText, { color: latest?.hadPain ? theme.danger : latest ? theme.success : theme.textMuted }]}>
            {latest?.hadPain ? "Review" : latest ? "Saved" : "Waiting"}
          </Text>
        </View>
      </View>
      <View style={styles.weightMetricGrid}>
        <View style={[styles.weightMetric, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
          <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Completed sets</Text>
          <Text style={[styles.planSettingValue, { color: theme.text }]}>{latest ? `${latest.completedSets}/${latest.plannedSets}` : "--"}</Text>
        </View>
        <View style={[styles.weightMetric, { backgroundColor: theme.surface3, borderColor: theme.border }]}>
          <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Effort</Text>
          <Text style={[styles.planSettingValue, { color: theme.text }]}>{latest?.feedback ? latest.feedback.replace("-", " ") : "Not logged"}</Text>
        </View>
      </View>
    </FitnessSurface>
  );
}

function InterpretedChartCard({ metric, range, theme }: { metric: FitnessProgressMetric; range: FitnessProgressRange; theme: FitnessTheme }): JSX.Element {
  const max = Math.max(...metric.trend, 1);
  const first = metric.trend[0] ?? 0;
  const last = metric.trend[metric.trend.length - 1] ?? 0;
  const direction = last >= first ? "up" : "down";

  return (
    <FitnessSurface style={styles.progressMetric} theme={theme}>
      <View style={styles.flexCopy}>
        <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{metric.label}</Text>
        <Text style={[styles.metricValue, { color: theme.text }]}>{metric.value}</Text>
        <Text style={[styles.sectionHint, { color: theme.textMuted }]}>{metric.detail}</Text>
        <View style={[styles.chartInterpretation, { backgroundColor: direction === "up" ? theme.successSoft : theme.recoverySoft, borderColor: direction === "up" ? theme.success : theme.recovery }]}>
          <Text style={[styles.metricLabel, { color: direction === "up" ? theme.success : theme.recovery }]}>Interpretation</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>{range} trend is {direction}. Review source quality before changing the plan.</Text>
        </View>
      </View>
      <View style={styles.trendBars}>
        {metric.trend.map((value, index) => (
          <View
            key={`${metric.label}-${index}`}
            style={[
              styles.trendBar,
              {
                backgroundColor: index === metric.trend.length - 1 ? theme.accentStrong : theme.accentSoft,
                height: 18 + (value / max) * 42,
              },
            ]}
          />
        ))}
      </View>
    </FitnessSurface>
  );
}

function WeeklyReviewCard({ historySummary, range, theme }: { historySummary: WorkoutSessionHistorySummary | null; range: FitnessProgressRange; theme: FitnessTheme }): JSX.Element {
  const completedThisWeek = historySummary?.completedThisWeek ?? 0;
  const latestHadPain = Boolean(historySummary?.latest?.hadPain);
  const insight = latestHadPain
    ? "Pain feedback is flagged for review. Keep this out of achievements and adjust the next session before progressing."
    : completedThisWeek > 0
      ? `${completedThisWeek} completed focus ${completedThisWeek === 1 ? "session" : "sessions"} saved locally this week. Keep the plan steady before adding volume.`
      : "Keep the same training rhythm and protect recovery after upper-body loading.";

  return (
    <FitnessSurface style={styles.weeklyReviewCard} theme={theme}>
      <View style={styles.sectionHeader}>
        <View style={styles.flexCopy}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{range} review</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>One useful interpretation and one next action.</Text>
        </View>
      </View>
      <View style={[styles.recoveryNote, { backgroundColor: latestHadPain ? theme.dangerSoft : theme.recoverySoft, borderColor: latestHadPain ? theme.danger : theme.recovery }]}>
        <Text style={[styles.metricLabel, { color: latestHadPain ? theme.danger : theme.recovery }]}>Review insight</Text>
        <Text style={[styles.sectionHint, { color: theme.textMuted }]}>{insight}</Text>
      </View>
    </FitnessSurface>
  );
}

function ProgressMomentumCard({ historySummary, theme }: { historySummary: WorkoutSessionHistorySummary | null; theme: FitnessTheme }): JSX.Element {
  const completedThisWeek = historySummary?.completedThisWeek ?? 0;
  const latestHadPain = Boolean(historySummary?.latest?.hadPain);
  const score = latestHadPain ? 42 : Math.min(96, 70 + completedThisWeek * 8);
  const durationLabel = historySummary && historySummary.totalDurationSeconds > 0 ? formatSessionDuration(historySummary.totalDurationSeconds) : "Not started";

  return (
    <FitnessSurface style={styles.progressMomentumCard} theme={theme}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Momentum</Text>
          <Text style={[styles.sectionHint, { color: theme.textMuted }]}>Rewards consistency, recovery and good judgement.</Text>
        </View>
        <View style={[styles.momentumScore, { backgroundColor: latestHadPain ? theme.dangerSoft : theme.accentSoft, borderColor: latestHadPain ? theme.danger : theme.accentBorder }]}>
          <Text style={[styles.momentumScoreText, { color: latestHadPain ? theme.danger : theme.accentStrong }]}>{score}</Text>
        </View>
      </View>
      <View style={styles.momentumList}>
        {[
          `${completedThisWeek} local focus ${completedThisWeek === 1 ? "session" : "sessions"} completed this week`,
          `${durationLabel} total saved training time`,
          latestHadPain ? "Pain feedback is routed to review" : "Recovery choices counted",
          "No reward for unsafe intensity",
        ].map((item) => (
          <Text key={item} style={[styles.sectionHint, { color: theme.textMuted }]}>{item}</Text>
        ))}
      </View>
    </FitnessSurface>
  );
}

const styles = StyleSheet.create({
  realmScreen: {
    flex: 1,
  },
  primaryActionCue: {
    flex: 1,
  },
  adjustBadge: {
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: fitnessSpacing[2],
    paddingVertical: 5,
  },
  adjustBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 14,
  },
  adjustCard: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: fitnessSpacing[2],
    minHeight: 104,
    minWidth: "47%",
    padding: fitnessSpacing[3],
  },
  adjustCardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: fitnessSpacing[2],
    justifyContent: "space-between",
  },
  adjustGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[3],
  },
  adjustPanel: {
    gap: fitnessSpacing[4],
  },
  adjustPreview: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 5,
    padding: fitnessSpacing[3],
  },
  adjustSheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    bottom: 0,
    gap: fitnessSpacing[4],
    left: 0,
    paddingBottom: 28,
    paddingHorizontal: fitnessSpacing[4],
    paddingTop: fitnessSpacing[2],
    position: "absolute",
    right: 0,
  },
  adjustSheetScrim: {
    backgroundColor: "rgba(0,0,0,0.34)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  applyAdjustButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.md,
    justifyContent: "center",
    minHeight: 52,
  },
  adjustTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 18,
    minWidth: 0,
  },
  activeControlButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    justifyContent: "center",
    minHeight: 48,
  },
  activeControlText: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 17,
  },
  activeControls: {
    flexDirection: "row",
    gap: fitnessSpacing[2],
  },
  activeExerciseCopy: {
    gap: fitnessSpacing[3],
  },
  activePrimaryButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.md,
    flex: 1.15,
    justifyContent: "center",
    minHeight: 48,
  },
  activeSmallButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    minHeight: 38,
    paddingHorizontal: fitnessSpacing[3],
  },
  activeSmallButtonText: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 17,
  },
  activeTargetText: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 21,
  },
  activeWorkout: {
    gap: fitnessSpacing[4],
  },
  achievementCapsule: {
    alignItems: "center",
    flexDirection: "row",
    gap: fitnessSpacing[3],
  },
  achievementIcon: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  achievementIconText: {
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 24,
  },
  achievementGallery: {
    gap: fitnessSpacing[3],
  },
  achievementRow: {
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: fitnessSpacing[3],
    paddingTop: fitnessSpacing[3],
  },
  achievementStateDot: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    height: 20,
    width: 20,
  },
  bodyLoad: {
    gap: fitnessSpacing[4],
  },
  bodyMapControls: {
    flexDirection: "row",
    gap: fitnessSpacing[2],
  },
  bodyMapDetail: {
    alignItems: "center",
    flexDirection: "row",
    gap: fitnessSpacing[4],
  },
  bodyMapLarge: {
    maxHeight: 280,
    minHeight: 228,
    width: "100%",
  },
  bodyMapInspect: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
    padding: fitnessSpacing[3],
  },
  bodyMapPressable: {
    alignItems: "center",
    flex: 1.15,
  },
  bodyMapSummary: {
    flex: 1,
    gap: fitnessSpacing[2],
    minWidth: 0,
  },
  bodyMapSummaryValue: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.9,
    lineHeight: 40,
  },
  bodyMaps: {
    alignItems: "center",
    flexDirection: "row",
    gap: fitnessSpacing[3],
    justifyContent: "space-between",
  },
  bodyText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 20,
  },
  bridgeDetail: {
    fontSize: 12.5,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 17,
  },
  bridgeActionChip: {
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: fitnessSpacing[2],
    paddingVertical: 5,
  },
  bridgeActionText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 14,
  },
  bridgeActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[2],
    marginTop: "auto",
  },
  bridgeFill: {
    borderRadius: fitnessRadius.pill,
    height: "100%",
  },
  bridgeFootnote: {
    fontSize: 11.5,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 16,
    marginTop: fitnessSpacing[3],
  },
  bridgeFreshness: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 14,
  },
  bridgeGrid: {
    flexDirection: "row",
    gap: fitnessSpacing[3],
  },
  bridgeHeader: {
    gap: 2,
  },
  bridgeMetric: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: fitnessSpacing[2],
    minHeight: 178,
    padding: fitnessSpacing[3],
  },
  bridgeSource: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 14,
  },
  bridgeTrack: {
    borderRadius: fitnessRadius.pill,
    height: 7,
    overflow: "hidden",
  },
  bridgeValue: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  clearAdjustButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 34,
    paddingHorizontal: fitnessSpacing[2],
  },
  clearAdjustText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 15,
  },
  completionMetric: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: 4,
    minHeight: 76,
    padding: fitnessSpacing[3],
  },
  completionSummary: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[2],
  },
  completionValue: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  compactWorkout: {
    alignItems: "stretch",
    gap: fitnessSpacing[4],
  },
  compactControls: {
    flexDirection: "row",
    gap: fitnessSpacing[2],
  },
  compactControlButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    justifyContent: "center",
    minHeight: 60,
  },
  compactControlText: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 18,
  },
  compactCopy: {
    alignItems: "center",
    gap: fitnessSpacing[2],
  },
  compactLogButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.md,
    flex: 1.2,
    justifyContent: "center",
    minHeight: 64,
  },
  compactRingWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  compactSaveButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    minHeight: 32,
    paddingHorizontal: fitnessSpacing[2],
  },
  compactSaveText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 14,
  },
  cancelEndButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 34,
  },
  content: {
    flexGrow: 1,
    gap: fitnessSpacing[4],
    paddingBottom: 130,
    paddingHorizontal: fitnessSpacing[4],
    paddingTop: fitnessSpacing[4],
  },
  exploreCard: {
    alignItems: "center",
    flexDirection: "row",
    gap: fitnessSpacing[3],
    minHeight: 104,
  },
  exploreActions: {
    alignItems: "flex-end",
    gap: fitnessSpacing[2],
  },
  exploreHeroBlock: {
    borderRadius: 20,
    bottom: 20,
    height: 52,
    left: 22,
    opacity: 0.9,
    position: "absolute",
    transform: [{ rotate: "-7deg" }],
    width: "62%",
  },
  exploreHeroCard: {
    gap: fitnessSpacing[4],
  },
  exploreHeroDot: {
    borderRadius: 999,
    height: 34,
    opacity: 0.7,
    position: "absolute",
    right: 26,
    top: 24,
    width: 34,
  },
  exploreHeroLabel: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
    lineHeight: 16,
    textTransform: "uppercase",
  },
  exploreHeroVisual: {
    borderRadius: fitnessRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    height: 116,
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: fitnessSpacing[4],
  },
  exploreMark: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    height: 58,
    justifyContent: "center",
    width: 72,
  },
  exploreMarkText: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 17,
  },
  exploreSection: {
    gap: fitnessSpacing[3],
  },
  exploreThumbnail: {
    alignItems: "center",
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    height: 66,
    justifyContent: "center",
    overflow: "hidden",
    width: 74,
  },
  exploreThumbnailMark: {
    borderRadius: 14,
    height: 38,
    opacity: 0.88,
    transform: [{ rotate: "-10deg" }],
    width: 48,
  },
  exerciseLibraryBoundary: {
    gap: fitnessSpacing[3],
  },
  endWorkoutButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 34,
  },
  endWorkoutText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 17,
  },
  doneWorkoutButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.md,
    justifyContent: "center",
    minHeight: 50,
  },
  doneWorkoutText: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 19,
  },
  deviceAction: {
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: fitnessSpacing[3],
    paddingVertical: 7,
  },
  deviceActionText: {
    fontSize: 11.5,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 15,
  },
  deviceCard: {
    gap: fitnessSpacing[3],
  },
  deviceDot: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  deviceRow: {
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: fitnessSpacing[3],
    paddingTop: fitnessSpacing[3],
  },
  cueRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[2],
    justifyContent: "center",
  },
  cueToggle: {
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: fitnessSpacing[3],
    paddingVertical: 7,
  },
  cueToggleText: {
    fontSize: 11.5,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 15,
  },
  emptyExploreCard: {
    gap: fitnessSpacing[2],
    minHeight: 120,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.2,
    lineHeight: 16,
    textTransform: "uppercase",
  },
  filterRail: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[2],
  },
  filterPanel: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: fitnessSpacing[2],
    padding: fitnessSpacing[3],
  },
  filterPanelRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: fitnessSpacing[3],
    justifyContent: "space-between",
  },
  filterPanelValue: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 17,
    textAlign: "right",
  },
  focusModeButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.pill,
    justifyContent: "center",
    minHeight: 34,
    minWidth: 78,
    paddingHorizontal: fitnessSpacing[3],
  },
  focusModeSelector: {
    alignItems: "center",
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 4,
    padding: 4,
  },
  focusModeText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 15,
  },
  flexCopy: {
    flex: 1,
    minWidth: 0,
  },
  hero: {
    gap: fitnessSpacing[4],
    minHeight: 236,
  },
  heroCopy: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  heroFooter: {
    flexDirection: "row",
    gap: fitnessSpacing[3],
  },
  heroTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[2],
  },
  heroMetaPill: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: 3,
    minHeight: 58,
    minWidth: "30%",
    paddingHorizontal: fitnessSpacing[3],
    paddingVertical: fitnessSpacing[2],
  },
  heroMetaValue: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 17,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.7,
    lineHeight: 32,
  },
  heroTopRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: fitnessSpacing[3],
  },
  recommendationBox: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 5,
    padding: fitnessSpacing[3],
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: "rgba(148,163,184,0.45)",
    borderRadius: 999,
    height: 4,
    width: 48,
  },
  todayHeroBeam: {
    borderRadius: 20,
    bottom: 22,
    height: 48,
    left: 24,
    opacity: 0.9,
    position: "absolute",
    transform: [{ rotate: "-8deg" }],
    width: "58%",
  },
  todayHeroMetaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[2],
  },
  todayHeroOrb: {
    borderRadius: 999,
    height: 38,
    opacity: 0.74,
    position: "absolute",
    right: 28,
    top: 22,
    width: 38,
  },
  todayHeroVisual: {
    borderRadius: fitnessRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    height: 128,
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: fitnessSpacing[4],
  },
  todayHeroVisualLabel: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
    lineHeight: 16,
    textTransform: "uppercase",
  },
  guidedControls: {
    flex: 1,
    gap: fitnessSpacing[2],
    minWidth: 0,
  },
  guidedDataRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: fitnessSpacing[3],
  },
  exerciseMedia: {
    borderRadius: fitnessRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    height: 150,
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: fitnessSpacing[4],
  },
  exerciseMediaBar: {
    borderRadius: 18,
    height: 54,
    opacity: 0.82,
    transform: [{ rotate: "-8deg" }],
    width: "68%",
  },
  exerciseMediaCircle: {
    borderRadius: 999,
    height: 34,
    opacity: 0.58,
    position: "absolute",
    right: 28,
    top: 24,
    width: 34,
  },
  loadLegend: {
    gap: 7,
    marginTop: fitnessSpacing[2],
  },
  loadLegendDot: {
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    height: 10,
    width: 10,
  },
  loadLegendRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: fitnessSpacing[2],
  },
  loadLegendText: {
    fontSize: 11.5,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 15,
  },
  latestSessionCard: {
    gap: fitnessSpacing[3],
  },
  metricDetail: {
    fontSize: 11.5,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 15,
  },
  metricDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  metricGrid: {
    flexDirection: "row",
    gap: fitnessSpacing[3],
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 16,
  },
  metricPill: {
    borderRadius: fitnessRadius.pill,
    marginTop: "auto",
    paddingHorizontal: fitnessSpacing[2],
    paddingVertical: 6,
  },
  metricTile: {
    flex: 1,
    gap: fitnessSpacing[2],
    minHeight: 138,
  },
  metricValue: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.9,
    lineHeight: 40,
  },
  muscleShortcut: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 3,
    padding: fitnessSpacing[3],
  },
  nextPreview: {
    alignItems: "center",
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 3,
    padding: fitnessSpacing[3],
  },
  miniTag: {
    fontSize: 11.5,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 15,
  },
  miniTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[2],
    marginTop: fitnessSpacing[2],
  },
  placeholder: {
    gap: fitnessSpacing[3],
    minHeight: 280,
  },
  placeholderLine: {
    borderRadius: fitnessRadius.pill,
    height: 14,
    width: "92%",
  },
  planCard: {
    gap: fitnessSpacing[4],
  },
  planActionButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    justifyContent: "center",
    minHeight: 48,
  },
  planActionRow: {
    flexDirection: "row",
    gap: fitnessSpacing[3],
  },
  planActionText: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 18,
  },
  phaseFill: {
    borderRadius: fitnessRadius.pill,
    height: "100%",
  },
  phaseProgressPanel: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: fitnessSpacing[2],
    padding: fitnessSpacing[3],
  },
  phaseTrack: {
    borderRadius: fitnessRadius.pill,
    height: 8,
    overflow: "hidden",
  },
  planCalendarCard: {
    gap: fitnessSpacing[3],
  },
  planCalendarDate: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  planCalendarDay: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: 4,
    minHeight: 102,
    minWidth: "30%",
    padding: fitnessSpacing[3],
  },
  planCalendarFocus: {
    fontSize: 11.5,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 15,
  },
  planCalendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[2],
  },
  planMeta: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: 4,
    minHeight: 74,
    padding: fitnessSpacing[3],
  },
  planMetaRow: {
    flexDirection: "row",
    gap: fitnessSpacing[3],
  },
  planMetaValue: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 19,
  },
  planSettingsCard: {
    gap: fitnessSpacing[3],
  },
  planSettingsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[3],
  },
  chartInterpretation: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
    marginTop: fitnessSpacing[2],
    padding: fitnessSpacing[3],
  },
  planToolButton: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: 4,
    minHeight: 104,
    minWidth: "47%",
    padding: fitnessSpacing[3],
  },
  planToolDetail: {
    fontSize: 11.5,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 15,
  },
  planToolDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  planToolTitle: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 18,
  },
  planToolsCard: {
    gap: fitnessSpacing[3],
  },
  planToolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[3],
  },
  trainHeroBlockLarge: {
    borderRadius: 20,
    bottom: 20,
    height: 52,
    left: 22,
    opacity: 0.9,
    position: "absolute",
    transform: [{ rotate: "-7deg" }],
    width: "62%",
  },
  trainHeroBlockSmall: {
    borderRadius: 999,
    height: 34,
    opacity: 0.7,
    position: "absolute",
    right: 26,
    top: 24,
    width: 34,
  },
  trainHeroCard: {
    gap: fitnessSpacing[4],
  },
  trainHeroVisual: {
    borderRadius: fitnessRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    height: 116,
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: fitnessSpacing[4],
  },
  trainHeroVisualLabel: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
    lineHeight: 16,
    textTransform: "uppercase",
  },
  planSettingChip: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: 4,
    minHeight: 74,
    minWidth: "47%",
    padding: fitnessSpacing[3],
  },
  planSettingValue: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 19,
  },
  pressed: {
    opacity: 0.76,
    transform: [{ scale: 0.98 }],
  },
  programmeCard: {
    borderRadius: fitnessRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 244,
    overflow: "hidden",
    width: 238,
  },
  programmeCopy: {
    gap: 5,
    padding: fitnessSpacing[3],
  },
  programmeVisual: {
    height: 112,
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: fitnessSpacing[3],
  },
  programmeVisualMark: {
    borderRadius: 18,
    height: 56,
    opacity: 0.9,
    transform: [{ rotate: "-10deg" }],
    width: 96,
  },
  recommendedRail: {
    gap: fitnessSpacing[3],
    paddingRight: fitnessSpacing[4],
  },
  saveButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.pill,
    justifyContent: "center",
    minHeight: 32,
    paddingHorizontal: fitnessSpacing[2],
    position: "absolute",
    right: fitnessSpacing[3],
    top: fitnessSpacing[3],
  },
  saveButtonText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 14,
  },
  planRail: {
    gap: fitnessSpacing[3],
    paddingRight: fitnessSpacing[4],
  },
  planRailCard: {
    borderRadius: fitnessRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 188,
    overflow: "hidden",
    width: 218,
  },
  planRailCopy: {
    gap: 5,
    padding: fitnessSpacing[3],
  },
  planRailMarkLarge: {
    borderRadius: 18,
    height: 56,
    opacity: 0.9,
    transform: [{ rotate: "-10deg" }],
    width: 96,
  },
  planRailMarkSmall: {
    borderRadius: 999,
    height: 24,
    opacity: 0.62,
    position: "absolute",
    right: 22,
    top: 22,
    width: 24,
  },
  planRailVisual: {
    alignItems: "flex-start",
    height: 92,
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: fitnessSpacing[4],
  },
  primaryButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.md,
    flex: 1,
    justifyContent: "center",
    minHeight: 52,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
  },
  progressBadge: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    minWidth: 72,
    paddingHorizontal: fitnessSpacing[3],
    paddingVertical: fitnessSpacing[2],
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 14,
  },
  progressValue: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  progressHeroCard: {
    gap: fitnessSpacing[4],
  },
  progressHeroVisual: {
    borderRadius: fitnessRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    height: 126,
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: fitnessSpacing[4],
  },
  progressHeroLine: {
    borderRadius: fitnessRadius.pill,
    bottom: 30,
    height: 18,
    left: 22,
    opacity: 0.84,
    position: "absolute",
    transform: [{ rotate: "-8deg" }],
    width: "68%",
  },
  progressHeroDot: {
    borderRadius: 999,
    height: 34,
    opacity: 0.72,
    position: "absolute",
    right: 30,
    top: 24,
    width: 34,
  },
  progressHeroLabel: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.5,
    lineHeight: 16,
    textTransform: "uppercase",
  },
  progressIntro: {
    gap: fitnessSpacing[2],
  },
  progressMetric: {
    alignItems: "center",
    flexDirection: "row",
    gap: fitnessSpacing[4],
    minHeight: 132,
  },
  progressMuscleCard: {
    gap: fitnessSpacing[3],
  },
  progressMuscleFill: {
    borderRadius: fitnessRadius.pill,
    height: "100%",
  },
  progressMuscleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[2],
  },
  progressMusclePill: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: fitnessSpacing[2],
    minWidth: "47%",
    padding: fitnessSpacing[3],
  },
  progressMuscleTrack: {
    borderRadius: fitnessRadius.pill,
    height: 7,
    overflow: "hidden",
  },
  progressOverviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[3],
  },
  progressOverviewTile: {
    flex: 1,
    gap: fitnessSpacing[2],
    minHeight: 132,
    minWidth: "47%",
  },
  progressOverviewValue: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  progressMomentumCard: {
    gap: fitnessSpacing[3],
  },
  momentumList: {
    gap: fitnessSpacing[2],
  },
  momentumScore: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    height: 54,
    justifyContent: "center",
    width: 62,
  },
  momentumScoreText: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  rangeToggle: {
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 4,
    padding: 4,
  },
  rangeToggleButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.pill,
    flex: 1,
    justifyContent: "center",
    minHeight: 38,
  },
  rangeToggleText: {
    fontSize: 11.5,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 15,
  },
  railSection: {
    gap: fitnessSpacing[3],
  },
  readinessCard: {
    gap: fitnessSpacing[4],
  },
  readinessChip: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: fitnessSpacing[2],
    minHeight: 78,
    minWidth: "47%",
    padding: fitnessSpacing[3],
  },
  readinessChipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[3],
  },
  readinessChipHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  readinessChipValue: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 17,
  },
  readinessFill: {
    borderRadius: fitnessRadius.pill,
    height: "100%",
  },
  readinessRecommendation: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 5,
    padding: fitnessSpacing[3],
  },
  readinessScore: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    height: 50,
    justifyContent: "center",
    width: 58,
  },
  readinessScoreText: {
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: -0.3,
    lineHeight: 25,
  },
  readinessTrack: {
    borderRadius: fitnessRadius.pill,
    height: 7,
    overflow: "hidden",
  },
  recoveryNote: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 5,
    padding: fitnessSpacing[3],
    width: "100%",
  },
  searchCard: {
    gap: fitnessSpacing[3],
  },
  searchField: {
    alignItems: "center",
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: fitnessSpacing[2],
    minHeight: 48,
    paddingHorizontal: fitnessSpacing[3],
  },
  searchIcon: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
    minHeight: 44,
    padding: 0,
  },
  selectedFilter: {
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: fitnessSpacing[3],
    paddingVertical: 6,
  },
  selectedFilterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[2],
  },
  selectedFilterText: {
    fontSize: 11.5,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 15,
  },
  secondaryButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: fitnessSpacing[4],
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
  },
  setProgressBlock: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: 4,
    minHeight: 74,
    padding: fitnessSpacing[3],
  },
  setProgressRow: {
    flexDirection: "row",
    gap: fitnessSpacing[2],
  },
  segmentedToggle: {
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    flexDirection: "row",
    padding: 3,
  },
  segmentedToggleButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.pill,
    flex: 1,
    justifyContent: "center",
    minHeight: 34,
  },
  segmentedToggleText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 15,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: fitnessSpacing[3],
    justifyContent: "space-between",
  },
  sectionHint: {
    fontSize: 12.5,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 17,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  sessionDate: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 48,
    justifyContent: "center",
    width: 58,
  },
  sessionDateText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 16,
  },
  sessionList: {
    gap: fitnessSpacing[3],
  },
  sessionRow: {
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: fitnessSpacing[3],
    paddingTop: fitnessSpacing[3],
  },
  sessionStatePill: {
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: fitnessSpacing[2],
    paddingVertical: 5,
  },
  sessionStateText: {
    fontSize: 10.5,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 13,
    textTransform: "capitalize",
  },
  sessionThumb: {
    alignItems: "center",
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    height: 48,
    justifyContent: "center",
    overflow: "hidden",
    width: 48,
  },
  sessionThumbMark: {
    borderRadius: 12,
    height: 28,
    opacity: 0.88,
    transform: [{ rotate: "-10deg" }],
    width: 34,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.1,
    lineHeight: 21,
  },
  statusPill: {
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: fitnessSpacing[3],
    paddingVertical: 7,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 15,
  },
  statusIsland: {
    alignItems: "center",
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: fitnessSpacing[3],
    minHeight: 54,
    paddingHorizontal: fitnessSpacing[4],
  },
  statusIslandDetail: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 16,
  },
  statusIslandDot: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  statusIslandTitle: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 18,
  },
  substitutionCard: {
    gap: fitnessSpacing[3],
  },
  substitutionRow: {
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: fitnessSpacing[3],
    paddingTop: fitnessSpacing[3],
  },
  tabButton: {
    alignItems: "center",
    borderRadius: fitnessRadius.pill,
    flex: 1,
    justifyContent: "center",
    minHeight: 40,
  },
  tabLabel: {
    fontSize: 12.5,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 16,
  },
  tabs: {
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 4,
    padding: 4,
  },
  tag: {
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: fitnessSpacing[3],
    paddingVertical: 7,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 15,
  },
  timerDetail: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 16,
    maxWidth: 188,
    textAlign: "right",
  },
  timerDock: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: fitnessSpacing[3],
    padding: fitnessSpacing[3],
  },
  timerModeChip: {
    borderRadius: fitnessRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: fitnessSpacing[3],
    paddingVertical: 7,
  },
  timerModeRail: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[2],
  },
  timerModeText: {
    fontSize: 11.5,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 15,
  },
  timerValue: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 31,
  },
  trendBar: {
    borderRadius: 6,
    width: 10,
  },
  trendBars: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 7,
    height: 68,
  },
  weekDate: {
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 21,
  },
  weekDay: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: 4,
    minHeight: 72,
    paddingVertical: 9,
  },
  weekDayLabel: {
    fontSize: 11.5,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 14,
  },
  weekDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  weeklyGoalCard: {
    gap: fitnessSpacing[4],
  },
  weeklyGoalCount: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.3,
    lineHeight: 27,
  },
  weeklyGoalDay: {
    alignItems: "center",
    flex: 1,
    gap: fitnessSpacing[2],
  },
  weeklyGoalDayLabel: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 15,
  },
  weeklyGoalDot: {
    borderRadius: 9,
    borderWidth: 2,
    height: 18,
    width: 18,
  },
  weeklyGoalTracker: {
    flexDirection: "row",
    gap: fitnessSpacing[2],
  },
  workoutFocusShell: {
    gap: fitnessSpacing[3],
  },
  workoutInputChip: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: 3,
    minHeight: 62,
    padding: fitnessSpacing[2],
  },
  workoutNotes: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 18,
    minHeight: 70,
    padding: fitnessSpacing[3],
    textAlignVertical: "top",
  },
  weightDirectionCard: {
    gap: fitnessSpacing[3],
  },
  weeklyReviewCard: {
    gap: fitnessSpacing[3],
  },
  weightMetric: {
    borderRadius: fitnessRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: 4,
    minHeight: 76,
    minWidth: "47%",
    padding: fitnessSpacing[3],
  },
  weightMetricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: fitnessSpacing[3],
  },
  weekStrip: {
    flexDirection: "row",
    gap: 7,
  },
});
