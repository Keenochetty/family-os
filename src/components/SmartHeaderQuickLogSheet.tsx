import type { JSX, ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

import type { SmartHeaderAction } from "@/lib/smartHeaderTypes";

type SmartHeaderQuickLogSheetProps = {
  action: SmartHeaderAction | null;
  onClose: () => void;
  onOpenRoute: (action: SmartHeaderAction) => void;
};

function SheetChip({
  children,
  color,
  label,
  onPress,
}: {
  children: ReactNode;
  color: string;
  label: string;
  onPress?: () => void;
}): JSX.Element {
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.chip, { borderColor: color }, pressed && styles.pressed]}>
      <Text style={[styles.chipText, { color }]}>{children}</Text>
    </Pressable>
  );
}

function sheetOptionsForAction(action: SmartHeaderAction): { label: string; accessibilityLabel: string }[] {
  if (action.category === "mood") {
    return [
      { accessibilityLabel: "Happy", label: "🙂 Happy" },
      { accessibilityLabel: "Okay", label: "😐 Okay" },
      { accessibilityLabel: "Sad", label: "😔 Sad" },
      { accessibilityLabel: "Stressed", label: "😤 Stressed" },
      { accessibilityLabel: "Tired", label: "😴 Tired" },
    ];
  }

  if (action.category === "water") {
    return [
      { accessibilityLabel: "Add 250 milliliters", label: "+250ml" },
      { accessibilityLabel: "Add 500 milliliters", label: "+500ml" },
      { accessibilityLabel: "Set reminder", label: "Reminder" },
    ];
  }

  if (action.category === "nutrition") {
    return [
      { accessibilityLabel: "Log meal", label: "Log meal" },
      { accessibilityLabel: "Scan food", label: "Scan food" },
      { accessibilityLabel: "Add water", label: "Add water" },
    ];
  }

  if (action.category === "medication" || action.category === "supplements") {
    return [
      { accessibilityLabel: "Mark taken", label: "Mark taken" },
      { accessibilityLabel: "Snooze", label: "Snooze" },
      { accessibilityLabel: "View schedule", label: "Schedule" },
    ];
  }

  if (action.category === "sleep") {
    return [
      { accessibilityLabel: "Log sleep", label: "Log sleep" },
      { accessibilityLabel: "Add note", label: "Add note" },
      { accessibilityLabel: "Later", label: "Later" },
    ];
  }

  if (action.category === "vitals") {
    return [
      { accessibilityLabel: "Add reading", label: "Add reading" },
      { accessibilityLabel: "Blood pressure", label: "BP" },
      { accessibilityLabel: "Heart rate", label: "Heart rate" },
    ];
  }

  return [
    { accessibilityLabel: action.primaryLabel, label: action.primaryLabel },
    { accessibilityLabel: "Open details", label: "Open details" },
  ];
}

export function SmartHeaderQuickLogSheet({ action, onClose, onOpenRoute }: SmartHeaderQuickLogSheetProps): JSX.Element | null {
  const isDark = useColorScheme() === "dark";

  if (!action) {
    return null;
  }

  const background = isDark ? "#18181B" : "#FFFFFF";
  const textColor = isDark ? "#F8FAFC" : "#0F172A";
  const mutedColor = isDark ? "rgba(248,250,252,0.66)" : "rgba(15,23,42,0.58)";
  const borderColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.08)";
  const options = sheetOptionsForAction(action);

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible>
      <View style={styles.root}>
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.scrim} />
        <View style={[styles.sheet, { backgroundColor: background, borderColor }]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={[styles.accent, { backgroundColor: action.accentColor }]} />
            <View style={styles.copy}>
              <Text numberOfLines={1} style={[styles.title, { color: textColor }]}>
                {action.title}
              </Text>
              <Text numberOfLines={2} style={[styles.subtitle, { color: mutedColor }]}>
                {action.subtitle}
              </Text>
            </View>
          </View>
          <View style={styles.chips}>
            {options.map((option) => (
              <SheetChip color={action.accentColor} key={option.accessibilityLabel} label={option.accessibilityLabel} onPress={onClose}>
                {option.label}
              </SheetChip>
            ))}
          </View>
          <View style={styles.footer}>
            <Pressable accessibilityRole="button" onPress={() => onOpenRoute(action)} style={({ pressed }) => [styles.primary, { backgroundColor: action.accentColor }, pressed && styles.pressed]}>
              <Text style={styles.primaryText}>Open full tracker</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onClose} style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
              <Text style={[styles.closeText, { color: mutedColor }]}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  accent: {
    borderRadius: 999,
    height: 34,
    width: 5,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
  },
  close: {
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: 14,
  },
  closeText: {
    fontSize: 13,
    fontWeight: "900",
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  handle: {
    alignSelf: "center",
    backgroundColor: "rgba(148,163,184,0.45)",
    borderRadius: 999,
    height: 4,
    marginBottom: 16,
    width: 44,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 11,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  primary: {
    alignItems: "center",
    borderRadius: 999,
    flex: 1,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: 14,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  root: {
    flex: 1,
    justifyContent: "flex-end",
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
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    paddingBottom: 30,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22,
  },
});
