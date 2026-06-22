import type { Href } from "expo-router";

import type { HealthFocusDefinition, HealthFocusDisplayData, HealthTileVisualType, HealthVisualData, HealthWidgetSlot } from "@/lib/healthFocusRegistry";

export type HealthTileCopy = {
  accessibilitySummary: string;
  contextLine?: string;
  displayTitle: string;
  moduleLabel: string;
  primaryValue: string;
};

export type HealthTileState =
  | "ready"
  | "empty"
  | "setupRequired"
  | "loading"
  | "error"
  | "private"
  | "unavailable";

export type HealthTileViewModel = {
  accentColor: string;
  copy: HealthTileCopy;
  darkBackground: string;
  focusId: string;
  iconKey: string;
  lightBackground: string;
  route: Href;
  slotId: HealthWidgetSlot["slotId"];
  state: HealthTileState;
  visualData?: HealthTileVisualData;
  visualType: HealthTileVisualType;
};

export type HealthTileVisualData = HealthVisualData;

const MAX_LABEL_LENGTH = 14;

function compactOneLine(value: string, fallback: string): string {
  const normalized = value.trim().replace(/\s+/g, " ");

  return normalized.length > 0 ? normalized : fallback;
}

function compactModuleLabel(focus: HealthFocusDefinition, displayData: HealthFocusDisplayData): string {
  const label = displayData.moduleLabel || focus.shortLabel || focus.label;

  if (label.length <= MAX_LABEL_LENGTH) {
    return label;
  }

  return focus.shortLabel && focus.shortLabel.length <= MAX_LABEL_LENGTH ? focus.shortLabel : focus.label;
}

export function createCompactHealthTileCopy(
  focus: HealthFocusDefinition,
  displayData: HealthFocusDisplayData
): HealthTileCopy {
  const moduleLabel = compactOneLine(compactModuleLabel(focus, displayData), focus.label);
  const displayTitle = compactOneLine(displayData.displayTitle || focus.shortLabel || focus.label, focus.label);
  const primaryValue = compactOneLine(displayData.primaryValue, "Ready");
  const contextLine = compactOneLine(displayData.contextLine, "");
  const accessibilitySummary = [moduleLabel, displayTitle, primaryValue, contextLine].filter(Boolean).join(". ");

  return {
    accessibilitySummary,
    contextLine,
    displayTitle,
    moduleLabel,
    primaryValue,
  };
}

export function createHealthTileViewModel({
  displayData,
  focus,
  slotId,
}: {
  displayData: HealthFocusDisplayData;
  focus: HealthFocusDefinition;
  slotId: HealthWidgetSlot["slotId"];
}): HealthTileViewModel {
  // UI PLACEHOLDER ADAPTER — replace during backend integration.
  const copy = createCompactHealthTileCopy(focus, displayData);
  const state: HealthTileState = displayData.isSetupRequired || focus.setupRequired ? "setupRequired" : "ready";

  return {
    accentColor: focus.accentColor,
    copy,
    darkBackground: focus.darkTileBackground,
    focusId: focus.id,
    iconKey: focus.iconKey,
    lightBackground: focus.lightTileBackground,
    route: focus.route,
    slotId,
    state,
    visualData: displayData.visualData,
    visualType: displayData.visualType,
  };
}
