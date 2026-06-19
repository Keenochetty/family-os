import type { JSX } from "react";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, useColorScheme, useWindowDimensions, View, type StyleProp, type ViewStyle } from "react-native";
import { useRouter, type Href } from "expo-router";
import { Menu } from "heroui-native";
import Svg, { Circle, Path, Polyline } from "react-native-svg";

export type HealthRealmId =
  | "general"
  | "fitness"
  | "nutrition"
  | "medication"
  | "cycle"
  | "baby"
  | "pregnancy"
  | "family"
  | "records"
  | "supplements"
  | "mentalHealth";

export type RealmProgressType = "ring" | "line" | "empty";
export type RealmTilePosition = "today" | "upcoming" | "attention" | "family";

export type HealthRealmDefinition = {
  id: HealthRealmId;
  label: string;
  icon: string;
  route: Href;
  accentColor: string;
  lightTileBackground: string;
  darkTileBackground: string;
  progressType: RealmProgressType;
  defaultPrimaryStat: string;
  defaultSecondaryStatus: string;
  defaultProgress: number;
  visible: boolean;
  permissionGate?: string;
};

export type HealthRealmTile = {
  id: HealthRealmId;
  primaryStat?: string;
  secondaryStatus?: string;
  progress?: number;
  progressType?: RealmProgressType;
  lineData?: number[];
};

export type HealthRealmBoardProps = {
  title?: string;
  subtitle?: string;
  tiles?: HealthRealmTile[];
  framed?: boolean;
  style?: StyleProp<ViewStyle>;
  onRealmPress?: (realm: HealthRealmDefinition) => void;
  onTileMenuAction?: (action: HealthTileMenuAction, realm: HealthRealmDefinition) => void;
  onBoardMenuAction?: (action: HealthBoardMenuAction) => void;
};

export type HealthControlWidgetProps = HealthRealmBoardProps;

type HealthTileMenuAction = "open" | "replace" | "move" | "info" | "hide";
type HealthBoardMenuAction = "edit" | "reorder" | "default" | "reset" | "privacy";

const TILE_BOARD_ASPECT_RATIO = 1574.92 / 1322.5;
const DEFAULT_TILE_IDS: HealthRealmId[] = ["medication", "fitness", "nutrition", "mentalHealth"];

export const HEALTH_REALM_THEMES: Record<HealthRealmId, HealthRealmDefinition> = {
  general: {
    id: "general",
    label: "Health",
    icon: "+",
    route: "/health",
    accentColor: "#111827",
    lightTileBackground: "#F8FAFC",
    darkTileBackground: "#3F3F46",
    progressType: "ring",
    defaultPrimaryStat: "Today",
    defaultSecondaryStatus: "Health overview",
    defaultProgress: 50,
    visible: true,
  },
  fitness: {
    id: "fitness",
    label: "Fitness",
    icon: "F",
    route: "/fitness",
    accentColor: "#C96A2B",
    lightTileBackground: "#F7D9C2",
    darkTileBackground: "#4A342A",
    progressType: "ring",
    defaultPrimaryStat: "55%",
    defaultSecondaryStatus: "Weekly goal",
    defaultProgress: 55,
    visible: true,
  },
  nutrition: {
    id: "nutrition",
    label: "Nutrition",
    icon: "N",
    route: "/food",
    accentColor: "#35A96B",
    lightTileBackground: "#CDEFD9",
    darkTileBackground: "#284539",
    progressType: "line",
    defaultPrimaryStat: "34%",
    defaultSecondaryStatus: "Logged today",
    defaultProgress: 34,
    visible: true,
  },
  medication: {
    id: "medication",
    label: "Medication",
    icon: "M",
    route: "/medication",
    accentColor: "#56C596",
    lightTileBackground: "#C9F4D2",
    darkTileBackground: "#294C40",
    progressType: "ring",
    defaultPrimaryStat: "3/4 done",
    defaultSecondaryStatus: "Next dose 19:00",
    defaultProgress: 75,
    visible: true,
  },
  cycle: {
    id: "cycle",
    label: "Cycle",
    icon: "C",
    route: "/cycle",
    accentColor: "#C2185B",
    lightTileBackground: "#F4C8DA",
    darkTileBackground: "#4D2637",
    progressType: "ring",
    defaultPrimaryStat: "Day 18",
    defaultSecondaryStatus: "Fertile window",
    defaultProgress: 62,
    visible: true,
  },
  baby: {
    id: "baby",
    label: "Baby",
    icon: "B",
    route: "/baby-child",
    accentColor: "#F4B18A",
    lightTileBackground: "#F8DDCC",
    darkTileBackground: "#514036",
    progressType: "ring",
    defaultPrimaryStat: "2 logs",
    defaultSecondaryStatus: "Feeding due soon",
    defaultProgress: 42,
    visible: true,
  },
  pregnancy: {
    id: "pregnancy",
    label: "Pregnancy",
    icon: "P",
    route: "/pregnancy",
    accentColor: "#D8B49C",
    lightTileBackground: "#F1DED2",
    darkTileBackground: "#504138",
    progressType: "ring",
    defaultPrimaryStat: "Week 22",
    defaultSecondaryStatus: "Next checkup",
    defaultProgress: 55,
    visible: true,
  },
  family: {
    id: "family",
    label: "Family",
    icon: "F",
    route: "/family-circle",
    accentColor: "#E5C94C",
    lightTileBackground: "#F5EDB8",
    darkTileBackground: "#514B2F",
    progressType: "line",
    defaultPrimaryStat: "5 updates",
    defaultSecondaryStatus: "2 shared today",
    defaultProgress: 68,
    visible: true,
  },
  records: {
    id: "records",
    label: "Records",
    icon: "R",
    route: "/records",
    accentColor: "#8EA4C8",
    lightTileBackground: "#D8E2F1",
    darkTileBackground: "#354152",
    progressType: "empty",
    defaultPrimaryStat: "Ready",
    defaultSecondaryStatus: "Set up records",
    defaultProgress: 0,
    visible: true,
  },
  supplements: {
    id: "supplements",
    label: "Supplements",
    icon: "S",
    route: "/supplements",
    accentColor: "#A78BFA",
    lightTileBackground: "#E3D8FF",
    darkTileBackground: "#443A61",
    progressType: "ring",
    defaultPrimaryStat: "2/3 done",
    defaultSecondaryStatus: "Today",
    defaultProgress: 66,
    visible: true,
  },
  mentalHealth: {
    id: "mentalHealth",
    label: "Mental Health",
    icon: "M",
    route: "/mental-health",
    accentColor: "#6D7DF2",
    lightTileBackground: "#DDE2FF",
    darkTileBackground: "#343A64",
    progressType: "line",
    defaultPrimaryStat: "Calm",
    defaultSecondaryStatus: "Mood check-in due",
    defaultProgress: 48,
    visible: true,
  },
};

function clampPercent(percent: number): number {
  return Math.max(0, Math.min(100, percent));
}

function resolveTile(tile: HealthRealmTile): HealthRealmTile & { definition: HealthRealmDefinition; progress: number; progressType: RealmProgressType } {
  const definition = HEALTH_REALM_THEMES[tile.id];

  return {
    ...tile,
    definition,
    primaryStat: tile.primaryStat ?? definition.defaultPrimaryStat,
    secondaryStatus: tile.secondaryStatus ?? definition.defaultSecondaryStatus,
    progress: clampPercent(tile.progress ?? definition.defaultProgress),
    progressType: tile.progressType ?? definition.progressType,
  };
}

function defaultTiles(): HealthRealmTile[] {
  return DEFAULT_TILE_IDS.map((id) => ({ id }));
}

export function HealthRealmBoard({
  title = "Health Control",
  subtitle = "Your modular health board",
  tiles = defaultTiles(),
  framed = true,
  style,
  onRealmPress,
  onTileMenuAction,
  onBoardMenuAction,
}: HealthRealmBoardProps): JSX.Element {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [tileMenuRealmId, setTileMenuRealmId] = useState<HealthRealmId | null>(null);
  const [boardMenuOpen, setBoardMenuOpen] = useState(false);

  const cardWidth = Math.min(width - 32, framed ? 420 : 480);
  const boardWidth = cardWidth - (framed ? 36 : 0);
  const boardHeight = boardWidth / TILE_BOARD_ASPECT_RATIO;
  const headingColor = framed || isDark ? "#ffffff" : "#111827";
  const mutedColor = framed || isDark ? "#b8b8c0" : "#64748b";
  const resolvedTiles = useMemo(() => tiles.slice(0, 4).map(resolveTile), [tiles]);

  const positionedTiles = ["today", "upcoming", "attention", "family"].map((position, index) => ({
    position: position as RealmTilePosition,
    tile: resolvedTiles[index] ?? resolveTile({ id: DEFAULT_TILE_IDS[index] }),
  }));

  function openRealm(realm: HealthRealmDefinition): void {
    onRealmPress?.(realm);
    router.push(realm.route);
  }

  function handleTileAction(action: HealthTileMenuAction, realm: HealthRealmDefinition): void {
    setTileMenuRealmId(null);
    onTileMenuAction?.(action, realm);

    if (action === "open") {
      openRealm(realm);
    }
  }

  function handleBoardAction(action: HealthBoardMenuAction): void {
    setBoardMenuOpen(false);
    onBoardMenuAction?.(action);
  }

  return (
    <View style={[styles.container, framed ? styles.framedCard : styles.frameless, { width: cardWidth }, style]}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={[styles.heading, { color: headingColor }]}>{title}</Text>
          <Text style={[styles.subheading, { color: mutedColor }]}>{subtitle}</Text>
        </View>
        <HealthBoardManageSheet isOpen={boardMenuOpen} onAction={handleBoardAction} onOpenChange={setBoardMenuOpen} textColor={headingColor} />
      </View>

      <View style={[styles.tileBoard, { height: boardHeight, width: boardWidth }]}> 
        <InterlockingTileSvg isDark={isDark} tiles={positionedTiles} />
        {positionedTiles.map(({ position, tile }) => (
          <HealthRealmTileButton
            isDark={isDark}
            key={position}
            onLongPress={() => setTileMenuRealmId(tile.id)}
            onPress={() => openRealm(tile.definition)}
            position={position}
            tile={tile}
          />
        ))}
        <CenterConnector />
      </View>

      {tileMenuRealmId ? (
        <HealthRealmMenu
          isOpen
          onAction={handleTileAction}
          onOpenChange={(open) => !open && setTileMenuRealmId(null)}
          realm={HEALTH_REALM_THEMES[tileMenuRealmId]}
        />
      ) : null}
    </View>
  );
}

function HealthRealmTileButton({
  tile,
  position,
  isDark,
  onPress,
  onLongPress,
}: {
  tile: ReturnType<typeof resolveTile>;
  position: RealmTilePosition;
  isDark: boolean;
  onPress: () => void;
  onLongPress: () => void;
}): JSX.Element {
  const { definition } = tile;
  const textColor = isDark ? "#f8fafc" : "#151515";
  const mutedTileText = isDark ? "rgba(248,250,252,0.72)" : "rgba(21,21,21,0.68)";

  return (
    <Pressable
      accessibilityLabel={`${definition.label}: ${tile.primaryStat}. ${tile.secondaryStatus}`}
      accessibilityRole="button"
      delayLongPress={450}
      onLongPress={onLongPress}
      onPress={onPress}
      style={({ pressed }) => [styles.tileContent, styles[position], pressed && styles.tilePressed]}
    >
      <View style={[styles.tileHeader, position === "upcoming" || position === "family" ? styles.tileHeaderRight : null]}>
        <Text numberOfLines={1} style={[styles.realmTitle, { color: textColor }]}>{definition.label}</Text>
      </View>
      <Text numberOfLines={1} style={[styles.realmPrimary, { color: textColor }]}>{tile.primaryStat}</Text>
      <Text numberOfLines={2} style={[styles.realmSecondary, { color: mutedTileText }]}>{tile.secondaryStatus}</Text>
      <View pointerEvents="none" style={[styles.progressVisualSlot, styles[`${position}Progress`]]}>
        <RealmProgressVisual accent={definition.accentColor} isDark={isDark} lineData={tile.lineData} progress={tile.progress} type={tile.progressType} />
      </View>
    </Pressable>
  );
}

function RealmProgressVisual({
  accent,
  isDark,
  lineData,
  progress,
  type,
}: {
  accent: string;
  isDark: boolean;
  lineData?: number[];
  progress: number;
  type: RealmProgressType;
}): JSX.Element {
  const track = isDark ? "rgba(255,255,255,0.22)" : "rgba(15,23,42,0.14)";

  if (type === "line") {
    const data = lineData && lineData.length >= 2 ? lineData : [20, 48, 34, 70, progress];
    const points = data.map((value, index) => `${(index / (data.length - 1)) * 58},${34 - (clampPercent(value) / 100) * 28}`).join(" ");

    return (
      <Svg height="42" viewBox="0 0 58 42" width="58">
        <Polyline fill="none" points="0,35 58,35" stroke={track} strokeLinecap="round" strokeWidth={3} />
        <Polyline fill="none" points={points} stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} />
      </Svg>
    );
  }

  if (type === "empty") {
    return (
      <Svg height="44" viewBox="0 0 44 44" width="44">
        <Circle cx="22" cy="22" fill="none" r="16" stroke={track} strokeWidth="5" />
        <Path d="M15 22h14" stroke={accent} strokeLinecap="round" strokeWidth="5" />
      </Svg>
    );
  }

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const dash = (progress / 100) * circumference;

  return (
    <Svg height="46" viewBox="0 0 46 46" width="46">
      <Circle cx="23" cy="23" fill="none" r={radius} stroke={track} strokeWidth="5" />
      <Circle
        cx="23"
        cy="23"
        fill="none"
        r={radius}
        stroke={accent}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeLinecap="round"
        strokeWidth="5"
        transform="rotate(-90 23 23)"
      />
    </Svg>
  );
}

function InterlockingTileSvg({
  isDark,
  tiles,
}: {
  isDark: boolean;
  tiles: { position: RealmTilePosition; tile: ReturnType<typeof resolveTile> }[];
}): JSX.Element {
  const byPosition = Object.fromEntries(tiles.map(({ position, tile }) => [position, tile.definition])) as Record<RealmTilePosition, HealthRealmDefinition>;
  const fillFor = (position: RealmTilePosition) => isDark ? byPosition[position].darkTileBackground : byPosition[position].lightTileBackground;

  return (
    <Svg height="100%" pointerEvents="none" preserveAspectRatio="xMidYMid meet" style={styles.shapeSvg} viewBox="0 0 1574.92 1322.5" width="100%">
      <Path d="M48.88 1.94l119.96 0c0.39,0.27 0.77,0.46 1.16,0.46l359.94 0c22.28,0 41.06,15.73 45.79,36.62l8.51 58.33c3.73,25.55 21.16,45.59 46.94,46.94l97.61 5.15c17.81,4.77 31.41,19.22 34.22,37.73l0 279.28c0,9.29 -3.63,14.96 -10.41,21.73l-134.86 137.6c-9.08,9.08 -16.44,10.41 -32.45,10.41l-536.43 0c-25.82,0 -46.94,-21.12 -46.94,-46.94l0 -540.37c0,-25.82 21.12,-46.94 46.94,-46.94z" fill={fillFor("today")} />
      <Path d="M1526.03 1.94l-119.96 0c-0.39,0.27 -0.77,0.46 -1.16,0.46l-359.94 0c-22.28,0 -41.06,15.73 -45.79,36.62l-8.51 58.33c-3.73,25.55 -21.16,45.59 -46.94,46.94l-97.61 5.15c-17.81,4.77 -31.41,19.22 -34.22,37.73l0 279.28c0,9.29 3.63,14.96 10.41,21.73l134.86 137.6c9.08,9.08 16.44,10.41 32.45,10.41l536.43 0c25.82,0 46.94,-21.12 46.94,-46.94l0 -540.37c0,-25.82 -21.12,-46.94 -46.94,-46.94z" fill={fillFor("upcoming")} />
      <Path d="M1526.03 1320.56l-119.96 0c-0.39,-0.27 -0.77,-0.46 -1.16,-0.46l-359.94 0c-22.28,0 -41.06,-15.73 -45.79,-36.62l-8.51 -58.33c-3.73,-25.55 -21.16,-45.59 -46.94,-46.94l-97.61 -5.15c-17.81,-4.77 -31.41,-19.22 -34.22,-37.73l0 -279.28c0,-9.29 3.63,-14.96 10.41,-21.73l134.86 -137.6c9.08,-9.08 16.44,-10.41 32.45,-10.41l536.43 0c25.82,0 46.94,21.12 46.94,46.94l0 540.37c0,25.82 -21.12,46.94 -46.94,46.94z" fill={fillFor("family")} />
      <Path d="M48.88 1320.56l119.96 0c0.39,-0.27 0.77,-0.46 1.16,-0.46l359.94 0c22.28,0 41.06,-15.73 45.79,-36.62l8.51 -58.33c3.73,-25.55 21.16,-45.59 46.94,-46.94l97.61 -5.15c17.81,-4.77 31.41,-19.22 34.22,-37.73l0 -279.28c0,-9.29 -3.63,-14.96 -10.41,-21.73l-134.86 -137.6c-9.08,-9.08 -16.44,-10.41 -32.45,-10.41l-536.43 0c-25.82,0 -46.94,21.12 -46.94,46.94l0 540.37c0,25.82 21.12,46.94 46.94,46.94z" fill={fillFor("attention")} />
    </Svg>
  );
}

function CenterConnector(): JSX.Element {
  return (
    <View pointerEvents="none" style={styles.centerConnector}>
      <Svg height="100%" viewBox="0 0 24 24" width="100%">
        <Path d="M8.15 19.725q-.375-.275-.55-.7L5.3 13H2q-.425 0-.712-.288T1 12t.288-.712T2 11h4q.325 0 .563.175t.362.475L9 17.1l4.6-12.125q.175-.425.55-.7T15 4t.85.275t.55.7L18.7 11H22q.425 0 .713.288T23 12t-.288.713T22 13h-4q-.325 0-.562-.175t-.363-.475L15 6.9l-4.6 12.125q-.175.425-.55.7T9 20t-.85-.275" fill="#ffffff" />
      </Svg>
    </View>
  );
}

function HealthRealmMenu({
  isOpen,
  onAction,
  onOpenChange,
  realm,
}: {
  isOpen: boolean;
  onAction: (action: HealthTileMenuAction, realm: HealthRealmDefinition) => void;
  onOpenChange: (open: boolean) => void;
  realm: HealthRealmDefinition;
}): JSX.Element {
  return (
    <Menu isOpen={isOpen} onOpenChange={onOpenChange} presentation="popover">
      <Menu.Portal>
        <Menu.Content presentation="popover">
          <Menu.Label>{realm.label}</Menu.Label>
          <Menu.Item onPress={() => onAction("open", realm)}><Menu.ItemTitle>Open realm</Menu.ItemTitle></Menu.Item>
          <Menu.Item onPress={() => onAction("replace", realm)}><Menu.ItemTitle>Replace tile</Menu.ItemTitle></Menu.Item>
          <Menu.Item onPress={() => onAction("move", realm)}><Menu.ItemTitle>Move position</Menu.ItemTitle></Menu.Item>
          <Menu.Item onPress={() => onAction("info", realm)}><Menu.ItemTitle>View realm info</Menu.ItemTitle></Menu.Item>
          <Menu.Item onPress={() => onAction("hide", realm)}><Menu.ItemTitle>Hide from Health Control</Menu.ItemTitle></Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  );
}

function KebabMenuIcon({ color }: { color: string }): JSX.Element {
  return (
    <Svg height="20" viewBox="0 0 20 20" width="20">
      <Circle cx="10" cy="4.5" fill={color} r="1.55" />
      <Circle cx="10" cy="10" fill={color} r="1.55" />
      <Circle cx="10" cy="15.5" fill={color} r="1.55" />
    </Svg>
  );
}

function HealthBoardManageSheet({
  isOpen,
  onAction,
  onOpenChange,
  textColor,
}: {
  isOpen: boolean;
  onAction: (action: HealthBoardMenuAction) => void;
  onOpenChange: (open: boolean) => void;
  textColor: string;
}): JSX.Element {
  return (
    <Menu isOpen={isOpen} onOpenChange={onOpenChange} presentation="popover">
      <Menu.Trigger asChild>
        <Pressable accessibilityLabel="Manage health board" accessibilityRole="button" style={styles.menuButton}>
          <KebabMenuIcon color={textColor} />
        </Pressable>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content align="end" placement="bottom" presentation="popover" width={260}>
          <Menu.Label>Health Control</Menu.Label>
          <Menu.Item onPress={() => onAction("edit")}><Menu.ItemTitle>Edit Health Realms</Menu.ItemTitle></Menu.Item>
          <Menu.Item onPress={() => onAction("reorder")}><Menu.ItemTitle>Reorder Tiles</Menu.ItemTitle></Menu.Item>
          <Menu.Item onPress={() => onAction("default")}><Menu.ItemTitle>Choose Default Realm</Menu.ItemTitle></Menu.Item>
          <Menu.Item onPress={() => onAction("reset")}><Menu.ItemTitle>Reset Board</Menu.ItemTitle></Menu.Item>
          <Menu.Item onPress={() => onAction("privacy")}><Menu.ItemTitle>Health Privacy</Menu.ItemTitle></Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  );
}

export function HealthControlWidget(props: HealthControlWidgetProps): JSX.Element {
  return <HealthRealmBoard {...props} />;
}


const styles = StyleSheet.create({
  container: { alignSelf: "center" },
  framedCard: {
    backgroundColor: "#333338",
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 32,
    borderWidth: 1,
    elevation: 9,
    overflow: "hidden",
    paddingHorizontal: 18,
    paddingTop: 18,
    shadowColor: "#000000",
    shadowOffset: { height: 18, width: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 38,
  },
  frameless: { backgroundColor: "transparent", overflow: "visible" },
  header: { alignItems: "flex-start", flexDirection: "row", gap: 12, justifyContent: "space-between", marginBottom: 4 },
  headerCopy: { flex: 1 },
  heading: { fontSize: 28, fontWeight: "900", letterSpacing: 0, lineHeight: 31 },
  subheading: { fontSize: 13, fontWeight: "600", letterSpacing: 0, lineHeight: 16, marginTop: 6 },
  menuButton: { alignItems: "center", backgroundColor: "rgba(15,23,42,0.08)", borderRadius: 999, height: 36, justifyContent: "center", width: 36 },
  tileBoard: { alignSelf: "center", marginBottom: 8, marginTop: 14, position: "relative" },
  shapeSvg: { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
  tileContent: { backgroundColor: "transparent", position: "absolute", zIndex: 3 },
  tilePressed: { transform: [{ scale: 0.98 }] },
  today: { height: "39%", left: "4%", paddingLeft: "8%", paddingRight: "10%", paddingTop: "7%", top: "5%", width: "43%" },
  upcoming: { alignItems: "flex-start", height: "39%", paddingLeft: "14%", paddingRight: "4%", paddingTop: "7%", right: "3%", top: "5%", width: "43%" },
  attention: { bottom: "3%", height: "39%", left: "4%", paddingBottom: "7%", paddingLeft: "8%", paddingRight: "10%", width: "43%" },
  family: { bottom: "3%", height: "39%", paddingBottom: "7%", paddingLeft: "14%", paddingRight: "4%", right: "3%", width: "43%" },
  tileHeader: { alignItems: "center", flexDirection: "row", maxWidth: "100%" },
  tileHeaderRight: { paddingRight: 2 },
  realmTitle: { flex: 1, fontSize: 12, fontWeight: "900", letterSpacing: 0, lineHeight: 14 },
  realmPrimary: { fontSize: 18, fontWeight: "900", letterSpacing: 0, lineHeight: 20, marginTop: 8 },
  realmSecondary: { fontSize: 11, fontWeight: "700", letterSpacing: 0, lineHeight: 13, marginTop: 3, maxWidth: "78%" },
  progressVisualSlot: { position: "absolute" },
  todayProgress: { bottom: "9%", right: "8%" },
  upcomingProgress: { bottom: "9%", left: "12%" },
  attentionProgress: { bottom: "9%", left: "9%" },
  familyProgress: { bottom: "9%", right: "8%" },
  centerConnector: { height: 42, left: "50%", marginLeft: -21, marginTop: -21, position: "absolute", top: "50%", width: 42, zIndex: 4 },
});
