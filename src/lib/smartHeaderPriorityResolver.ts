import {
  DEFAULT_SMART_HEADER_PREFERENCES,
  EMPTY_SMART_HEADER_ACTION,
  PLACEHOLDER_SMART_HEADER_ACTIONS,
} from "@/lib/smartHeaderRegistry";
import type {
  SmartHeaderAction,
  SmartHeaderActionCategory,
  SmartHeaderContext,
  SmartHeaderPreferences,
} from "@/lib/smartHeaderTypes";

const GENERAL_VISIBLE_CATEGORIES: SmartHeaderActionCategory[] = [
  "workout",
  "mood",
  "water",
  "nutrition",
  "medication",
  "supplements",
  "scan",
  "records",
  "sleep",
  "vitals",
  "setup",
];

const RESTRICTED_MODULE_CATEGORY: Partial<Record<SmartHeaderActionCategory, string>> = {
  baby: "babyChild",
  cycle: "cycle",
  family: "family",
  pregnancy: "pregnancy",
};

function normalizePreferences(preferences?: SmartHeaderPreferences): SmartHeaderPreferences {
  return {
    dismissedActionIds: preferences?.dismissedActionIds ?? DEFAULT_SMART_HEADER_PREFERENCES.dismissedActionIds,
    enabled: preferences?.enabled ?? DEFAULT_SMART_HEADER_PREFERENCES.enabled,
    hiddenCategories: preferences?.hiddenCategories ?? DEFAULT_SMART_HEADER_PREFERENCES.hiddenCategories,
    preferredCategories: preferences?.preferredCategories ?? DEFAULT_SMART_HEADER_PREFERENCES.preferredCategories,
  };
}

function moduleEnabled(context: SmartHeaderContext | undefined, moduleName: string): boolean {
  return context?.enabledModules?.includes(moduleName) === true;
}

export function getUserFeatureVisibility(context?: SmartHeaderContext): Record<SmartHeaderActionCategory, boolean> {
  return {
    baby: moduleEnabled(context, "babyChild"),
    calendar: true,
    cycle: moduleEnabled(context, "cycle"),
    family: moduleEnabled(context, "family"),
    medication: true,
    mood: true,
    nutrition: true,
    pregnancy: moduleEnabled(context, "pregnancy"),
    records: true,
    scan: true,
    setup: true,
    sleep: true,
    supplements: true,
    vitals: true,
    water: true,
    workout: true,
  };
}

function isVisibleForContext(action: SmartHeaderAction, context: SmartHeaderContext | undefined): boolean {
  if (GENERAL_VISIBLE_CATEGORIES.includes(action.category)) {
    return true;
  }

  const requiredModule = RESTRICTED_MODULE_CATEGORY[action.category];

  if (!requiredModule) {
    return true;
  }

  return moduleEnabled(context, requiredModule);
}

function resolvedPriority(action: SmartHeaderAction, preferences: SmartHeaderPreferences): number {
  const preferenceBoost = preferences.preferredCategories.includes(action.category) ? 8 : 0;

  return action.priority + preferenceBoost;
}

export function resolveSmartHeaderActions(
  actions: SmartHeaderAction[],
  context?: SmartHeaderContext,
  preferences?: SmartHeaderPreferences,
): SmartHeaderAction[] {
  const resolvedPreferences = normalizePreferences(preferences ?? context?.preferences);

  if (!resolvedPreferences.enabled) {
    return [EMPTY_SMART_HEADER_ACTION];
  }

  const visibleActions = actions
    .filter((action) => !resolvedPreferences.dismissedActionIds.includes(action.id))
    .filter((action) => !resolvedPreferences.hiddenCategories.includes(action.category))
    .filter((action) => isVisibleForContext(action, context))
    .sort((left, right) => resolvedPriority(right, resolvedPreferences) - resolvedPriority(left, resolvedPreferences))
    .slice(0, 4);

  return visibleActions.length > 0 ? visibleActions : [EMPTY_SMART_HEADER_ACTION];
}

export function getSmartHeaderActions(context?: SmartHeaderContext, preferences?: SmartHeaderPreferences): SmartHeaderAction[] {
  // TODO: Replace placeholder actions with real calendar, health, food, medication, and family adapters.
  return resolveSmartHeaderActions(PLACEHOLDER_SMART_HEADER_ACTIONS, context, preferences);
}
