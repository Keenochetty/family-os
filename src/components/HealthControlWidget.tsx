import type { JSX } from "react";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, useWindowDimensions, View, type StyleProp, type ViewStyle } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Menu } from "heroui-native";
import Svg, { Circle, Line, Path, Polyline, Rect, Text as SvgText } from "react-native-svg";

import {
  DEFAULT_HEALTH_WIDGET_SLOTS,
  DEFAULT_NUTRITION_CONSUMPTION_ITEMS,
  DEFAULT_WEEKLY_GOAL_DAYS,
  getHealthFocusDefinition,
  getHealthFocusDisplayData,
  getHealthFocusGroups,
  type HealthFocusDataContext,
  type HealthFocusDefinition,
  type HealthFocusDisplayData,
  type HealthTileVisualType,
  type HealthVisualData,
  type HealthWidgetSlot,
  type NutritionConsumptionItem,
  type WeeklyGoalDay,
} from "@/lib/healthFocusRegistry";

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
export type TopicVisualType = HealthTileVisualType;

type NormalizedNutritionConsumptionItem = NutritionConsumptionItem & { color: string };

export type HealthRealmDefinition = HealthFocusDefinition;

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
  focusId?: string;
};

export type HealthRealmBoardProps = {
  title?: string;
  subtitle?: string;
  tiles?: HealthRealmTile[];
  selectedFocusSlots?: HealthWidgetSlot[];
  focusContext?: HealthFocusDataContext;
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
const NUTRITION_CONSUMED_COLOR = "#35A96B";
const NUTRITION_PENDING_COLOR = "#9CA3AF";
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
const POSITION_TO_SLOT_MAP: Record<RealmTilePosition, HealthWidgetSlot["slotId"]> = {
  attention: "bottomLeft",
  family: "bottomRight",
  today: "topLeft",
  upcoming: "topRight",
};
const SLOT_TO_POSITION_MAP: Record<HealthWidgetSlot["slotId"], RealmTilePosition> = {
  bottomLeft: "attention",
  bottomRight: "family",
  topLeft: "today",
  topRight: "upcoming",
};
const LEGACY_REALM_TO_FOCUS_ID: Record<HealthRealmId, string> = {
  baby: "baby_feeding",
  cycle: "cycle_status",
  family: "family_updates",
  fitness: "fitness_plan",
  general: "health_alerts",
  medication: "medication_doses",
  mentalHealth: "mood_checkin",
  nutrition: "nutrition_overview",
  pregnancy: "pregnancy_status",
  records: "records_status",
  supplements: "supplements_today",
};
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

type ResolvedHealthFocusTile = HealthFocusDisplayData & {
  definition: HealthFocusDefinition;
  focusId: string;
  slotId: HealthWidgetSlot["slotId"];
  visualData?: HealthVisualData;
};

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

function nutritionItemsOrDefault(items?: NutritionConsumptionItem[]): NormalizedNutritionConsumptionItem[] {
  const sourceItems = items && items.length > 0 ? items : DEFAULT_NUTRITION_CONSUMPTION_ITEMS;

  return sourceItems.map((item) => ({
    ...item,
    color: item.consumed ? item.color ?? NUTRITION_CONSUMED_COLOR : NUTRITION_PENDING_COLOR,
  }));
}

function resolveFocusTile(slot: HealthWidgetSlot, context: HealthFocusDataContext): ResolvedHealthFocusTile {
  const definition = getHealthFocusDefinition(slot.focusId);
  const displayData = getHealthFocusDisplayData(definition, context);

  return {
    ...displayData,
    definition,
    focusId: definition.id,
    slotId: slot.slotId,
    visualData: displayData.visualData,
  };
}

function focusIdFromLegacyTile(tile: HealthRealmTile): string {
  return tile.focusId ?? LEGACY_REALM_TO_FOCUS_ID[tile.id] ?? "nutrition_overview";
}

function slotsFromLegacyTiles(tiles: HealthRealmTile[]): HealthWidgetSlot[] {
  const positions: HealthWidgetSlot["slotId"][] = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

  return positions.map((slotId, index) => ({
    focusId: tiles[index] ? focusIdFromLegacyTile(tiles[index]) : DEFAULT_HEALTH_WIDGET_SLOTS[index].focusId,
    slotId,
  }));
}

export function HealthRealmBoard({
  title = "Health Control",
  subtitle = "Your modular health board",
  tiles,
  selectedFocusSlots,
  focusContext = {},
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
  const initialSlots = useMemo(() => selectedFocusSlots ?? (tiles ? slotsFromLegacyTiles(tiles) : DEFAULT_HEALTH_WIDGET_SLOTS), [selectedFocusSlots, tiles]);
  const [widgetSlots, setWidgetSlots] = useState<HealthWidgetSlot[]>(initialSlots);
  const [activeSlotId, setActiveSlotId] = useState<HealthWidgetSlot["slotId"] | null>(null);
  const [boardMenuOpen, setBoardMenuOpen] = useState(false);

  const cardWidth = Math.min(width - 32, framed ? 420 : 480);
  const boardWidth = cardWidth - (framed ? 36 : 0);
  const boardHeight = boardWidth / TILE_BOARD_ASPECT_RATIO;
  const headingColor = framed || isDark ? "#ffffff" : "#111827";
  const mutedColor = framed || isDark ? "#b8b8c0" : "#64748b";
  const activeTile = useMemo(() => {
    const slot = widgetSlots.find((item) => item.slotId === activeSlotId);

    return slot ? resolveFocusTile(slot, focusContext) : null;
  }, [activeSlotId, focusContext, widgetSlots]);
  const positionedTiles = useMemo(
    () =>
      widgetSlots.slice(0, 4).map((slot) => ({
        position: SLOT_TO_POSITION_MAP[slot.slotId],
        tile: resolveFocusTile(slot, focusContext),
      })),
    [focusContext, widgetSlots]
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        setBoardMenuOpen(false);
        setActiveSlotId(null);
      };
    }, [])
  );

  function openRealm(realm: HealthRealmDefinition): void {
    setBoardMenuOpen(false);
    setActiveSlotId(null);
    onRealmPress?.(realm);
    router.push(realm.route);
  }

  function handleTileAction(action: HealthTileMenuAction, tile: ResolvedHealthFocusTile): void {
    setActiveSlotId(null);
    const realm = tile.definition;

    onTileMenuAction?.(action, realm);

    if (action === "open") {
      openRealm(realm);
    }
  }

  function handleBoardMenuOpenChange(open: boolean): void {
    setBoardMenuOpen(open);

    if (open) {
      setActiveSlotId(null);
    }
  }

  function handleBoardAction(action: HealthBoardMenuAction): void {
    setBoardMenuOpen(false);
    onBoardMenuAction?.(action);
  }

  function replaceSlotFocus(slotId: HealthWidgetSlot["slotId"], focusId: string): void {
    // TODO: Persist selected focus ids, widget order, hidden widgets, and defaults to Supabase/user preferences.
    setWidgetSlots((currentSlots) => currentSlots.map((slot) => (slot.slotId === slotId ? { ...slot, focusId } : slot)));
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
            onLongPress={() => {
              setBoardMenuOpen(false);
              setActiveSlotId(POSITION_TO_SLOT_MAP[position]);
            }}
            onPress={() => openRealm(tile.definition)}
            position={position}
            tile={tile}
          />
        ))}
        <CenterConnector />
        {activeTile ? (
          <HealthWidgetFocusPopover
            isDark={isDark}
            onAction={handleTileAction}
            onClose={() => setActiveSlotId(null)}
            onFocusSelect={(focusId) => replaceSlotFocus(activeTile.slotId, focusId)}
            tile={activeTile}
          />
        ) : null}
      </View>

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
  tile: ResolvedHealthFocusTile;
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
  const visualType = tile.visualType;
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
                  lineData={tile.visualData?.lineData}
                  nutritionConsumptionItems={tile.visualData?.nutritionConsumptionItems}
                  progress={tile.visualData?.progress ?? 0}
                  type={visualType}
                  weeklyGoalDays={tile.visualData?.weeklyGoalDays}
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
    case "timelineDots":
    case "calendarDots":
      return <ScheduleDotsVisual accent={accent} isDark={isDark} />;
    case "checklistStack":
      return <AlertStackVisual accent={accent} isDark={isDark} progress={progress} />;
    case "familyBubbles":
      return <FamilyBubblesVisual accent={accent} isDark={isDark} progress={progress} />;
    case "fitnessBars":
      return <FitnessBarsVisual accent={accent} isDark={isDark} weeklyGoalDays={weeklyGoalDays} />;
    case "mealStack":
      return <MealStackVisual accent={accent} isDark={isDark} progress={progress} />;
    case "waterDrops":
      return <WaterDropsVisual accent={accent} isDark={isDark} progress={progress} />;
    case "miniBars":
      return <MiniBarsVisual accent={accent} isDark={isDark} progress={progress} />;
    case "moodWave":
      return <MoodWaveVisual accent={accent} isDark={isDark} lineData={lineData} progress={progress} />;
    case "nutritionConsumption":
      return <NutritionConsumptionVisual isDark={isDark} items={nutritionItemsOrDefault(nutritionConsumptionItems)} />;
    case "miniSparkline":
      return <SparklineVisual accent={accent} isDark={isDark} lineData={lineData} progress={progress} />;
    case "statusBadge":
      return <StatusBadgeVisual accent={accent} isDark={isDark} progress={progress} />;
    case "setupBadge":
      return <SetupBadgeVisual accent={accent} isDark={isDark} />;
    case "iconMark":
      return <IconMarkVisual accent={accent} isDark={isDark} />;
    case "none":
    default:
      return <View />;
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

function MealStackVisual({ accent, isDark, progress }: { accent: string; isDark: boolean; progress: number }): JSX.Element {
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

function WaterDropsVisual({ accent, isDark, progress }: { accent: string; isDark: boolean; progress: number }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.16)";
  const filledCount = Math.max(0, Math.min(8, Math.round((clampPercent(progress) / 100) * 8)));

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
        const x = 18 + index * 15;
        const fill = index < filledCount ? accent : muted;

        return <Path d={`M${x} 19c5 7 8 12 8 17a8 8 0 0 1-16 0c0-5 3-10 8-17z`} fill={fill} key={index} />;
      })}
    </Svg>
  );
}

function MiniBarsVisual({ accent, isDark, progress }: { accent: string; isDark: boolean; progress: number }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.16)";
  const normalized = clampPercent(progress) / 100;

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      {[0, 1, 2, 3, 4].map((index) => {
        const height = 14 + normalized * 22 + index * 3;

        return <Rect fill={index < 3 ? accent : muted} height={height} key={index} rx="6" width="14" x={32 + index * 17} y={52 - height} />;
      })}
      <Line stroke={muted} strokeLinecap="round" strokeWidth="3" x1="28" x2="116" y1="54" y2="54" />
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

function StatusBadgeVisual({ accent, isDark, progress }: { accent: string; isDark: boolean; progress: number }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.16)";
  const fill = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.48)";
  const dotX = 44 + (clampPercent(progress) / 100) * 56;

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      <Rect fill={fill} height="34" rx="17" stroke={muted} strokeWidth="3" width="92" x="26" y="15" />
      <Line stroke={muted} strokeLinecap="round" strokeWidth="5" x1="44" x2="100" y1="32" y2="32" />
      <Circle cx={dotX} cy="32" fill={accent} r="8" />
      <Circle cx="106" cy="22" fill={accent} opacity="0.82" r="4" />
    </Svg>
  );
}

function SetupBadgeVisual({ accent, isDark }: { accent: string; isDark: boolean }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.16)";
  const fill = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.48)";

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      <Rect fill={fill} height="42" rx="13" stroke={muted} strokeWidth="3" width="78" x="33" y="11" />
      <Path d="M72 23v18M63 32h18" stroke={accent} strokeLinecap="round" strokeWidth="6" />
      <Circle cx="104" cy="17" fill={accent} r="5" />
    </Svg>
  );
}

function IconMarkVisual({ accent, isDark }: { accent: string; isDark: boolean }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.16)";
  const fill = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.48)";

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      <Rect fill={fill} height="42" rx="14" stroke={muted} strokeWidth="3" width="84" x="30" y="11" />
      <Path d="M52 24v-6h14M92 18h-14M52 40v6h14M92 46h-14" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="4" />
      <Path d="M59 32h26" stroke={accent} strokeLinecap="round" strokeWidth="5" />
      <Circle cx="94" cy="32" fill={accent} r="5" />
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

function HealthWidgetFocusPopover({
  isDark,
  onAction,
  onClose,
  onFocusSelect,
  tile,
}: {
  isDark: boolean;
  onAction: (action: HealthTileMenuAction, tile: ResolvedHealthFocusTile) => void;
  onClose: () => void;
  onFocusSelect: (focusId: string) => void;
  tile: ResolvedHealthFocusTile;
}): JSX.Element {
  const [mode, setMode] = useState<"actions" | "replace">("actions");
  const background = isDark ? "#222226" : "#FFFFFF";
  const textColor = isDark ? "#F8FAFC" : "#111827";
  const mutedColor = isDark ? "rgba(248,250,252,0.66)" : "rgba(17,24,39,0.62)";
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)";
  const groups = getHealthFocusGroups();
  const positionStyle = popoverStyleForSlot(tile.slotId);
  const headerSubtitle = mode === "replace" ? tile.displayTitle : `${tile.primaryValue} - ${tile.contextLine}`;

  return (
    <>
      <Pressable onPress={onClose} style={styles.focusPopoverScrim} />
      <View style={[styles.focusPopover, positionStyle, { backgroundColor: background, borderColor }]}>
        <View style={styles.focusSheetHeader}>
          <View style={[styles.focusAccentMark, { backgroundColor: tile.definition.accentColor }]} />
          <View style={styles.focusHeaderCopy}>
            <Text numberOfLines={1} style={[styles.focusSheetTitle, { color: textColor }]}>
              {mode === "replace" ? "Replace focus" : tile.definition.label}
            </Text>
            <Text numberOfLines={1} style={[styles.focusSheetSubtitle, { color: mutedColor }]}>
              {headerSubtitle}
            </Text>
          </View>
        </View>

        {mode === "actions" ? (
          <View style={styles.focusPopoverList}>
            <FocusPopoverRow description="Go to the selected tracker" label="Open this focus" onPress={() => onAction("open", tile)} textColor={textColor} mutedColor={mutedColor} />
            <FocusPopoverRow description="Choose another focus data source" label="Replace focus" onPress={() => setMode("replace")} textColor={textColor} mutedColor={mutedColor} />
            <FocusPopoverRow description="Reorder support is coming later" label="Move widget" onPress={() => onAction("move", tile)} textColor={textColor} mutedColor={mutedColor} />
            <FocusPopoverRow description="Review this widget focus" label="View info" onPress={() => onAction("info", tile)} textColor={textColor} mutedColor={mutedColor} />
            <FocusPopoverRow description="Hide support is coming later" label="Hide widget" onPress={() => onAction("hide", tile)} textColor={textColor} mutedColor={mutedColor} />
          </View>
        ) : (
          <View style={styles.focusPopoverPicker}>
            <Pressable onPress={() => setMode("actions")} style={styles.focusPopoverBackButton}>
              <Text style={[styles.focusPopoverBackText, { color: tile.definition.accentColor }]}>Back to actions</Text>
            </Pressable>
            <ScrollView contentContainerStyle={styles.focusPopoverScroll} nestedScrollEnabled showsVerticalScrollIndicator>
              {groups.map((group) => (
                <View key={group.category} style={styles.focusPopoverGroup}>
                  <Text style={[styles.heroMenuGroupTitle, { color: mutedColor }]}>{group.label}</Text>
                  {group.items.map((focus) => {
                    const isSelected = focus.id === tile.focusId;

                    return (
                      <Pressable
                        key={focus.id}
                        onPress={() => {
                          onFocusSelect(focus.id);
                          onClose();
                        }}
                        style={[styles.focusPopoverOption, { borderColor: isSelected ? tile.definition.accentColor : borderColor }]}
                      >
                        <View style={[styles.heroMenuAccentDot, { backgroundColor: focus.accentColor }]} />
                        <View style={styles.heroMenuRowCopy}>
                          <Text numberOfLines={1} style={[styles.heroMenuTitle, { color: textColor }]}>{focus.label}</Text>
                          <Text numberOfLines={1} style={[styles.heroMenuDescription, { color: mutedColor }]}>{focus.placeholder.displayTitle}</Text>
                        </View>
                        {isSelected ? <Text style={[styles.focusPopoverSelected, { color: tile.definition.accentColor }]}>Selected</Text> : null}
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );
}

function FocusPopoverRow({
  description,
  label,
  mutedColor,
  onPress,
  textColor,
}: {
  description: string;
  label: string;
  mutedColor: string;
  onPress: () => void;
  textColor: string;
}): JSX.Element {
  return (
    <Pressable onPress={onPress} style={styles.focusPopoverRow}>
      <Text style={[styles.heroMenuTitle, { color: textColor }]}>{label}</Text>
      <Text style={[styles.heroMenuDescription, { color: mutedColor }]}>{description}</Text>
    </Pressable>
  );
}

function popoverStyleForSlot(slotId: HealthWidgetSlot["slotId"]): ViewStyle {
  switch (slotId) {
    case "topRight":
      return { right: "4%", top: "45%" };
    case "bottomLeft":
      return { left: "4%", top: "86%" };
    case "bottomRight":
      return { right: "4%", top: "86%" };
    case "topLeft":
    default:
      return { left: "4%", top: "45%" };
  }
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
  sheetOverlay: { backgroundColor: "rgba(0,0,0,0.28)" },
  focusSheetBackground: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    elevation: 16,
    shadowColor: "#000000",
    shadowOffset: { height: -8, width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
  },
  focusSheetContent: { maxHeight: 620, paddingBottom: 20, paddingHorizontal: 18, paddingTop: 10 },
  focusPopover: {
    borderRadius: 18,
    borderWidth: 1,
    elevation: 16,
    maxHeight: "86%",
    overflow: "hidden",
    paddingBottom: 8,
    paddingHorizontal: 10,
    paddingTop: 8,
    position: "absolute",
    shadowColor: "#000000",
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    width: "58%",
    zIndex: 20,
  },
  focusPopoverBackButton: { alignSelf: "flex-start", borderRadius: 999, paddingBottom: 3, paddingTop: 0 },
  focusPopoverBackText: { fontSize: 10, fontWeight: "900", letterSpacing: 0, lineHeight: 11 },
  focusPopoverGroup: { gap: 2 },
  focusPopoverList: { gap: 2 },
  focusPopoverOption: { alignItems: "center", borderRadius: 9, borderWidth: 1, flexDirection: "row", gap: 6, minHeight: 32, paddingHorizontal: 7, paddingVertical: 4 },
  focusPopoverPicker: { maxHeight: 318, overflow: "hidden" },
  focusPopoverRow: { borderRadius: 10, minHeight: 42, paddingHorizontal: 7, paddingVertical: 6 },
  focusPopoverScrim: { bottom: 0, left: 0, position: "absolute", right: 0, top: 0, zIndex: 19 },
  focusPopoverScroll: { gap: 5, paddingBottom: 2 },
  focusPopoverSelected: { fontSize: 9, fontWeight: "900", letterSpacing: 0, lineHeight: 11 },
  sheetHandle: { alignSelf: "center", backgroundColor: "rgba(148,163,184,0.45)", borderRadius: 999, height: 4, marginBottom: 14, width: 42 },
  focusSheetHeader: { alignItems: "center", flexDirection: "row", gap: 8, marginBottom: 5 },
  focusAccentMark: { borderRadius: 999, height: 22, width: 4 },
  focusHeaderCopy: { flex: 1, minWidth: 0 },
  focusSheetTitle: { fontSize: 13.5, fontWeight: "900", letterSpacing: 0, lineHeight: 15 },
  focusSheetSubtitle: { fontSize: 9.8, fontWeight: "700", letterSpacing: 0, lineHeight: 11, marginTop: 1 },
  heroMenuAccentDot: { borderRadius: 999, height: 8, marginRight: 5, width: 8 },
  heroMenuDescription: { fontSize: 9.5, fontWeight: "700", letterSpacing: 0, lineHeight: 11, marginTop: 0 },
  heroMenuFooter: { alignItems: "center", flexDirection: "row", gap: 7, marginTop: 6, paddingHorizontal: 7, paddingVertical: 5 },
  heroMenuFooterDot: { borderRadius: 999, height: 8, width: 8 },
  heroMenuFooterText: { fontSize: 10.5, fontWeight: "800", letterSpacing: 0, lineHeight: 13 },
  heroMenuGroupTitle: { fontSize: 8.8, fontWeight: "900", letterSpacing: 0.5, lineHeight: 10, marginTop: 5, paddingHorizontal: 5, textTransform: "uppercase" },
  heroMenuRowCopy: { flex: 1, minWidth: 0 },
  heroMenuTitle: { fontSize: 11.2, fontWeight: "900", letterSpacing: 0, lineHeight: 13 },
  tileBoard: { alignSelf: "center", marginBottom: 8, marginTop: 14, position: "relative" },
  tileShapeSvg: { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
  tileContent: { backgroundColor: "transparent", position: "absolute", zIndex: 3 },
  tilePressable: { backgroundColor: "transparent", flex: 1 },
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
