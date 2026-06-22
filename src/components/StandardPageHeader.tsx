import type { JSX, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

import { raisedSurface, useAppTheme } from "@/lib/theme";

type StandardPageHeaderProps = {
  right?: ReactNode;
  subtitle?: string;
  title: string;
};

export function StandardPageHeader({ right, subtitle, title }: StandardPageHeaderProps): JSX.Element {
  const { isDark, theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const mutedColor = isDark ? "rgba(248,250,252,0.68)" : "rgba(17,24,39,0.58)";
  const buttonColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.78)";
  const iconColor = isDark ? "#E5E7EB" : "#334155";

  return (
    <View style={[styles.header, raisedSurface(theme), { paddingTop: insets.top + 12 }]}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>K</Text>
        </View>
        <View style={styles.copy}>
          <Text numberOfLines={1} style={[styles.greeting, { color: mutedColor }]}>
            {subtitle ?? "You are in"}
          </Text>
          <Text numberOfLines={1} style={[styles.title, { color: theme.textPrimary }]}>
            {title}
          </Text>
        </View>
        {right ? <View style={styles.right}>{right}</View> : null}
        <View style={styles.actions}>
          <Pressable
            accessibilityLabel="Open notifications"
            accessibilityRole="button"
            style={({ pressed }) => [styles.iconButton, { backgroundColor: buttonColor }, pressed && styles.pressed]}
          >
            <HeaderIcon color={iconColor} name="bell" />
          </Pressable>
          <Pressable
            accessibilityLabel="Open settings"
            accessibilityRole="button"
            style={({ pressed }) => [styles.iconButton, { backgroundColor: buttonColor }, pressed && styles.pressed]}
          >
            <HeaderIcon color={iconColor} name="settings" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function HeaderIcon({ color, name }: { color: string; name: "bell" | "settings" }): JSX.Element {
  if (name === "bell") {
    return (
      <Svg height={19} viewBox="0 0 24 24" width={19} fill="none">
        <Path d="M7 10.7a5 5 0 0 1 10 0v3.15l1.65 2.7H5.35L7 13.85V10.7Z" stroke={color} strokeLinejoin="round" strokeWidth={2} />
        <Path d="M10 19a2.1 2.1 0 0 0 4 0" stroke={color} strokeLinecap="round" strokeWidth={2} />
      </Svg>
    );
  }

  return (
    <Svg height={19} viewBox="0 0 24 24" width={19} fill="none">
      <Path
        d="M10.4 3.5h3.2l.48 2.1c.45.16.88.34 1.26.58l1.88-1.15 2.25 2.25-1.15 1.88c.24.38.43.81.58 1.26l2.1.48v3.2l-2.1.48c-.16.45-.34.88-.58 1.26l1.15 1.88-2.25 2.25-1.88-1.15c-.38.24-.81.43-1.26.58l-.48 2.1h-3.2l-.48-2.1a7.3 7.3 0 0 1-1.26-.58l-1.88 1.15-2.25-2.25 1.15-1.88a7.3 7.3 0 0 1-.58-1.26l-2.1-.48v-3.2l2.1-.48c.16-.45.34-.88.58-1.26L4.53 7.28l2.25-2.25 1.88 1.15c.38-.24.81-.43 1.26-.58l.48-2.1Z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={1.8}
      />
      <Circle cx={12} cy={12} r={3.1} stroke={color} strokeWidth={1.8} />
      <Path d="M12 12h.01" stroke={color} strokeLinecap="round" strokeWidth={2.4} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#D7F5E4",
    borderRadius: 18,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  avatarText: {
    color: "#14532D",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  greeting: {
    fontSize: 12.5,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 16,
  },
  header: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderBottomWidth: 1,
    elevation: 9,
    overflow: "hidden",
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: "#000000",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.11,
    shadowRadius: 20,
    zIndex: 10,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 14,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  right: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 24,
  },
});
