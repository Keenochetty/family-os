import type { JSX } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

type SmartHeaderProfileRowProps = {
  avatarInitials: string;
  collapsed?: boolean;
  greeting: string;
  isDark: boolean;
  name: string;
  onNotificationsPress: () => void;
  onSettingsPress: () => void;
};

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
      <Circle cx={12} cy={12} r={3.2} stroke={color} strokeWidth={2} />
      <Path
        d="M12 3.8v2.1M12 18.1v2.1M5.2 5.2l1.5 1.5M17.3 17.3l1.5 1.5M3.8 12h2.1M18.1 12h2.1M5.2 18.8l1.5-1.5M17.3 6.7l1.5-1.5"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
      />
    </Svg>
  );
}

export function SmartHeaderProfileRow({
  avatarInitials,
  collapsed,
  greeting,
  isDark,
  name,
  onNotificationsPress,
  onSettingsPress,
}: SmartHeaderProfileRowProps): JSX.Element {
  const textColor = isDark ? "#F8FAFC" : "#111827";
  const mutedColor = isDark ? "rgba(248,250,252,0.68)" : "rgba(17,24,39,0.58)";
  const buttonColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.78)";
  const iconColor = isDark ? "#E5E7EB" : "#334155";

  return (
    <View style={[styles.row, collapsed && styles.rowCollapsed]}>
      <View style={[styles.avatar, collapsed && styles.avatarCollapsed]}>
        <Text style={[styles.avatarText, collapsed && styles.avatarTextCollapsed]}>{avatarInitials}</Text>
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={[styles.greeting, collapsed && styles.greetingCollapsed, { color: mutedColor }]}>
          {greeting}
        </Text>
        <Text numberOfLines={1} style={[styles.name, collapsed && styles.nameCollapsed, { color: textColor }]}>
          {name}
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityLabel="Open notifications"
          accessibilityRole="button"
          onPress={onNotificationsPress}
          style={({ pressed }) => [styles.iconButton, { backgroundColor: buttonColor }, pressed && styles.pressed]}
        >
          <HeaderIcon color={iconColor} name="bell" />
        </Pressable>
        <Pressable
          accessibilityLabel="Open settings"
          accessibilityRole="button"
          onPress={onSettingsPress}
          style={({ pressed }) => [styles.iconButton, { backgroundColor: buttonColor }, pressed && styles.pressed]}
        >
          <HeaderIcon color={iconColor} name="settings" />
        </Pressable>
      </View>
    </View>
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
  avatarCollapsed: {
    borderRadius: 15,
    height: 38,
    width: 38,
  },
  avatarText: {
    color: "#14532D",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
  },
  avatarTextCollapsed: {
    fontSize: 13,
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
  greetingCollapsed: {
    fontSize: 11.5,
    lineHeight: 14,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 14,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 24,
  },
  nameCollapsed: {
    fontSize: 15,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  rowCollapsed: {
    gap: 10,
  },
});
