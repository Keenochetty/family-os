import type { JSX } from "react";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, useColorScheme, useWindowDimensions, View, type StyleProp, type ViewStyle } from "react-native";
import { useFocusEffect, useRouter, type Href } from "expo-router";
import { Menu } from "heroui-native";
import Svg, { Circle, Line, Path, Polyline, Rect } from "react-native-svg";

import {
  DEFAULT_HEALTH_TILE_IDS,
  HEALTH_REALM_REGISTRY,
  getHealthRealmConfig,
  type HealthRealmConfig,
  type HealthRealmConfigId,
  type HealthTileVisualType,
} from "@/features/health/config/healthRealmRegistry";

export type HealthRealmId = HealthRealmConfigId | string;
export type RealmProgressType = "line" | "empty";
export type RealmTilePosition = "today" | "upcoming" | "attention" | "family";
type TileShapePosition = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
type TileColumn = "left" | "right";
export type TopicVisualType = HealthTileVisualType;

export type HealthRealmDefinition = Omit<HealthRealmConfig, "route"> & {
  route: Href;
  lightTileBackground: string;
  darkTileBackground: string;
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
};

export type HealthRealmBoardProps = {
  title?: string;
  subtitle?: string;
  selectedTileIds?: HealthRealmId[];
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
const DEFAULT_TILE_IDS: HealthRealmId[] = [...DEFAULT_HEALTH_TILE_IDS];
const DEFAULT_TILE_BACKGROUND = {
  dark: "#3F3F46",
  light: "#F8FAFC",
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

function toHealthRealmDefinition(config: HealthRealmConfig): HealthRealmDefinition {
  return {
    ...config,
    darkTileBackground: config.darkTileBackground ?? DEFAULT_TILE_BACKGROUND.dark,
    defaultPrimaryStat: config.placeholderPrimary,
    defaultProgress: 50,
    defaultSecondaryStatus: config.placeholderSecondary,
    lightTileBackground: config.lightTileBackground ?? DEFAULT_TILE_BACKGROUND.light,
    route: config.route as Href,
    visible: true,
  };
}

export const HEALTH_REALM_THEMES: Record<string, HealthRealmDefinition> = Object.fromEntries(
  HEALTH_REALM_REGISTRY.map((config) => [config.id, toHealthRealmDefinition(config)])
);

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

function accentForRealm(definition: HealthRealmDefinition, isDark: boolean): string {
  return definition.id === "health_overview" && isDark ? "#FFFFFF" : definition.accentColor;
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
  const definition = HEALTH_REALM_THEMES[tile.id] ?? toHealthRealmDefinition(getHealthRealmConfig(tile.id));
  const defaultPrimaryValue = definition.defaultPrimaryStat;
  const defaultContextLine = tile.contextLine ?? definition.placeholderContext ?? definition.defaultSecondaryStatus;

  return {
    ...tile,
    contextLine: tile.contextLine ?? tile.secondaryStatus ?? defaultContextLine,
    definition,
    displayTitle: tile.displayTitle ?? definition.shortLabel ?? definition.placeholderContext ?? definition.category,
    moduleLabel: tile.moduleLabel ?? definition.label,
    primaryValue: tile.primaryValue ?? tile.primaryStat ?? defaultPrimaryValue,
    primaryStat: tile.primaryStat ?? defaultPrimaryValue,
    secondaryStatus: tile.secondaryStatus ?? defaultContextLine,
    progress: clampPercent(tile.progress ?? definition.defaultProgress),
    progressType: tile.progressType ?? "line",
    visualType: tile.visualType ?? definition.visualType,
  };
}

function getTopicVisualType(tile: ReturnType<typeof resolveTile>): TopicVisualType {
  return tile.visualType;
}

export function HealthRealmBoard({
  title = "Health Control",
  subtitle = "Your modular health board",
  selectedTileIds = DEFAULT_TILE_IDS,
  tiles,
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
  // TODO: Replace this local/default selected id list with persisted user board preferences.
  const selectedTiles = useMemo(() => tiles ?? selectedTileIds.map((id) => ({ id })), [selectedTileIds, tiles]);
  const resolvedTiles = useMemo(() => selectedTiles.slice(0, 4).map(resolveTile), [selectedTiles]);
  const selectedMenuRealm = tileMenuRealmId ? HEALTH_REALM_THEMES[tileMenuRealmId] ?? toHealthRealmDefinition(getHealthRealmConfig(tileMenuRealmId)) : null;

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

      {selectedMenuRealm ? (
        <HealthRealmMenu
          isOpen
          onAction={handleTileAction}
          onOpenChange={(open) => !open && setTileMenuRealmId(null)}
          realm={selectedMenuRealm}
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
  const accent = accentForRealm(definition, isDark);
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
              accent={accent}
              emoji={definition.emoji}
              isDark={isDark}
              label={definition.label}
              lineData={tile.lineData}
              progress={tile.progress}
              type={visualType}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function TopicVisual({
  accent,
  emoji,
  isDark,
  label,
  lineData,
  progress,
  type,
}: {
  accent: string;
  emoji?: string;
  isDark: boolean;
  label: string;
  lineData?: number[];
  progress: number;
  type: TopicVisualType;
}): JSX.Element {
  switch (type) {
    case "icon_svg":
      return <IconSvgVisual accent={accent} isDark={isDark} />;
    case "mini_line":
      return <SparklineVisual accent={accent} isDark={isDark} lineData={lineData} progress={progress} />;
    case "mini_bar":
      return <SleepBarsVisual accent={accent} isDark={isDark} progress={progress} />;
    case "emoji_status":
      return <EmojiStatusVisual accent={accent} emoji={emoji} isDark={isDark} label={label} />;
    case "timeline":
      return <ScheduleDotsVisual accent={accent} isDark={isDark} />;
    case "log_stack":
      return <AlertStackVisual accent={accent} isDark={isDark} progress={progress} />;
    case "checklist":
      return <PillCountVisual accent={accent} isDark={isDark} progress={progress} />;
    case "calendar_dot":
      return <CalendarDotVisual accent={accent} isDark={isDark} />;
    case "status_badge":
      return <StatusBadgeVisual accent={accent} isDark={isDark} />;
    case "avatar_stack":
      return <FamilyBubblesVisual accent={accent} isDark={isDark} progress={progress} />;
    case "setup_card":
      return <SetupCardVisual accent={accent} isDark={isDark} />;
    case "none":
    default:
      return <View />;
  }
}

function IconSvgVisual({ accent, isDark }: { accent: string; isDark: boolean }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.22)" : "rgba(15,23,42,0.14)";

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      <Rect fill="none" height="38" rx="14" stroke={muted} strokeWidth="4" width="72" x="36" y="13" />
      <Path d="M56 36l11-14l11 18l9-11l12 14" fill="none" stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
      <Circle cx="55" cy="25" fill={accent} r="4" />
    </Svg>
  );
}

function EmojiStatusVisual({ accent, emoji, isDark, label }: { accent: string; emoji?: string; isDark: boolean; label: string }): JSX.Element {
  const surface = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.62)";
  const textColor = isDark ? "#F8FAFC" : "#111827";
  const status = label.length > 10 ? label.slice(0, 10) : label;

  return (
    <View style={[styles.emojiStatusBadge, { backgroundColor: surface, borderColor: accent }]}>
      <Text style={styles.emojiStatusEmoji}>{emoji ?? "+"}</Text>
      <View style={[styles.emojiStatusPill, { backgroundColor: accent }]}>
        <Text numberOfLines={1} style={[styles.emojiStatusText, { color: textColor }]}>
          {status}
        </Text>
      </View>
    </View>
  );
}

function CalendarDotVisual({ accent, isDark }: { accent: string; isDark: boolean }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.14)";
  const softAccent = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.48)";

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      <Rect fill={softAccent} height="44" rx="14" stroke={muted} strokeWidth="3" width="78" x="33" y="10" />
      <Line stroke={muted} strokeLinecap="round" strokeWidth="3" x1="45" x2="99" y1="24" y2="24" />
      <Circle cx="72" cy="39" fill={accent} r="9" />
      <Circle cx="72" cy="39" fill="none" opacity="0.38" r="17" stroke={accent} strokeWidth="4" />
    </Svg>
  );
}

function StatusBadgeVisual({ accent, isDark }: { accent: string; isDark: boolean }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.22)" : "rgba(15,23,42,0.14)";
  const fill = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.52)";

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      <Rect fill={fill} height="34" rx="17" stroke={muted} strokeWidth="3" width="96" x="24" y="15" />
      <Circle cx="44" cy="32" fill={accent} r="7" />
      <Line stroke={accent} strokeLinecap="round" strokeWidth="5" x1="60" x2="96" y1="32" y2="32" />
      <Circle cx="106" cy="22" fill={accent} r="4" />
    </Svg>
  );
}

function SetupCardVisual({ accent, isDark }: { accent: string; isDark: boolean }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.16)";
  const fill = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.52)";

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      <Rect fill={fill} height="42" rx="13" stroke={muted} strokeWidth="3" width="78" x="33" y="11" />
      <Path d="M72 24v18M63 33h18" stroke={accent} strokeLinecap="round" strokeWidth="6" />
      <Circle cx="104" cy="17" fill={accent} r="5" />
    </Svg>
  );
}

function PillCountVisual({ accent, isDark, progress }: { accent: string; isDark: boolean; progress: number }): JSX.Element {
  const muted = isDark ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.18)";
  const checkedRows = Math.max(1, Math.min(3, Math.round((clampPercent(progress) / 100) * 3)));

  return (
    <Svg height="100%" viewBox="0 0 144 64" width="100%">
      {[0, 1, 2].map((index) => {
        const isChecked = index < checkedRows;
        const y = 18 + index * 15;
        const stroke = isChecked ? accent : muted;

        return (
          <Fragment key={index}>
            <Circle cx="28" cy={y} fill={isChecked ? accent : "none"} r="6" stroke={stroke} strokeWidth="3" />
            {isChecked ? <Path d={`M24 ${y}l3 3l6-7`} fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" /> : null}
            <Line stroke={stroke} strokeLinecap="round" strokeWidth="5" x1="43" x2={isChecked ? 112 - index * 8 : 86} y1={y} y2={y} />
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
  emojiStatusBadge: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 18,
    borderWidth: 1,
    gap: 5,
    justifyContent: "center",
    minHeight: 54,
    minWidth: 70,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  emojiStatusEmoji: { fontSize: 20, includeFontPadding: false, lineHeight: 22 },
  emojiStatusPill: { borderRadius: 999, maxWidth: 62, paddingHorizontal: 7, paddingVertical: 3 },
  emojiStatusText: { fontSize: 8.5, fontWeight: "900", includeFontPadding: false, letterSpacing: 0, lineHeight: 10, textAlign: "center" },
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
