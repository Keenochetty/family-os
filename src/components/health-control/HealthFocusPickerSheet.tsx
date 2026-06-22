import type { JSX } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { getHealthFocusGroups, type HealthFocusDefinition, type HealthFocusCategory } from "@/lib/healthFocusRegistry";
import { raisedSurface, useAppTheme } from "@/lib/theme";

export type HealthFocusPickerPreview = {
  accentColor: string;
  currentValue: string;
  displayTitle: string;
  focusId: string;
  label: string;
  slotLabel: string;
};

type HealthFocusPickerSheetProps = {
  currentFocus: HealthFocusPickerPreview;
  enabledCategories?: HealthFocusCategory[];
  isOpen: boolean;
  onClose: () => void;
  onSelectFocus: (focusId: string) => void;
};

const DEFAULT_VISIBLE_CATEGORIES: HealthFocusCategory[] = [
  "nutrition",
  "medication",
  "fitness",
  "generalHealth",
  "records",
  "scan",
  "setup",
];

export function HealthFocusPickerSheet({
  currentFocus,
  enabledCategories = DEFAULT_VISIBLE_CATEGORIES,
  isOpen,
  onClose,
  onSelectFocus,
}: HealthFocusPickerSheetProps): JSX.Element | null {
  const { theme } = useAppTheme();
  const groups = getHealthFocusGroups().filter((group) => enabledCategories.includes(group.category));

  if (!isOpen) {
    return null;
  }

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible>
      <View style={styles.root}>
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.scrim} />
        <View style={[styles.sheet, raisedSurface(theme)]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Replace widget focus</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{currentFocus.slotLabel}</Text>
            </View>
            <Pressable accessibilityLabel="Close focus picker" accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: theme.textPrimary }]}>Close</Text>
            </Pressable>
          </View>

          <View style={[styles.preview, { borderColor: theme.borderSoft }]}>
            <View style={[styles.previewIcon, { backgroundColor: currentFocus.accentColor }]} />
            <View style={styles.previewCopy}>
              <Text numberOfLines={1} style={[styles.previewLabel, { color: theme.textPrimary }]}>
                {currentFocus.label}
              </Text>
              <Text numberOfLines={1} style={[styles.previewMeta, { color: theme.textSecondary }]}>
                {currentFocus.displayTitle} - {currentFocus.currentValue}
              </Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {groups.map((group) => (
              <View key={group.category} style={styles.group}>
                <Text style={[styles.groupTitle, { color: theme.textMuted }]}>{group.label}</Text>
                {group.items.map((focus) => (
                  <FocusPickerRow
                    currentFocusId={currentFocus.focusId}
                    focus={focus}
                    key={focus.id}
                    onSelectFocus={onSelectFocus}
                  />
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function FocusPickerRow({
  currentFocusId,
  focus,
  onSelectFocus,
}: {
  currentFocusId: string;
  focus: HealthFocusDefinition;
  onSelectFocus: (focusId: string) => void;
}): JSX.Element {
  const { theme } = useAppTheme();
  const isSelected = focus.id === currentFocusId;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={() => onSelectFocus(focus.id)}
      style={({ pressed }) => [
        styles.row,
        { borderColor: isSelected ? focus.accentColor : theme.borderSoft },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: focus.accentColor }]} />
      <View style={styles.rowCopy}>
        <Text numberOfLines={1} style={[styles.rowTitle, { color: theme.textPrimary }]}>
          {focus.label}
        </Text>
        <Text numberOfLines={1} style={[styles.rowDescription, { color: theme.textSecondary }]}>
          {focus.placeholder.displayTitle}
        </Text>
      </View>
      <Text numberOfLines={1} style={[styles.rowPreview, { color: isSelected ? focus.accentColor : theme.textMuted }]}>
        {isSelected ? "Selected" : focus.placeholder.primaryValue}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  closeText: {
    fontSize: 12,
    fontWeight: "900",
  },
  group: {
    gap: 8,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  handle: {
    alignSelf: "center",
    backgroundColor: "rgba(148,163,184,0.45)",
    borderRadius: 999,
    height: 4,
    marginBottom: 14,
    width: 42,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  preview: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    padding: 12,
  },
  previewCopy: {
    flex: 1,
    minWidth: 0,
  },
  previewIcon: {
    borderRadius: 999,
    height: 28,
    width: 28,
  },
  previewLabel: {
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 18,
  },
  previewMeta: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 15,
    marginTop: 2,
  },
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  row: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 58,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  rowCopy: {
    flex: 1,
    minWidth: 0,
  },
  rowDescription: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 15,
    marginTop: 2,
  },
  rowIcon: {
    borderRadius: 999,
    height: 24,
    width: 24,
  },
  rowPreview: {
    fontSize: 12,
    fontWeight: "900",
    maxWidth: 78,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 17,
  },
  scrollContent: {
    gap: 18,
    paddingBottom: 26,
    paddingTop: 18,
  },
  scrim: {
    backgroundColor: "rgba(15,23,42,0.34)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    maxHeight: "84%",
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 15,
    marginTop: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 24,
  },
});
