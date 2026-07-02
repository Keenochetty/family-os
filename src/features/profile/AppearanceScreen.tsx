import type { JSX } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useState } from "react";

import { HealthCard, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { useGlassMode, useThemeMode } from "@/hooks";
import { radius, spacing, typography, type GlassMode } from "@/theme";

type ThemeChoice = "system" | "light" | "dark";

const themeChoices: ThemeChoice[] = ["system", "light", "dark"];
const glassChoices: GlassMode[] = ["full", "reduced", "off"];

function SegmentedChoice<T extends string>({ label, onChange, options, value }: { label: string; onChange: (next: T) => void; options: T[]; value: T }): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <View style={styles.choiceBlock}>
      <Text style={[styles.choiceLabel, { color: theme.colors.textPrimary }]}>{label}</Text>
      <View style={[styles.segment, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
        {options.map((option) => {
          const active = option === value;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={option}
              onPress={() => onChange(option)}
              style={[styles.segmentButton, active && { backgroundColor: theme.colors.surface, borderColor: theme.brand.primary }]}
            >
              <Text style={[styles.segmentText, { color: active ? theme.brand.primary : theme.colors.textSecondary }]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function AppearanceScreen(): JSX.Element {
  const { mode, setMode } = useThemeMode();
  const { glassMode, setGlassMode } = useGlassMode("reduced");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [largerText, setLargerText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const theme = useHealthOSTheme();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard privacy="private" realm="records" title="Appearance" description="Local UI preferences for theme, glass, motion, haptics, readability, and contrast." />

      <SectionHeader title="Theme" subtitle="System follows the device setting." />
      <View style={[styles.panel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <SegmentedChoice label="Color mode" onChange={(next) => setMode(next)} options={themeChoices} value={mode} />
        <SegmentedChoice label="Glass Mode" onChange={setGlassMode} options={glassChoices} value={glassMode} />
      </View>

      <SectionHeader title="Comfort" subtitle="Accessibility placeholders for future persistence." />
      <View style={[styles.panel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <SettingToggle label="Reduce motion" onValueChange={setReduceMotion} value={reduceMotion} />
        <SettingToggle label="Haptics" onValueChange={setHapticsEnabled} value={hapticsEnabled} />
        <SettingToggle label="Larger text placeholder" onValueChange={setLargerText} value={largerText} />
        <SettingToggle label="High contrast placeholder" onValueChange={setHighContrast} value={highContrast} />
      </View>
    </ScrollView>
  );
}

function SettingToggle({ label, onValueChange, value }: { label: string; onValueChange: (next: boolean) => void; value: boolean }): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <View style={styles.toggleRow}>
      <Text style={[styles.toggleLabel, { color: theme.colors.textPrimary }]}>{label}</Text>
      <Switch onValueChange={onValueChange} thumbColor="#FFFFFF" trackColor={{ false: theme.colors.surfaceAlt, true: theme.brand.primary }} value={value} />
    </View>
  );
}

const styles = StyleSheet.create({
  choiceBlock: {
    gap: spacing.sm,
  },
  choiceLabel: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 150,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  panel: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  segment: {
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    padding: spacing.xs,
  },
  segmentButton: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: radius.sm,
    borderWidth: 1,
    flex: 1,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  segmentText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "800",
    lineHeight: typography.caption.lineHeight,
    textTransform: "capitalize",
  },
  toggleLabel: {
    flex: 1,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
});
