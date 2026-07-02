import type { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";

import { fitnessRealmRadius, fitnessRealmSpacing, type FitnessRealmTheme } from "@/features/fitness/realm/theme/fitnessRealmTheme";

type FitnessStateSurfaceProps = {
  detail: string;
  state: "loading" | "empty" | "error" | "offline" | "partial";
  theme: FitnessRealmTheme;
  title: string;
};

export function FitnessStateSurface({ detail, state, theme, title }: FitnessStateSurfaceProps): JSX.Element {
  const tone =
    state === "error" ? theme.danger : state === "offline" || state === "partial" ? theme.warning : state === "loading" ? theme.rest : theme.textSubtle;

  return (
    <View accessibilityRole="summary" style={[styles.surface, { backgroundColor: theme.surface1, borderColor: tone }]}>
      <View style={[styles.dot, { backgroundColor: tone }]} />
      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.detail, { color: theme.textMuted }]}>{detail}</Text>
      </View>
    </View>
  );
}

type WarningBannerProps = {
  detail: string;
  theme: FitnessRealmTheme;
  title: string;
};

export function WarningBanner({ detail, theme, title }: WarningBannerProps): JSX.Element {
  return (
    <View accessibilityRole="alert" style={[styles.warning, { backgroundColor: theme.danger, borderColor: theme.danger }]}>
      <Text style={styles.warningTitle}>{title}</Text>
      <Text style={styles.warningDetail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    flex: 1,
    minWidth: 0,
  },
  detail: {
    fontSize: 12.5,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 3,
  },
  dot: {
    borderRadius: 6,
    height: 12,
    marginTop: 3,
    width: 12,
  },
  surface: {
    alignItems: "flex-start",
    borderRadius: fitnessRealmRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: fitnessRealmSpacing.md,
    padding: fitnessRealmSpacing.lg,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 20,
  },
  warning: {
    borderRadius: fitnessRealmRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: fitnessRealmSpacing.lg,
  },
  warningDetail: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 4,
  },
  warningTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 20,
  },
});
