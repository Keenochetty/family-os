import type { JSX } from "react";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, useColorScheme, useWindowDimensions, View, type StyleProp, type ViewStyle } from "react-native";
import { useFocusEffect, useRouter, type Href } from "expo-router";
import { Menu } from "heroui-native";
import Svg, { Circle, Line, Path, Polyline, Rect, Text as SvgText } from "react-native-svg";

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
type TileShapePosition = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
type TileColumn = "left" | "right";
export type TopicVisualType =
  | "pillCount"
  | "scheduleDots"
  | "alertStack"
  | "familyBubbles"
  | "fitnessBars"
  | "mealDots"
  | "moodWave"
  | "nutritionGoalRing"
  | "sparkline"
  | "sleepBars"
  | "progressRing";

export type WeeklyGoalDay = {
  day: "M" | "T" | "W" | "T2" | "F" | "S" | "S2";
  planned: boolean;
  completed: boolean;
};

export type NutritionConsumptionItem = {
  id: string;
  label: string;
  icon: "bowl" | "smoothie";
  consumed: boolean;
  color?: string;
};

type NormalizedNutritionConsumptionItem = NutritionConsumptionItem & { color: string };

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
  moduleLabel?: string;
  displayTitle?: string;
  primaryValue?: string;
  contextLine?: string;
  visualType?: TopicVisualType;
  primaryStat?: string;
  secondaryStatus?: string;
  progress?: number;
  progressType?: RealmProgressType;
  lineData?: number[];
  weeklyGoalDays?: WeeklyGoalDay[];
  nutritionConsumptionItems?: NutritionConsumptionItem[];
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
type GuideRect = { height: number; width: number; x: number; y: number };
type TileDetailLayout = {
  column: TileColumn;
  dataArea: GuideRect;
  moduleLabel: GuideRect;
  tileBounds: GuideRect;
  visualThreshold: GuideRect;
};

const TILE_BOARD_ASPECT_RATIO = 1574.92 / 1322.5;
const GUIDE_VIEWBOX = { height: 1324.14, width: 1575.1 };
const DEFAULT_TILE_IDS: HealthRealmId[] = ["medication", "fitness", "nutrition", "mentalHealth"];
const NUTRITION_CONSUMED_COLOR = "#35A96B";
const NUTRITION_PENDING_COLOR = "#9CA3AF";
const DEFAULT_NUTRITION_CONSUMPTION_ITEMS: NutritionConsumptionItem[] = [
  { color: NUTRITION_CONSUMED_COLOR, consumed: true, icon: "bowl", id: "breakfast", label: "Breakfast" },
  { color: NUTRITION_CONSUMED_COLOR, consumed: true, icon: "smoothie", id: "morning-smoothie", label: "Morning smoothie" },
  { color: NUTRITION_CONSUMED_COLOR, consumed: true, icon: "bowl", id: "snack-bowl", label: "Snack bowl" },
  { color: NUTRITION_CONSUMED_COLOR, consumed: true, icon: "smoothie", id: "green-smoothie", label: "Green smoothie" },
  { color: NUTRITION_CONSUMED_COLOR, consumed: false, icon: "bowl", id: "lunch", label: "Lunch" },
  { color: NUTRITION_CONSUMED_COLOR, consumed: false, icon: "smoothie", id: "protein-smoothie", label: "Protein smoothie" },
  { color: NUTRITION_CONSUMED_COLOR, consumed: false, icon: "bowl", id: "afternoon-meal", label: "Afternoon meal" },
  { color: NUTRITION_CONSUMED_COLOR, consumed: false, icon: "smoothie", id: "evening-smoothie", label: "Evening smoothie" },
  { color: NUTRITION_CONSUMED_COLOR, consumed: false, icon: "bowl", id: "dinner", label: "Dinner" },
];
const WEEKLY_GOAL_DAY_ORDER: WeeklyGoalDay["day"][] = ["S", "M", "T", "W", "T2", "F", "S2"];
const WEEKLY_GOAL_DAY_LABELS: Record<WeeklyGoalDay["day"], string> = {
  F: "F",
  M: "M",
  S: "S",
  S2: "S",
  T: "T",
  T2: "T",
  W: "W",
};
const DEFAULT_WEEKLY_GOAL_DAYS: WeeklyGoalDay[] = [
  { completed: false, day: "S", planned: false },
  { completed: true, day: "M", planned: true },
  { completed: true, day: "T", planned: true },
  { completed: true, day: "W", planned: true },
  { completed: false, day: "T2", planned: true },
  { completed: false, day: "F", planned: true },
  { completed: false, day: "S2", planned: false },
];
const POSITION_TO_SHAPE_MAP: Record<RealmTilePosition, TileShapePosition> = {
  today: "topLeft",
  upcoming: "topRight",
  attention: "bottomLeft",
  family: "bottomRight",
};
const TILE_SHAPE_PATHS: Record<RealmTilePosition, string> = {
  today: "M48.88 1.94l119.96 0c0.39,0.27 0.77,0.46 1.16,0.46l359.94 0c22.28,0 41.06,15.73 45.79,36.62l8.51 58.33c3.73,25.55 21.16,45.59 46.94,46.94l97.61 5.15c17.81,4.77 31.41,19.22 34.22,37.73l0 279.28c0,9.29 -3.63,14.96 -10.41,21.73l-134.86 137.6c-9.08,9.08 -16.44,10.41 -32.45,10.41l-536.43 0c-25.82,0 -46.94,-21.12 -46.94,-46.94l0 -540.37c0,-25.82 21.12,-46.94 46.94,-46.94z",
  upcoming: "M1526.03 1.94l-119.96 0c-0.39,0.27 -0.77,0.46 -1.16,0.46l-359.94 0c-22.28,0 -41.06,15.73 -45.79,36.62l-8.51 58.33c-3.73,25.55 -21.16,45.59 -46.94,46.94l-97.61 5.15c-17.81,4.77 -31.41,19.22 -34.22,37.73l0 279.28c0,9.29 3.63,14.96 10.41,21.73l134.86 137.6c9.08,9.08 16.44,10.41 32.45,10.41l536.43 0c25.82,0 46.94,-21.12 46.94,-46.94l0 -540.37c0,-25.82 -21.12,-46.94 -46.94,-46.94z",
  attention: "M48.88 1320.56l119.96 0c0.39,-0.27 0.77,-0.46 1.16,-0.46l359.94 0c22.28,0 41.06,-15.73 45.79,-36.62l8.51 -58.33c3.73,-25.55 21.16,-45.59 46.94,-46.94l97.61 -5.15c17.81,-4.77 31.41,-19.22 34.22,-37.73l0 -279.28c0,-9.29 -3.63,-14.96 -10.41,-21.73l-134.86 -137.6c-9.08,-9.08 -16.44,-10.41 -32.45,-10.41l-536.43 0c-25.82,0 -46.94,21.12 -46.94,46.94l0 540.37c0,25.82 21.12,46.94 46.94,46.94z",
  family: "M1526.03 1320.56l-119.96 0c-0.39,-0.27 -0.77,-0.46 -1.16,-0.46l-359.94 0c-22.28,0 -41.06,-15.73 -45.79,-36.62l-8.51 -58.33c-3.73,-25.55 -21.16,-45.59 -46.94,-46.94l-97.61 -5.15c-17.81,-4.77 -31.41,-19.22 -34.22,-37.73l0 -279.28c0,-9.29 3.63,-14.96 10.41,-21.73l134.86 -137.6c9.08,-9.08 16.44,-10.41 32.45,-10.41l536.43 0c25.82,0 46.94,21.12 46.94,46.94l0 540.37c0,25.82 -21.12,46.94 -46.94,46.94z",
};
const TILE_DETAIL_LAYOUTS: Record<TileShapePosition, TileDetailLayout> = {
  topLeft: {
    column: "left",
    dataArea: { height: 249.58, width: 761.13, x: 1.94, y: 144.5 },
    moduleLabel: { height: 110, width: 430, x: 56.65, y: 20 },
    tileBounds: { height: 634.3, width: 761.13, x: 1.94, y: 1.94 },
    visualThreshold: { height: 240.53, width: 760.35, x: 1.94, y: 394.39 },
  },
  topRight: {
    column: "right",
    dataArea: { height: 249.58, width: 761.13, x: 812.03, y: 144.5 },
    moduleLabel: { height: 110, width: 455, x: 1054.1, y: 20 },
    tileBounds: { height: 634.3, width: 761.13, x: 812.03, y: 1.94 },
    visualThreshold: { height: 240.53, width: 760.35, x: 812.81, y: 394.39 },
  },
  bottomLeft: {
    column: "left",
    dataArea: { height: 249.58, width: 761.13, x: 1.94, y: 930.05 },
    moduleLabel: { height: 110, width: 430, x: 56.65, y: 1190 },
    tileBounds: { height: 634.3, width: 761.13, x: 1.94, y: 687.9 },
    visualThreshold: { height: 240.53, width: 760.35, x: 1.94, y: 689.22 },
  },
  bottomRight: {
    column: "right",
    dataArea: { height: 249.58, width: 761.13, x: 812.03, y: 930.05 },
    moduleLabel: { height: 110, width: 455, x: 1054.1, y: 1190 },
    tileBounds: { height: 634.3, width: 761.13, x: 812.03, y: 687.9 },
    visualThreshold: { height: 240.53, width: 760.35, x: 812.81, y: 689.22 },
  },
} as const;

export const HEALTH_REALM_THEMES: Record<HealthRealmId, HealthRealmDefinition> = {
  general: {
    accentColor: "#111827",
    darkTileBackground: "#3F3F46",
    defaultPrimaryStat: "Today",
    defaultProgress: 50,
    defaultSecondaryStatus: "Health overview",
    icon: "+",
    id: "general",
    label: "Health",
    lightTileBackground: "#F8FAFC",
    progressType: "ring",
    route: "/health",
    visible: true,
  },
  fitness: {
    accentColor: "#C96A2B",
    darkTileBackground: "#4A342A",
    defaultPrimaryStat: "55%",
    defaultProgress: 55,
    defaultSecondaryStatus: "Weekly goal",
    icon: "F",
    id: "fitness",
    label: "Fitness",
    lightTileBackground: "#F7D9C2",
    progressType: "ring",
    route: "/fitness",
    visible: true,
  },
  nutrition: {
    accentColor: "#35A96B",
    darkTileBackground: "#284539",
    defaultPrimaryStat: "4/9",
    defaultProgress: 44,
    defaultSecondaryStatus: "5 meals + 4 smoothies",
    icon: "N",
    id: "nutrition",
    label: "Nutrition",
    lightTileBackground: "#CDEFD9",
    progressType: "line",
    route: "/food",
    visible: true,
  },
  medication: {
    accentColor: "#56C596",
    darkTileBackground: "#294C40",
    defaultPrimaryStat: "3/4",
    defaultProgress: 75,
    defaultSecondaryStatus: "Next dose 19:00",
    icon: "M",
    id: "medication",
    label: "Medication",
    lightTileBackground: "#C9F4D2",
    progressType: "ring",
    route: "/medication",
    visible: true,
  },
  cycle: {
    accentColor: "#C2185B",
    darkTileBackground: "#4D2637",
    defaultPrimaryStat: "Day 18",
    defaultProgress: 62,
    defaultSecondaryStatus: "Fertile window",
    icon: "C",
    id: "cycle",
    label: "Cycle",
    lightTileBackground: "#F4C8DA",
    progressType: "ring",
    route: "/cycle",
    visible: true,
  },
  baby: {
    accentColor: "#F4B18A",
    darkTileBackground: "#514036",
    defaultPrimaryStat: "2 logs",
    defaultProgress: 42,
    defaultSecondaryStatus: "Feeding due soon",
    icon: "B",
    id: "baby",
    label: "Baby",
    lightTileBackground: "#F8DDCC",
    progressType: "ring",
    route: "/baby-child",
    visible: true,
  },
  pregnancy: {
    accentColor: "#D8B49C",
    darkTileBackground: "#504138",
    defaultPrimaryStat: "Week 22",
    defaultProgress: 55,
    defaultSecondaryStatus: "Next checkup",
    icon: "P",
    id: "pregnancy",
    label: "Pregnancy",
    lightTileBackground: "#F1DED2",
    progressType: "ring",
    route: "/pregnancy",
    visible: true,
  },
  family: {
    accentColor: "#E5C94C",
    darkTileBackground: "#514B2F",
    defaultPrimaryStat: "5 updates",
    defaultProgress: 68,
    defaultSecondaryStatus: "2 shared today",
    icon: "F",
    id: "family",
    label: "Family",
    lightTileBackground: "#F5EDB8",
    progressType: "line",
    route: "/family-circle",
    visible: true,
  },
  records: {
    accentColor: "#8EA4C8",
    darkTileBackground: "#354152",
    defaultPrimaryStat: "Ready",
    defaultProgress: 0,
    defaultSecondaryStatus: "Set up records",
    icon: "R",
    id: "records",
    label: "Records",
    lightTileBackground: "#D8E2F1",
    progressType: "empty",
    route: "/records",
    visible: true,
  },
  supplements: {
    accentColor: "#A78BFA",
    darkTileBackground: "#443A61",
    defaultPrimaryStat: "2/3 done",
    defaultProgress: 66,
    defaultSecondaryStatus: "Today",
    icon: "S",
    id: "supplements",
    label: "Supplements",
    lightTileBackground: "#E3D8FF",
    progressType: "ring",
    route: "/supplements",
    visible: true,
  },
  mentalHealth: {
    accentColor: "#6D7DF2",
    darkTileBackground: "#343A64",
    defaultPrimaryStat: "😌",
    defaultProgress: 48,
    defaultSecondaryStatus: "Check-in due",
    icon: "M",
    id: "mentalHealth",
    label: "Mental Health",
    lightTileBackground: "#DDE2FF",
    progressType: "line",
    route: "/mental-health",
    visible: true,
  },
};

function defaultDisplayTitleForRealm(id: HealthRealmId): string {
  switch (id) {
    case "medication":
      return "Antibiotic course";
    case "fitness":
      return "29-day plan";
    case "nutrition":
      return "Daily consumption";
    case "mentalHealth":
      return "Mood check-in";
    case "family":
      return "Family updates";
    case "cycle":
      return "Cycle tracking";
    case "baby":
      return "Baby care";
    case "pregnancy":
      return "Pregnancy plan";
    case "records":
      return "Health records";
    case "supplements":
      return "Supplement plan";
    case "general":
    default:
      return "Health overview";
  }
}

function defaultVisualTypeForRealm(id: HealthRealmId): TopicVisualType {
  switch (id) {
    case "medication":
      return "pillCount";
    case "fitness":
      return "fitnessBars";
    case "nutrition":
      return "nutritionGoalRing";
    case "mentalHealth":
      return "moodWave";
    case "family":
      return "familyBubbles";
    case "records":
      return "sparkline";
    case "baby":
    case "pregnancy":
      return "scheduleDots";
    case "cycle":
      return "scheduleDots";
    case "supplements":
      return "alertStack";
    case "general":
    default:
      return "progressRing";
  }
}

function clampPercent(percent: number): number {
  return Math.max(0, Math.min(100, percent));
}

function percent(value: number, total: number): `${number}%` {
  return `${(value / total) * 100}%` as `${number}%`;
}

function guideRectToBoardStyle(rect: GuideRect): ViewStyle {
  return {
    height: percent(rect.height, GUIDE_VIEWBOX.height),
    left: percent(rect.x, GUIDE_VIEWBOX.width),
    top: percent(rect.y, GUIDE_VIEWBOX.height),
    width: percent(rect.width, GUIDE_VIEWBOX.width),
  };
}

function guideRectToTileStyle(shapePosition: TileShapePosition, rect: GuideRect): ViewStyle {
  const tileBounds = TILE_DETAIL_LAYOUTS[shapePosition].tileBounds;

  return {
    height: percent(rect.height, tileBounds.height),
    left: percent(rect.x - tileBounds.x, tileBounds.width),
    top: percent(rect.y - tileBounds.y, tileBounds.height),
    width: percent(rect.width, tileBounds.width),
  };
}

function resolveTile(tile: HealthRealmTile): HealthRealmTile & {
  contextLine: string;
  definition: HealthRealmDefinition;
  displayTitle: string;
  moduleLabel: string;
  primaryValue: string;
  progress: number;
  progressType: RealmProgressType;
  visualType: TopicVisualType;
} {
  const definition = HEALTH_REALM_THEMES[tile.id];
  const nutritionItems = nutritionItemsOrDefault(tile.nutritionConsumptionItems);
  const defaultPrimaryValue = tile.id === "nutrition" ? nutritionPrimaryValue(nutritionItems) : definition.defaultPrimaryStat;
  const defaultContextLine = tile.id === "nutrition" ? nutritionContextLine(nutritionItems) : definition.defaultSecondaryStatus;

  return {
    ...tile,
    contextLine: tile.contextLine ?? tile.secondaryStatus ?? defaultContextLine,
    definition,
    displayTitle: tile.displayTitle ?? defaultDisplayTitleForRealm(tile.id),
    moduleLabel: tile.moduleLabel ?? definition.label,
    primaryValue: tile.primaryValue ?? tile.primaryStat ?? defaultPrimaryValue,
    primaryStat: tile.primaryStat ?? defaultPrimaryValue,
    secondaryStatus: tile.secondaryStatus ?? defaultContextLine,
    progress: clampPercent(tile.progress ?? definition.defaultProgress),
    progressType: tile.progressType ?? definition.progressType,
    visualType: tile.visualType ?? defaultVisualTypeForRealm(tile.id),
  };
}

function getTopicVisualType(tile: ReturnType<typeof resolveTile>): TopicVisualType {
  return tile.visualType;
}

function defaultTiles(): HealthRealmTile[] {
  return DEFAULT_TILE_IDS.map((id) => ({ id }));
}

function nutritionItemsOrDefault(items?: NutritionConsumptionItem[]): NormalizedNutritionConsumptionItem[] {
  const sourceItems = items && items.length > 0 ? items : DEFAULT_NUTRITION_CONSUMPTION_ITEMS;

  return sourceItems.map((item) => ({
    ...item,
    color: item.consumed ? item.color ?? NUTRITION_CONSUMED_COLOR : NUTRITION_PENDING_COLOR,
  }));
}

function nutritionPrimaryValue(items?: NutritionConsumptionItem[]): string {
  const normalizedItems = nutritionItemsOrDefault(items);
  const consumedCount = normalizedItems.filter((item) => item.consumed).length;

  return `${consumedCount}/${normalizedItems.length}`;
}

function nutritionContextLine(items?: NutritionConsumptionItem[]): string {
  const normalizedItems = nutritionItemsOrDefault(items);
  const meals = normalizedItems.filter((item) => item.icon === "bowl").length;
  const smoothies = normalizedItems.filter((item) => item.icon === "smoothie").length;
  const parts = [];

  if (meals > 0) {
    parts.push(`${meals} meal${meals === 1 ? "" : "s"}`);
  }

  if (smoothies > 0) {
    parts.push(`${smoothies} smoothie${smoothies === 1 ? "" : "s"}`);
  }

  return parts.length > 0 ? parts.join(" + ") : "Daily consumption";
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

  useFocusEffect(
    useCallback(() => {
      return () => {
        setBoardMenuOpen(false);
        setTileMenuRealmId(null);
      };
    }, [])
  );

  function openRealm(realm: HealthRealmDefinition): void {
    setBoardMenuOpen(false);
    setTileMenuRealmId(null);
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

  function handleBoardMenuOpenChange(open: boolean): void {
    setBoardMenuOpen(open);

    if (open) {
      setTileMenuRealmId(null);
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
        <HealthBoardManageSheet isOpen={boardMenuOpen} onAction={handleBoardAction} onOpenChange={handleBoardMenuOpenChange} textColor={headingColor} />
      </View>

      <View style={[styles.tileBoard, { height: boardHeight, width: boardWidth }]}> 
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
  const shapePosition = POSITION_TO_SHAPE_MAP[position];
  const layout = TILE_DETAIL_LAYOUTS[shapePosition];
  const isLeftColumn = layout.column === "left";
  const visualType = getTopicVisualType(tile);
  const tileFrameStyle = guideRectToBoardStyle(layout.tileBounds);
  const moduleLabelStyle = guideRectToTileStyle(shapePosition, layout.moduleLabel);
  const dataAreaStyle = guideRectToTileStyle(shapePosition, layout.dataArea);
  const visualThresholdStyle = guideRectToTileStyle(shapePosition, layout.visualThreshold);

  return (
    <Pressable
      accessibilityLabel={`${tile.moduleLabel}: ${tile.displayTitle}. ${tile.primaryValue}. ${tile.contextLine}`}
      accessibilityRole="button"
      delayLongPress={450}
      onLongPress={onLongPress}
      onPress={onPress}
      style={({ pressed }) => [styles.tileContent, tileFrameStyle, pressed && styles.tilePressed]}
    >
      <TileShapeSvg definition={definition} isDark={isDark} position={position} shapePosition={shapePosition} />
      <View pointerEvents="none" style={styles.tileHitSurface} />
      <View style={[styles.moduleLabelZone, moduleLabelStyle]}>
        <Text adjustsFontSizeToFit minimumFontScale={0.78} numberOfLines={1} style={[styles.moduleLabelText, { color: textColor }]}>
          {tile.moduleLabel}
        </Text>
      </View>
      <View style={[styles.dataAreaZone, dataAreaStyle]}>
        {isLeftColumn ? (
          <>
            <View style={styles.dataCopyLeft}>
              <View style={styles.dataCopyStack}>
                <Text adjustsFontSizeToFit minimumFontScale={0.78} numberOfLines={1} style={[styles.displayTitleText, { color: mutedTileText }]}>
                  {tile.displayTitle}
                </Text>
                <Text adjustsFontSizeToFit minimumFontScale={0.74} numberOfLines={2} style={[styles.contextLineText, { color: mutedTileText }]}>
                  {tile.contextLine}
                </Text>
              </View>
            </View>
            <View style={styles.primaryRight}>
              <Text adjustsFontSizeToFit minimumFontScale={0.6} numberOfLines={2} style={[styles.primaryValueText, styles.textRight, { color: textColor }]}>
                {tile.primaryValue}
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.primaryLeft}>
              <Text adjustsFontSizeToFit minimumFontScale={0.6} numberOfLines={2} style={[styles.primaryValueText, { color: textColor }]}>
                {tile.primaryValue}
              </Text>
            </View>
            <View style={styles.dataCopyRight}>
              <View style={styles.dataCopyStack}>
                <Text adjustsFontSizeToFit minimumFontScale={0.78} numberOfLines={1} style={[styles.displayTitleText, styles.textRight, { color: mutedTileText }]}>
                  {tile.displayTitle}
                </Text>
                <Text adjustsFontSizeToFit minimumFontScale={0.74} numberOfLines={2} style={[styles.contextLineText, styles.textRight, { color: mutedTileText }]}>
                  {tile.contextLine}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
      <View
        pointerEvents="none"
        style={[styles.visualThresholdZone, visualThresholdStyle]}
      >
        <View style={[styles.visualClip, isLeftColumn ? styles.visualClipLeft : styles.visualClipRight]}>
          <View style={styles.visualCanvas}>
            <TopicVisual
              accent={definition.accentColor}
              isDark={isDark}
              lineData={tile.lineData}
              nutritionConsumptionItems={tile.nutritionConsumptionItems}
              progress={tile.progress}
              type={visualType}
              weeklyGoalDays={tile.weeklyGoalDays}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function TopicVisual({
  accent,
  isDark,
  lineData,
  nutritionConsumptionItems,
  progress,
  type,
  weeklyGoalDays,
}: {
  accent: string;
  isDark: boolean;
  lineData?: number[];
  nutritionConsumptionItems?: NutritionConsumptionItem[];
  progress: number;
  type: TopicVisualType;
  weeklyGoalDays?: WeeklyGoalDay[];
}): JSX.Element {
  switch (type) {
    case "pillCount":
      return <PillCountVisual accent={accent} isDark={isDark} progress={progress} />;
    case "scheduleDots":
      return <ScheduleDotsVisual accent={accent} isDark={isDark} />;
    case "alertStack":
      return <AlertStackVisual accent={accent} isDark={isDark} progress={progress} />;
    case "familyBubbles":
      return <FamilyBubblesVisual accent={accent} isDark={isDark} progress={progress} />;
    case "fitnessBars":
      return <FitnessBarsVisual accent={accent} isDark={isDark} weeklyGoalDays={weeklyGoalDays} />;
    case "mealDots":
      return <MealDotsVisual accent={accent} isDark={isDark} progress={progress} />;
    case "moodWave":
      return <MoodWaveVisual accent={accent} isDark={isDark} lineData={lineData} progress={progress} />;
    case "nutritionGoalRing":
      return <NutritionConsumptionVisual isDark={isDark} items={nutritionItemsOrDefault(nutritionConsumptionItems)} />;
    case "sparkline":
      return <SparklineVisual accent={accent} isDark={isDark} lineData={lineData} progress={progress} />;
    case "sleepBars":
      return <SleepBarsVisual accent={accent} isDark={isDark} progress={progress} />;
    case "progressRing":
    default:
      return <RealmProgressVisual accent={accent} isDark={isDark} lineData={lineData} progress={progress} type="ring" />;
  }
}

function PillCountVisual({ accent, isDark, progress }: { accent: string; isDark: boolean; progress: number }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.26)" : "rgba(15,23,42,0.18)";
  const filledCount = Math.max(0, Math.min(4, Math.round((clampPercent(progress) / 100) * 4)));

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      {[0, 1, 2, 3].map((index) => {
        const isFilled = index < filledCount;
        const x = 12 + index * 32;
        const y = index % 2 === 0 ? 12 : 28;
        const fill = isFilled ? accent : muted;
        const cap = isFilled ? "rgba(255,255,255,0.34)" : isDark ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.42)";

        return (
          <Fragment key={index}>
            <Rect fill={fill} height="20" rx="10" transform={`rotate(-28 ${x + 18} ${y + 10})`} width="36" x={x} y={y} />
            <Path d={`M${x + 18} ${y + 3}v14`} opacity="0.7" stroke={cap} strokeLinecap="round" strokeWidth="2.8" transform={`rotate(-28 ${x + 18} ${y + 10})`} />
          </Fragment>
        );
      })}
    </Svg>
  );
}

function ScheduleDotsVisual({ accent, isDark }: { accent: string; isDark: boolean }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.28)" : "rgba(15,23,42,0.18)";

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      <Rect fill="none" height="40" rx="13" stroke={muted} strokeWidth="4" width="108" x="18" y="12" />
      <Line stroke={muted} strokeLinecap="round" strokeWidth="4" x1="30" x2="114" y1="25" y2="25" />
      {[36, 60, 84, 108].map((x, index) => (
        <Circle cx={x} cy={39} fill={index === 2 ? accent : muted} key={x} r="5" />
      ))}
    </Svg>
  );
}

function AlertStackVisual({ accent, isDark, progress }: { accent: string; isDark: boolean; progress: number }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.28)" : "rgba(15,23,42,0.18)";
  const activeRows = Math.max(1, Math.round((clampPercent(progress) / 100) * 3));

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      {[0, 1, 2].map((index) => {
        const isActive = index < activeRows;
        const y = 16 + index * 15;

        return (
          <Path
            d={`M20 ${y}h${isActive ? 88 - index * 14 : 52}c8 0 13 4 17 10`}
            fill="none"
            key={index}
            stroke={isActive ? accent : muted}
            strokeLinecap="round"
            strokeWidth="7"
          />
        );
      })}
      <Circle cx="116" cy="19" fill={accent} r="5" />
    </Svg>
  );
}

function FitnessBarsVisual({ accent, isDark, weeklyGoalDays }: { accent: string; isDark: boolean; weeklyGoalDays?: WeeklyGoalDay[] }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.18)";
  const text = isDark ? "rgba(255,255,255,0.72)" : "rgba(15,23,42,0.62)";
  const dayMap = new Map((weeklyGoalDays && weeklyGoalDays.length > 0 ? weeklyGoalDays : DEFAULT_WEEKLY_GOAL_DAYS).map((day) => [day.day, day]));

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      {WEEKLY_GOAL_DAY_ORDER.map((day, index) => {
        const item = dayMap.get(day) ?? DEFAULT_WEEKLY_GOAL_DAYS[index];
        const x = 16 + index * 18.7;
        const dotFill = item.completed ? accent : item.planned ? "none" : muted;
        const dotStroke = item.planned ? accent : muted;
        const dotOpacity = item.planned ? 1 : 0.45;

        return (
          <Fragment key={day}>
            <SvgText fill={text} fontSize="10" fontWeight="800" textAnchor="middle" x={x} y="21">
              {WEEKLY_GOAL_DAY_LABELS[day]}
            </SvgText>
            <Circle cx={x} cy="40" fill={dotFill} opacity={dotOpacity} r="5.5" stroke={dotStroke} strokeWidth="2.4" />
          </Fragment>
        );
      })}
    </Svg>
  );
}

function MealDotsVisual({ accent, isDark, progress }: { accent: string; isDark: boolean; progress: number }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.16)";
  const complete = Math.max(0, Math.min(5, Math.round((clampPercent(progress) / 100) * 5)));

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      {[0, 1, 2, 3, 4].map((index) => (
        <Circle cx={32 + index * 20} cy="32" fill={index < complete ? accent : muted} key={index} r={index === 2 ? 8 : 6} />
      ))}
      <Path d="M48 46c14 7 34 7 48 0" fill="none" stroke={muted} strokeLinecap="round" strokeWidth="4" />
    </Svg>
  );
}

function NutritionConsumptionVisual({ isDark, items }: { isDark: boolean; items: NormalizedNutritionConsumptionItem[] }): JSX.Element {
  const inactive = isDark ? "rgba(255,255,255,0.26)" : NUTRITION_PENDING_COLOR;
  const orderedItems = items.slice(0, 10);

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      {orderedItems.map((item, index) => {
        const topRow = index < 5;
        const x = 9 + (index % 5) * 26;
        const y = topRow ? 4 : 34;
        const color = item.consumed ? item.color : inactive;

        return item.icon === "smoothie" ? (
          <SmoothieConsumptionIcon color={color} key={item.id} x={x} y={y} />
        ) : (
          <BowlConsumptionIcon color={color} key={item.id} x={x} y={y} />
        );
      })}
    </Svg>
  );
}

function BowlConsumptionIcon({ color, x, y }: { color: string; x: number; y: number }): JSX.Element {
  return (
    <Fragment>
      <Path d={`M${x + 3} ${y + 13}h18c-1.2 7-4.8 10-9 10s-7.8-3-9-10z`} fill={color} />
      <Path d={`M${x + 2} ${y + 12}c3-3 17-3 20 0`} fill="none" stroke={color} strokeLinecap="round" strokeWidth="3" />
      <Circle cx={x + 8} cy={y + 8} fill={color} r="2.4" />
      <Circle cx={x + 14} cy={y + 7} fill={color} r="2.1" />
      <Circle cx={x + 18} cy={y + 9.5} fill={color} r="1.9" />
    </Fragment>
  );
}

function SmoothieConsumptionIcon({ color, x, y }: { color: string; x: number; y: number }): JSX.Element {
  return (
    <Fragment>
      <Path d={`M${x + 7} ${y + 7}h12l-2 16h-8z`} fill="none" stroke={color} strokeLinejoin="round" strokeWidth="2.7" />
      <Path d={`M${x + 8} ${y + 12}h10`} stroke={color} strokeLinecap="round" strokeWidth="2.4" />
      <Path d={`M${x + 13} ${y + 6}l5-5`} stroke={color} strokeLinecap="round" strokeWidth="2.5" />
      <Circle cx={x + 15} cy={y + 18} fill={color} r="2.5" />
    </Fragment>
  );
}

function MoodWaveVisual({ accent, isDark, lineData, progress }: { accent: string; isDark: boolean; lineData?: number[]; progress: number }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.18)" : "rgba(15,23,42,0.11)";
  const grid = isDark ? "rgba(255,255,255,0.14)" : "rgba(15,23,42,0.1)";
  const fill = isDark ? "rgba(109,125,242,0.22)" : "rgba(109,125,242,0.18)";
  const data = lineData && lineData.length >= 3 ? lineData : [42, 48, 44, 56, 52, 61, progress];
  const left = 14;
  const right = 130;
  const bottom = 52;
  const chartHeight = 38;
  const points = data.map((value, index) => {
    const x = left + (index / (data.length - 1)) * (right - left);
    const y = bottom - (clampPercent(value) / 100) * chartHeight;

    return `${x},${y}`;
  });
  const areaPoints = [`${left},${bottom}`, ...points, `${right},${bottom}`].join(" ");
  const lastPoint = points[points.length - 1].split(",").map(Number);

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      <Line stroke={grid} strokeLinecap="round" strokeWidth="2" x1={left} x2={right} y1="20" y2="20" />
      <Line stroke={grid} strokeLinecap="round" strokeWidth="2" x1={left} x2={right} y1="38" y2="38" />
      <Polyline fill={fill} points={areaPoints} />
      <Polyline fill="none" points={points.join(" ")} stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      <Circle cx={lastPoint[0]} cy={lastPoint[1]} fill={isDark ? "#343A64" : "#DDE2FF"} r="6" stroke={accent} strokeWidth="3" />
      <Circle cx="24" cy="50" fill={muted} r="3" />
    </Svg>
  );
}

function FamilyBubblesVisual({ accent, isDark, progress }: { accent: string; isDark: boolean; progress: number }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.26)" : "rgba(15,23,42,0.16)";
  const updateDot = clampPercent(progress) > 50 ? accent : muted;

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      <Circle cx="42" cy="30" fill={accent} opacity="0.95" r="13" />
      <Circle cx="70" cy="28" fill={muted} r="11" />
      <Circle cx="94" cy="36" fill={muted} r="12" />
      <Path d="M34 50c19 8 47 8 70 0" fill="none" stroke={muted} strokeLinecap="round" strokeWidth="4" />
      <Circle cx="110" cy="20" fill={updateDot} r="5" />
    </Svg>
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
    return <SparklineVisual accent={accent} isDark={isDark} lineData={lineData} progress={progress} />;
  }

  if (type === "empty") {
    return (
      <Svg height="100%" viewBox="0 0 144 64" width="100%">
        <Circle cx="72" cy="32" fill="none" r="19" stroke={track} strokeWidth="6" />
        <Path d="M59 32h26" stroke={accent} strokeLinecap="round" strokeWidth="6" />
      </Svg>
    );
  }

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dash = (clampPercent(progress) / 100) * circumference;

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      <Circle cx="72" cy="32" fill="none" r={radius} stroke={track} strokeWidth="6" />
      <Circle
        cx="72"
        cy="32"
        fill="none"
        r={radius}
        stroke={accent}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeLinecap="round"
        strokeWidth="6"
        transform="rotate(-90 72 32)"
      />
    </Svg>
  );
}

function SparklineVisual({ accent, isDark, lineData, progress }: { accent: string; isDark: boolean; lineData?: number[]; progress: number }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.16)";
  const data = lineData && lineData.length >= 2 ? lineData : [34, 46, 38, 58, progress];
  const points = data.map((value, index) => `${20 + (index / (data.length - 1)) * 104},${52 - (clampPercent(value) / 100) * 38}`).join(" ");

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      <Polyline fill="none" points="20,52 124,52" stroke={muted} strokeLinecap="round" strokeWidth="4" />
      <Polyline fill="none" points={points} stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
    </Svg>
  );
}

function SleepBarsVisual({ accent, isDark, progress }: { accent: string; isDark: boolean; progress: number }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.16)";
  const normalized = clampPercent(progress) / 100;

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const height = 12 + normalized * 17 + (index % 3) * 4;

        return <Rect fill={index === 3 ? accent : muted} height={height} key={index} rx="5" width="10" x={31 + index * 14} y={52 - height} />;
      })}
      <Line stroke={muted} strokeLinecap="round" strokeWidth="3" x1="28" x2="116" y1="54" y2="54" />
    </Svg>
  );
}

function TileShapeSvg({
  definition,
  isDark,
  position,
  shapePosition,
}: {
  definition: HealthRealmDefinition;
  isDark: boolean;
  position: RealmTilePosition;
  shapePosition: TileShapePosition;
}): JSX.Element {
  const tileBounds = TILE_DETAIL_LAYOUTS[shapePosition].tileBounds;
  const fill = isDark ? definition.darkTileBackground : definition.lightTileBackground;

  return (
    <Svg
      height="100%"
      pointerEvents="none"
      preserveAspectRatio="none"
      style={styles.tileShapeSvg}
      viewBox={`${tileBounds.x} ${tileBounds.y} ${tileBounds.width} ${tileBounds.height}`}
      width="100%"
    >
      <Path d={TILE_SHAPE_PATHS[position]} fill={fill} />
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
        <Menu.Overlay style={styles.menuOverlay} />
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
        <Menu.Overlay style={styles.menuOverlay} />
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
  menuOverlay: { backgroundColor: "transparent" },
  tileBoard: { alignSelf: "center", marginBottom: 8, marginTop: 14, position: "relative" },
  tileShapeSvg: { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
  tileContent: { backgroundColor: "transparent", position: "absolute", zIndex: 3 },
  tileHitSurface: { backgroundColor: "rgba(255,255,255,0.001)", bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
  tilePressed: { transform: [{ scale: 0.98 }] },
  moduleLabelZone: { alignItems: "center", justifyContent: "center", overflow: "hidden", position: "absolute" },
  moduleLabelText: { fontSize: 13.5, fontWeight: "900", letterSpacing: 0, lineHeight: 16, textAlign: "center", width: "100%" },
  dataAreaZone: {
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    paddingHorizontal: 10,
    position: "absolute",
  },
  dataCopyLeft: { flex: 0.58, justifyContent: "center", minWidth: 0, paddingLeft: 8, paddingRight: 1 },
  dataCopyRight: { alignItems: "flex-end", flex: 0.6, justifyContent: "center", minWidth: 0, paddingLeft: 1, paddingRight: 8 },
  dataCopyStack: { justifyContent: "center", width: "100%" },
  displayTitleText: { fontSize: 11.5, fontWeight: "700", includeFontPadding: false, letterSpacing: 0, lineHeight: 13.5, textAlign: "left", width: "100%" },
  primaryLeft: { alignItems: "flex-start", flex: 0.4, justifyContent: "center", minWidth: 0, paddingLeft: 10, paddingRight: 0 },
  primaryRight: { alignItems: "flex-end", flex: 0.42, justifyContent: "center", minWidth: 0, paddingLeft: 0, paddingRight: 10 },
  primaryValueText: { fontSize: 21, fontWeight: "900", includeFontPadding: false, letterSpacing: 0, lineHeight: 22, textAlign: "left",  textAlignVertical: "center", width: "100%" },
  contextLineText: { fontSize: 11.5, fontWeight: "700", includeFontPadding: false, letterSpacing: 0, lineHeight: 13.5, marginTop: 6, textAlign: "left", width: "100%" },
  textRight: { textAlign: "right" },
  visualThresholdZone: { overflow: "hidden", position: "absolute" },
  visualClip: { flex: 1, justifyContent: "center", overflow: "hidden", width: "100%" },
  visualCanvas: { height: "100%", width: "86%" },
  visualClipLeft: { alignItems: "flex-start" },
  visualClipRight: { alignItems: "flex-end" },
  centerConnector: { height: 42, left: "50%", marginLeft: -21, marginTop: -21, position: "absolute", top: "50%", width: 42, zIndex: 4 },
});
