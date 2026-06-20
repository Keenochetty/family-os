import { router } from "expo-router";
import type { JSX } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

import type { SmartHeaderAction, SmartHeaderVisualType } from "@/lib/smartHeaderTypes";

type SmartHeaderActionCardProps = {
  action: SmartHeaderAction;
  compact?: boolean;
  embedded?: boolean;
  isDark: boolean;
  onDismiss?: (actionId: string) => void;
  onQuickLog: (action: SmartHeaderAction) => void;
};

function SmartHeaderMiniVisual({ accentColor, type }: { accentColor: string; type: SmartHeaderVisualType }): JSX.Element {
  const muted = "rgba(148,163,184,0.55)";

  if (type === "waterDrops") {
    return (
      <View style={styles.drops}>
        {[0, 1, 2].map((item) => (
          <Svg height={28} key={item} viewBox="0 0 18 24" width={20}>
            <Path d="M9 2C6.2 5.4 3.3 9.2 3.3 13a5.7 5.7 0 0 0 11.4 0C14.7 9.2 11.8 5.4 9 2Z" fill={item < 2 ? accentColor : muted} />
          </Svg>
        ))}
      </View>
    );
  }

  if (type === "pillRow") {
    return (
      <View style={styles.pillRow}>
        {[0, 1, 2, 3].map((item) => (
          <View key={item} style={[styles.pill, { backgroundColor: item < 3 ? accentColor : muted }]}>
            <View style={styles.pillDivider} />
          </View>
        ))}
      </View>
    );
  }

  if (type === "mealChips") {
    return (
      <View style={styles.mealChips}>
        {["Meal", "Scan", "Water"].map((label, index) => (
          <View key={label} style={[styles.mealChip, { borderColor: index === 0 ? accentColor : muted }]}>
            <Text style={[styles.mealChipText, { color: index === 0 ? accentColor : "#64748B" }]}>{label}</Text>
          </View>
        ))}
      </View>
    );
  }

  if (type === "moodEmojiRow") {
    return (
      <View style={styles.moodRow}>
        {[
          ["🙂", "Happy"],
          ["😐", "Okay"],
          ["😔", "Sad"],
          ["😤", "Stressed"],
          ["😴", "Tired"],
        ].map(([emoji, label]) => (
          <Text accessibilityLabel={label} key={label} style={styles.moodEmoji}>
            {emoji}
          </Text>
        ))}
      </View>
    );
  }

  if (type === "workoutBars" || type === "sleepBars") {
    const heights = type === "sleepBars" ? [16, 24, 20, 30, 18] : [16, 28, 22, 34, 24];

    return (
      <View style={styles.bars}>
        {heights.map((height, index) => (
          <View key={`${height}-${index}`} style={[styles.bar, { backgroundColor: index < 3 ? accentColor : muted, height }]} />
        ))}
      </View>
    );
  }

  if (type === "pulseLine") {
    return (
      <Svg height={46} viewBox="0 0 118 46" width={118} fill="none">
        <Path d="M4 26h22l8-14 13 26 12-21 11 9h44" stroke={accentColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} />
        <Circle cx={114} cy={26} fill={accentColor} r={4} />
      </Svg>
    );
  }

  if (type === "scanFrame") {
    return (
      <Svg height={54} viewBox="0 0 74 54" width={74} fill="none">
        <Path d="M8 20V9h13M53 9h13v11M66 34v11H53M21 45H8V34" stroke={accentColor} strokeLinecap="round" strokeWidth={4} />
        <Line stroke={accentColor} strokeLinecap="round" strokeWidth={3} x1={14} x2={60} y1={27} y2={27} />
      </Svg>
    );
  }

  if (type === "familyBubbles") {
    return (
      <View style={styles.bubbles}>
        {[22, 30, 24].map((size, index) => (
          <View key={size} style={[styles.bubble, { backgroundColor: index === 1 ? accentColor : muted, height: size, width: size }]} />
        ))}
      </View>
    );
  }

  if (type === "recordsBadge" || type === "setupBadge" || type === "statusBadge") {
    return (
      <Svg height={54} viewBox="0 0 64 54" width={64} fill="none">
        <Rect fill="rgba(148,163,184,0.16)" height={42} rx={12} stroke={accentColor} strokeWidth={3} width={48} x={8} y={6} />
        <Path d="M21 28h8l5-10 7 18 4-8h7" stroke={accentColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} />
      </Svg>
    );
  }

  return (
    <View style={styles.dots}>
      {[0, 1, 2].map((item) => (
        <View key={item} style={[styles.dot, { backgroundColor: item === 0 ? accentColor : muted }]} />
      ))}
    </View>
  );
}

export function SmartHeaderActionCard({ action, compact, embedded, isDark, onDismiss, onQuickLog }: SmartHeaderActionCardProps): JSX.Element {
  const textColor = isDark ? "#F8FAFC" : "#0F172A";
  const mutedColor = isDark ? "rgba(248,250,252,0.66)" : "rgba(15,23,42,0.58)";
  const cardColor = embedded ? "transparent" : isDark ? "rgba(30,41,59,0.78)" : "rgba(255,255,255,0.86)";
  const borderColor = embedded ? "transparent" : isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)";

  function handlePrimaryPress(): void {
    if (action.type === "quickLog" || action.type === "reminder" || action.type === "setup") {
      onQuickLog(action);
      return;
    }

    if (action.route) {
      router.push(action.route);
    }
  }

  function handleSecondaryPress(): void {
    if (action.secondaryLabel === "Skip" || action.secondaryLabel === "Later") {
      onDismiss?.(action.id);
      return;
    }

    if (action.route) {
      router.push(action.route);
    }
  }

  return (
    <View style={[styles.card, compact && styles.cardCompact, embedded && styles.cardEmbedded, { backgroundColor: cardColor, borderColor }]}>
      <View style={styles.cardMain}>
        <View style={[styles.visualWrap, compact && styles.visualWrapCompact]}>
          <SmartHeaderMiniVisual accentColor={action.accentColor} type={action.visualType} />
        </View>
        <View style={styles.cardCopy}>
          <Text numberOfLines={1} style={[styles.title, compact && styles.titleCompact, { color: textColor }]}>
            {action.title}
          </Text>
          <Text numberOfLines={compact ? 1 : 2} style={[styles.subtitle, compact && styles.subtitleCompact, { color: mutedColor }]}>
            {action.subtitle}
          </Text>
        </View>
      </View>
      {!compact ? (
        <View style={styles.buttons}>
          <Pressable
            accessibilityRole="button"
            onPress={handlePrimaryPress}
            style={({ pressed }) => [styles.primaryButton, { backgroundColor: action.accentColor }, pressed && styles.pressed]}
          >
            <Text style={styles.primaryButtonText}>{action.primaryLabel}</Text>
          </Pressable>
          {action.secondaryLabel ? (
            <Pressable
              accessibilityRole="button"
              onPress={handleSecondaryPress}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            >
              <Text style={[styles.secondaryButtonText, { color: action.accentColor }]}>{action.secondaryLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderRadius: 999,
    width: 8,
  },
  bars: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 5,
    height: 38,
  },
  bubble: {
    borderRadius: 999,
    marginLeft: -5,
  },
  bubbles: {
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 7,
  },
  buttons: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    shadowColor: "#000000",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  cardCompact: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  cardEmbedded: {
    borderWidth: 0,
    elevation: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowOpacity: 0,
  },
  cardCopy: {
    flex: 1,
    minWidth: 0,
  },
  cardMain: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  dot: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  drops: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
  },
  mealChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  mealChipText: {
    fontSize: 9.5,
    fontWeight: "900",
    lineHeight: 11,
  },
  mealChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    maxWidth: 86,
  },
  moodEmoji: {
    fontSize: 18,
    lineHeight: 22,
  },
  moodRow: {
    flexDirection: "row",
    gap: 3,
  },
  pill: {
    borderRadius: 999,
    height: 12,
    overflow: "hidden",
    transform: [{ rotate: "-24deg" }],
    width: 28,
  },
  pillDivider: {
    backgroundColor: "rgba(255,255,255,0.38)",
    bottom: 0,
    left: 13,
    position: "absolute",
    top: 0,
    width: 1,
  },
  pillRow: {
    gap: 4,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  primaryButton: {
    alignItems: "center",
    borderRadius: 999,
    flex: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
  secondaryButton: {
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 10,
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 18,
    marginTop: 3,
  },
  subtitleCompact: {
    fontSize: 11.5,
    lineHeight: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 22,
  },
  titleCompact: {
    fontSize: 14,
    lineHeight: 17,
  },
  visualWrap: {
    alignItems: "center",
    height: 58,
    justifyContent: "center",
    width: 92,
  },
  visualWrapCompact: {
    height: 36,
    width: 68,
  },
});
