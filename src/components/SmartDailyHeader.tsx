import { router } from "expo-router";
import type { JSX, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { AccessibilityInfo, Modal, PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SmartHeaderActionCarousel } from "@/components/SmartHeaderActionCarousel";
import { SmartHeaderProfileRow } from "@/components/SmartHeaderProfileRow";
import { SmartHeaderQuickLogSheet } from "@/components/SmartHeaderQuickLogSheet";
import { ContextActionMenu } from "@/components/ui";
import { getSmartHeaderActions } from "@/lib/smartHeaderPriorityResolver";
import { DEFAULT_SMART_HEADER_PREFERENCES } from "@/lib/smartHeaderRegistry";
import { raisedSurface, useAppTheme, type AppTheme } from "@/lib/theme";
import type { SmartHeaderAction, SmartHeaderContext, SmartHeaderPreferences } from "@/lib/smartHeaderTypes";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type SmartDailyHeaderProps = {
  children?: ReactNode;
  context?: SmartHeaderContext;
  displayName?: string;
  preferences?: SmartHeaderPreferences;
};

type UtilitySheet = "notifications" | null;

let rememberedSmartFeedOpen = true;

function getGreeting(date: Date): string {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  }

  if (hour >= 17 && hour < 22) {
    return "Good evening";
  }

  return "Good day";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "K";
}

function UtilityBottomSheet({
  mode,
  onClose,
  theme,
}: {
  mode: UtilitySheet;
  onClose: () => void;
  theme: AppTheme;
}): JSX.Element | null {
  if (!mode) {
    return null;
  }

  const title = "Notifications";
  const subtitle = "Notification center will connect here when app notifications are ready.";
  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible>
      <View style={styles.sheetRoot}>
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.sheetScrim} />
        <View style={[styles.utilitySheet, raisedSurface(theme)]}>
          <View style={styles.sheetHandle} />
          <Text style={[styles.utilityTitle, { color: theme.textPrimary }]}>{title}</Text>
          <Text style={[styles.utilitySubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
          <Pressable accessibilityRole="button" onPress={onClose} style={({ pressed }) => [styles.utilityButton, pressed && styles.pressed]}>
            <Text style={styles.utilityButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function SmartDailyHeader({
  children,
  context,
  displayName = "Keeno",
  preferences = DEFAULT_SMART_HEADER_PREFERENCES,
}: SmartDailyHeaderProps): JSX.Element {
  const { isDark, theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const actionAreaProgress = useSharedValue(rememberedSmartFeedOpen ? 1 : 0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dismissedActionIds, setDismissedActionIds] = useState<string[]>(preferences.dismissedActionIds);
  const [actionAreaOpen, setActionAreaOpen] = useState(() => rememberedSmartFeedOpen);
  const [smartFeedVelocity, setSmartFeedVelocity] = useState(0);
  const [quickLogAction, setQuickLogAction] = useState<SmartHeaderAction | null>(null);
  const [contextAction, setContextAction] = useState<SmartHeaderAction | null>(null);
  const [utilitySheet, setUtilitySheet] = useState<UtilitySheet>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const pullBarResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: (_event, gesture) => gesture.dy > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
    onMoveShouldSetPanResponderCapture: (_event, gesture) => gesture.dy > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
    onPanResponderRelease: (_event, gesture) => {
      if (gesture.dy > 8 || gesture.vy > 0.12) {
        expandSmartFeed(gesture.vy);
      }
    },
    onPanResponderTerminate: (_event, gesture) => {
      if (gesture.dy > 8 || gesture.vy > 0.12) {
        expandSmartFeed(gesture.vy);
      }
    },
  });

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => setReduceMotion(false));
  }, []);

  const greeting = useMemo(() => getGreeting(new Date()), []);
  const resolvedPreferences = useMemo<SmartHeaderPreferences>(
    () => ({ ...preferences, dismissedActionIds }),
    [dismissedActionIds, preferences],
  );
  const actions = useMemo(() => getSmartHeaderActions(context, resolvedPreferences), [context, resolvedPreferences]);
  const headerIsDark = isDark;
  const collapsedHeight = insets.top + 76;
  const expandedHeight = insets.top + 236;

  useEffect(() => {
    const speed = Math.abs(smartFeedVelocity);
    const duration = reduceMotion ? 80 : speed >= 1.25 ? 90 : speed >= 0.75 ? 130 : speed >= 0.28 ? 170 : 230;

    actionAreaProgress.value = withTiming(actionAreaOpen ? 1 : 0, { duration });
  }, [actionAreaOpen, actionAreaProgress, reduceMotion, smartFeedVelocity]);

  const headerStyle = useAnimatedStyle(() => ({
    height: interpolate(actionAreaProgress.value, [0, 1], [collapsedHeight, expandedHeight], "clamp"),
  }));

  const spacerStyle = useAnimatedStyle(() => ({
    height: interpolate(actionAreaProgress.value, [0, 1], [collapsedHeight, expandedHeight], "clamp"),
  }));

  const expandedStyle = useAnimatedStyle(() => ({
    opacity: actionAreaProgress.value,
    transform: [
      {
        translateY: interpolate(actionAreaProgress.value, [0, 1], [-92, 0], "clamp"),
      },
      {
        scale: interpolate(actionAreaProgress.value, [0, 1], [0.98, 1], "clamp"),
      },
    ],
  }));

  const collapsedControlStyle = useAnimatedStyle(() => ({
    opacity: interpolate(actionAreaProgress.value, [0, 0.3], [1, 0], "clamp"),
    transform: [{ translateY: interpolate(actionAreaProgress.value, [0, 1], [0, 22], "clamp") }],
  }));

  function dismissAction(actionId: string): void {
    setDismissedActionIds((current) => (current.includes(actionId) ? current : [...current, actionId]));
    setActiveIndex(0);
    // TODO: Persist dismissed action ids to Supabase/user preferences for the current day.
  }

  function setSmartFeedOpen(nextOpen: boolean, velocityY = 0): void {
    rememberedSmartFeedOpen = nextOpen;
    setSmartFeedVelocity(velocityY);
    setActionAreaOpen(nextOpen);
  }

  function dismissExpandedArea(velocityY = 0): void {
    setSmartFeedOpen(false, velocityY);
  }

  function expandSmartFeed(velocityY = 0): void {
    setSmartFeedOpen(true, velocityY);
  }

  function openActionRoute(action: SmartHeaderAction): void {
    setQuickLogAction(null);

    if (action.route) {
      router.push(action.route);
    }
  }

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.header, raisedSurface(theme), headerStyle, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerSurface}>
          <View style={[styles.profileLayer, { backgroundColor: theme.surfaceRaised }]}>
            <SmartHeaderProfileRow
              avatarInitials={getInitials(displayName)}
              greeting={greeting}
              isDark={headerIsDark}
              name={displayName}
              onNotificationsPress={() => setUtilitySheet("notifications")}
              onSettingsPress={() => router.push("/profile/settings")}
            />
          </View>
          <Animated.View pointerEvents={actionAreaOpen ? "auto" : "none"} style={[styles.expandedActions, expandedStyle]}>
            <Pressable
              accessibilityLabel="Collapse smart feed"
              accessibilityRole="button"
              onPress={() => dismissExpandedArea()}
              style={({ pressed }) => [styles.smartFeedControl, { backgroundColor: theme.surfaceRecessed }, pressed && styles.pressed]}
            >
              <Text style={[styles.smartFeedControlText, { color: theme.textSecondary }]}>Hide smart feed</Text>
            </Pressable>
            <SmartHeaderActionCarousel
              activeIndex={activeIndex}
              actions={actions}
              isDark={headerIsDark}
              onActiveIndexChange={setActiveIndex}
              onDismiss={dismissAction}
              onDismissArea={dismissExpandedArea}
              onLongPressAction={setContextAction}
              onQuickLog={setQuickLogAction}
            />
          </Animated.View>
        </View>
        <Animated.View
          pointerEvents={actionAreaOpen ? "none" : "auto"}
          style={[styles.collapsedControl, collapsedControlStyle]}
          {...pullBarResponder.panHandlers}
        >
          <Pressable
            accessibilityLabel="Expand smart feed"
            accessibilityRole="button"
            onPress={() => expandSmartFeed()}
            style={({ pressed }) => [styles.pullBarHitArea, pressed && styles.pressed]}
          >
            <View style={[styles.pullBarTrack, { backgroundColor: theme.surfaceRecessed }]}>
              <View style={[styles.pullBar, { backgroundColor: theme.textPrimary }]} />
            </View>
          </Pressable>
        </Animated.View>
      </Animated.View>

      <AnimatedScrollView
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={spacerStyle} />
        {children ? <View style={styles.homeContent}>{children}</View> : <View style={styles.scrollPad} />}
      </AnimatedScrollView>

      <SmartHeaderQuickLogSheet action={quickLogAction} onClose={() => setQuickLogAction(null)} onOpenRoute={openActionRoute} />
      <Modal animationType="fade" onRequestClose={() => setContextAction(null)} transparent visible={Boolean(contextAction)}>
        <View style={styles.sheetRoot}>
          <Pressable accessibilityRole="button" onPress={() => setContextAction(null)} style={styles.sheetScrim} />
          <View style={[styles.utilitySheet, raisedSurface(theme)]}>
            <View style={styles.sheetHandle} />
            <ContextActionMenu
              title={contextAction?.title}
              actions={[
                { id: "open", label: "Open", onPress: () => contextAction && openActionRoute(contextAction) },
                { id: "review", label: "Review privacy", onPress: () => setContextAction(null) },
                { id: "ask-ai", label: "Ask AI", onPress: () => router.push("/ai") },
                { id: "skip", label: "Skip for now", onPress: () => contextAction && dismissAction(contextAction.id) },
              ]}
            />
          </View>
        </View>
      </Modal>
      <UtilityBottomSheet mode={utilitySheet} onClose={() => setUtilitySheet(null)} theme={theme} />
    </View>
  );
}

const styles = StyleSheet.create({
  collapsedControl: {
    alignItems: "center",
    bottom: 5,
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 8,
  },
  content: {
    paddingBottom: 128,
  },
  expandedActions: {
    elevation: 5,
    marginTop: 10,
    shadowColor: "#000000",
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    zIndex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 9,
    left: 0,
    overflow: "hidden",
    paddingHorizontal: 16,
    position: "absolute",
    right: 0,
    shadowColor: "#000000",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.11,
    shadowRadius: 20,
    top: 0,
    zIndex: 10,
  },
  headerSurface: {
    flex: 1,
  },
  homeContent: {
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  pullBar: {
    borderRadius: 999,
    height: 4,
    opacity: 0.76,
    width: 42,
  },
  pullBarHitArea: {
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
    minHeight: 30,
    minWidth: 110,
  },
  pullBarTrack: {
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  profileLayer: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 6,
    zIndex: 3,
  },
  profileExpanded: {
    marginTop: 0,
  },
  root: {
    flex: 1,
  },
  scrollPad: {
    height: 760,
  },
  smartFeedControl: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 999,
    minHeight: 28,
    paddingHorizontal: 13,
    paddingVertical: 6,
  },
  smartFeedControlText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 13,
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: "rgba(148,163,184,0.45)",
    borderRadius: 999,
    height: 4,
    marginBottom: 16,
    width: 44,
  },
  sheetRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetScrim: {
    backgroundColor: "rgba(15,23,42,0.34)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  utilityButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#35A96B",
    borderRadius: 999,
    justifyContent: "center",
    marginTop: 18,
    minHeight: 40,
    paddingHorizontal: 16,
  },
  utilityButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  utilitySheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    paddingBottom: 30,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  utilitySubtitle: {
    fontSize: 13.5,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 7,
  },
  utilityTitle: {
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 23,
  },
});
