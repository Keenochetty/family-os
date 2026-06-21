import { router } from "expo-router";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { AccessibilityInfo, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SmartHeaderActionCard } from "@/components/SmartHeaderActionCard";
import { SmartHeaderActionCarousel } from "@/components/SmartHeaderActionCarousel";
import { SmartHeaderProfileRow } from "@/components/SmartHeaderProfileRow";
import { SmartHeaderQuickLogSheet } from "@/components/SmartHeaderQuickLogSheet";
import { getSmartHeaderActions } from "@/lib/smartHeaderPriorityResolver";
import { DEFAULT_SMART_HEADER_PREFERENCES } from "@/lib/smartHeaderRegistry";
import { raisedSurface, useAppTheme, type AppTheme } from "@/lib/theme";
import type { SmartHeaderAction, SmartHeaderContext, SmartHeaderPreferences } from "@/lib/smartHeaderTypes";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type SmartDailyHeaderProps = {
  context?: SmartHeaderContext;
  displayName?: string;
  preferences?: SmartHeaderPreferences;
};

type UtilitySheet = "notifications" | "settings" | null;

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

  const title = mode === "notifications" ? "Notifications" : "Settings";
  const subtitle =
    mode === "notifications"
      ? "Notification center will connect here when app notifications are ready."
      : "Profile and app settings will connect here when the settings route is ready.";
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
  context,
  displayName = "Keeno",
  preferences = DEFAULT_SMART_HEADER_PREFERENCES,
}: SmartDailyHeaderProps): JSX.Element {
  const { isDark, theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dismissedActionIds, setDismissedActionIds] = useState<string[]>(preferences.dismissedActionIds);
  const [actionAreaDismissed, setActionAreaDismissed] = useState(false);
  const [quickLogAction, setQuickLogAction] = useState<SmartHeaderAction | null>(null);
  const [utilitySheet, setUtilitySheet] = useState<UtilitySheet>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => setReduceMotion(false));
  }, []);

  const greeting = useMemo(() => getGreeting(new Date()), []);
  const resolvedPreferences = useMemo<SmartHeaderPreferences>(
    () => ({ ...preferences, dismissedActionIds }),
    [dismissedActionIds, preferences],
  );
  const actions = useMemo(() => getSmartHeaderActions(context, resolvedPreferences), [context, resolvedPreferences]);
  const activeAction = actions[Math.min(activeIndex, actions.length - 1)] ?? actions[0];
  const headerIsDark = isDark;
  const collapsedHeight = insets.top + 76;
  const halfHeight = insets.top + 132;
  const expandedHeight = insets.top + 236;
  const effectiveExpandedHeight = actionAreaDismissed ? halfHeight : expandedHeight;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = reduceMotion ? (event.contentOffset.y > 120 ? 220 : 0) : event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    height: interpolate(scrollY.value, [0, 80, 150], [effectiveExpandedHeight, halfHeight, collapsedHeight], Extrapolation.CLAMP),
  }));

  const spacerStyle = useAnimatedStyle(() => ({
    height: interpolate(scrollY.value, [0, 80, 150], [effectiveExpandedHeight, halfHeight, collapsedHeight], Extrapolation.CLAMP),
  }));

  const expandedStyle = useAnimatedStyle(() => ({
    opacity: actionAreaDismissed ? 0 : interpolate(scrollY.value, [0, 56, 94], [1, 0.35, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, 100], [0, -16], Extrapolation.CLAMP),
      },
      {
        scale: interpolate(scrollY.value, [0, 100], [1, 0.97], Extrapolation.CLAMP),
      },
    ],
  }));

  const compactStyle = useAnimatedStyle(() => ({
    opacity: actionAreaDismissed
      ? interpolate(scrollY.value, [0, 110, 150], [1, 1, 0], Extrapolation.CLAMP)
      : interpolate(scrollY.value, [46, 82, 142], [0, 1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(scrollY.value, [46, 94], [10, 0], Extrapolation.CLAMP) }],
  }));

  function dismissAction(actionId: string): void {
    setDismissedActionIds((current) => (current.includes(actionId) ? current : [...current, actionId]));
    setActiveIndex(0);
    // TODO: Persist dismissed action ids to Supabase/user preferences for the current day.
  }

  function dismissExpandedArea(): void {
    if (activeAction) {
      dismissAction(activeAction.id);
      setActionAreaDismissed(true);
    }
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
          <SmartHeaderProfileRow
            avatarInitials={getInitials(displayName)}
            greeting={greeting}
            isDark={headerIsDark}
            name={displayName}
            onNotificationsPress={() => setUtilitySheet("notifications")}
            onSettingsPress={() => setUtilitySheet("settings")}
          />
          <Animated.View pointerEvents={actionAreaDismissed ? "none" : "auto"} style={[styles.expandedActions, expandedStyle]}>
            <SmartHeaderActionCarousel
              activeIndex={activeIndex}
              actions={actions}
              isDark={headerIsDark}
              onActiveIndexChange={setActiveIndex}
              onDismiss={dismissAction}
              onDismissArea={dismissExpandedArea}
              onQuickLog={setQuickLogAction}
            />
          </Animated.View>
        </View>
        {activeAction ? (
          <Animated.View style={[styles.compactAction, compactStyle]}>
            <SmartHeaderActionCard action={activeAction} compact embedded isDark={headerIsDark} onDismiss={dismissAction} onQuickLog={setQuickLogAction} />
          </Animated.View>
        ) : null}
      </Animated.View>

      <AnimatedScrollView
        contentContainerStyle={styles.content}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={spacerStyle} />
        <View style={styles.scrollPad} />
      </AnimatedScrollView>

      <SmartHeaderQuickLogSheet action={quickLogAction} onClose={() => setQuickLogAction(null)} onOpenRoute={openActionRoute} />
      <UtilityBottomSheet mode={utilitySheet} onClose={() => setUtilitySheet(null)} theme={theme} />
    </View>
  );
}

const styles = StyleSheet.create({
  compactAction: {
    bottom: 12,
    elevation: 5,
    left: 16,
    position: "absolute",
    right: 16,
    shadowColor: "#000000",
    shadowOffset: { height: 5, width: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
  },
  content: {
    paddingBottom: 128,
  },
  expandedActions: {
    elevation: 5,
    marginTop: 16,
    shadowColor: "#000000",
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
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
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
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
