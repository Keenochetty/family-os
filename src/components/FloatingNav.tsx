import { router, usePathname } from "expo-router";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, useColorScheme, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path, Rect } from "react-native-svg";

type NavItem = {
  href: "/" | "/calendar" | "/scan" | "/health" | "/family-circle";
  icon: "home" | "calendar" | "scan" | "heart" | "family";
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/calendar", icon: "calendar", label: "Calendar" },
  { href: "/scan", icon: "scan", label: "Scan" },
  { href: "/health", icon: "heart", label: "Health" },
  { href: "/family-circle", icon: "family", label: "Family Circle" },
];

const ICON_SIZE = 27;
const COMPACT_ICON_SIZE = 25;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

function NavIcon({ name, color }: { name: NavItem["icon"]; color: string }): JSX.Element {
  const strokeWidth = 2.3;

  if (name === "home") {
    return (
      <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3.5 10.7 12 3.75l8.5 6.95v8.05a1.75 1.75 0 0 1-1.75 1.75h-4.2v-5.4h-5.1v5.4h-4.2a1.75 1.75 0 0 1-1.75-1.75V10.7Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === "calendar") {
    return (
      <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
        <Rect
          x={4}
          y={5}
          width={16}
          height={15}
          rx={3}
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Path d="M8 3.5v4M16 3.5v4M4.8 10h14.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" stroke={color} strokeWidth={3} strokeLinecap="round" />
      </Svg>
    );
  }

  if (name === "scan") {
    return (
      <Svg width={COMPACT_ICON_SIZE} height={COMPACT_ICON_SIZE} viewBox="0 0 48 48" fill="none">
        <Path d="M6,18a2,2,0,0,0,2-2V8h8a2,2,0,0,0,0-4H8A4,4,0,0,0,4,8v8A2,2,0,0,0,6,18Z" fill={color} />
        <Path d="M40,4H32a2,2,0,0,0,0,4h8v8a2,2,0,0,0,4,0V8A4,4,0,0,0,40,4Z" fill={color} />
        <Path d="M42,30a2,2,0,0,0-2,2v8H32a2,2,0,0,0,0,4h8a4,4,0,0,0,4-4V32A2,2,0,0,0,42,30Z" fill={color} />
        <Path d="M16,40H8V32a2,2,0,0,0-4,0v8a4,4,0,0,0,4,4h8a2,2,0,0,0,0-4Z" fill={color} />
        <Path d="M42,22H6a2,2,0,0,0,0,4H42a2,2,0,0,0,0-4Z" fill={color} />
      </Svg>
    );
  }

  if (name === "heart") {
    return (
      <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
        <Path
          d="M20.2 8.65c0 5.15-8.2 10.1-8.2 10.1s-8.2-4.95-8.2-10.1A4.55 4.55 0 0 1 12 5.95a4.55 4.55 0 0 1 8.2 2.7Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        <Path d="M7.4 12.2h2.2l1-2.3 1.8 4.5 1.25-2.2h2.95" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  return (
    <Svg width={COMPACT_ICON_SIZE} height={COMPACT_ICON_SIZE} viewBox="-1 -1 26 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0C5.96243 0 3.5 2.46243 3.5 5.5C3.5 8.53757 5.96243 11 9 11C12.0376 11 14.5 8.53757 14.5 5.5C14.5 2.46243 12.0376 0 9 0ZM5.5 5.5C5.5 3.567 7.067 2 9 2C10.933 2 12.5 3.567 12.5 5.5C12.5 7.433 10.933 9 9 9C7.067 9 5.5 7.433 5.5 5.5Z"
        fill={color}
      />
      <Path d="M15.5 0C14.9477 0 14.5 0.447715 14.5 1C14.5 1.55228 14.9477 2 15.5 2C17.433 2 19 3.567 19 5.5C19 7.433 17.433 9 15.5 9C14.9477 9 14.5 9.44771 14.5 10C14.5 10.5523 14.9477 11 15.5 11C18.5376 11 21 8.53757 21 5.5C21 2.46243 18.5376 0 15.5 0Z" fill={color} />
      <Path d="M19.0837 14.0157C19.3048 13.5096 19.8943 13.2786 20.4004 13.4997C22.5174 14.4246 24 16.538 24 19V21C24 21.5523 23.5523 22 23 22C22.4477 22 22 21.5523 22 21V19C22 17.3613 21.0145 15.9505 19.5996 15.3324C19.0935 15.1113 18.8625 14.5217 19.0837 14.0157Z" fill={color} />
      <Path d="M6 13C2.68629 13 0 15.6863 0 19V21C0 21.5523 0.447715 22 1 22C1.55228 22 2 21.5523 2 21V19C2 16.7909 3.79086 15 6 15H12C14.2091 15 16 16.7909 16 19V21C16 21.5523 16.4477 22 17 22C17.5523 22 18 21.5523 18 21V19C18 15.6863 15.3137 13 12 13H6Z" fill={color} />
    </Svg>
  );
}

function NavButton({
  item,
  highlighted,
  selected,
  activeIconColor,
  inactiveIconColor,
  onPressIn,
  onPressOut,
}: {
  item: NavItem;
  highlighted: boolean;
  selected: boolean;
  activeIconColor: string;
  inactiveIconColor: string;
  onPressIn: () => void;
  onPressOut: () => void;
}): JSX.Element {
  const activeProgress = useSharedValue(highlighted ? 1 : 0);

  useEffect(() => {
    activeProgress.value = withTiming(highlighted ? 1 : 0, { duration: 120 });
  }, [activeProgress, highlighted]);

  const activeTileStyle = useAnimatedStyle(() => ({
    opacity: activeProgress.value,
    transform: [{ scale: 0.92 + activeProgress.value * 0.08 }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.label}
      accessibilityState={{ selected }}
      onPress={() => router.push(item.href)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.navButton}
    >
      <View style={styles.iconHalo}>
        <Animated.View style={[styles.activeIconBackground, activeTileStyle]} />
        <NavIcon name={item.icon} color={highlighted ? activeIconColor : inactiveIconColor} />
      </View>
    </Pressable>
  );
}

export function FloatingNav(): JSX.Element {
  const pathname = usePathname();
  const [pressedHref, setPressedHref] = useState<NavItem["href"] | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const activeColor = "#082f49";
  const inactiveColor = isDark ? "#94a3b8" : "#64748b";
  const glassColor = isDark ? "rgba(20, 24, 31, 0.62)" : "rgba(255, 255, 255, 0.62)";
  const borderColor = isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.86)";

  const overrideHref = pressedHref !== null && !isActive(pathname, pressedHref) ? pressedHref : null;


  return (
    <View pointerEvents="box-none" style={styles.wrap}>
      <View style={[styles.glassBar, { backgroundColor: glassColor, borderColor }, frostedWeb]}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const highlighted = overrideHref === null ? active : overrideHref === item.href;

          return (
            <NavButton
              activeIconColor={activeColor}
              highlighted={highlighted}
              inactiveIconColor={inactiveColor}
              item={item}
              key={item.href}
              onPressIn={() => setPressedHref(item.href)}
              onPressOut={() => undefined}
              selected={active}
            />
          );
        })}
      </View>
    </View>
  );
}

const glassSurface = {
  borderWidth: 1,
  elevation: 0,
  shadowOpacity: 0,
} as const;

const frostedWeb =
  Platform.OS === "web"
    ? ({
        backdropFilter: "blur(26px) saturate(180%)",
        WebkitBackdropFilter: "blur(26px) saturate(180%)",
      } as object)
    : null;

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    backgroundColor: "transparent",
    bottom: 34,
    flexDirection: "row",
    justifyContent: "center",
    left: 16,
    position: "absolute",
    right: 16,
  },
  glassBar: {
    ...glassSurface,
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 18,
    flexDirection: "row",
    height: 52,
    justifyContent: "space-around",
    maxWidth: 356,
    overflow: "hidden",
    paddingHorizontal: 6,
    width: "100%",
  },
  navButton: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 14,
    flex: 1,
    height: 40,
    justifyContent: "center",
    minWidth: 46,
  },
  iconHalo: {
    alignItems: "center",
    borderRadius: 13,
    backgroundColor: "transparent",
    height: 40,
    justifyContent: "center",
    overflow: "hidden",
    width: 48,
  },
  activeIconBackground: {
    backgroundColor: "rgba(56, 189, 248, 0.92)",
    borderRadius: 13,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
