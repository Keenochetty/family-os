import type { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppScreen, HealthCard, PrivacyBadge } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { spacing, typography } from "@/theme";

type PlaceholderRouteScreenProps = {
  primaryAction?: string;
  purpose: string;
  securityNote?: string;
  title: string;
};

export function PlaceholderRouteScreen({
  primaryAction = "Review",
  purpose,
  securityNote = "TODO: connect auth, permission, privacy review, and audit hooks before showing private data.",
  title,
}: PlaceholderRouteScreenProps): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <AppScreen>
      <View style={styles.header}>
        <PrivacyBadge privacy="private" />
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.purpose, { color: theme.colors.textSecondary }]}>{purpose}</Text>
      </View>
      <HealthCard privacy="private" title={`${primaryAction} setup`} description={securityNote} />
    </AppScreen>
  );
}

export function createPlaceholderRoute(config: PlaceholderRouteScreenProps): () => JSX.Element {
  return function PlaceholderScreen(): JSX.Element {
    return <PlaceholderRouteScreen {...config} />;
  };
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
  },
  purpose: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    lineHeight: typography.body.lineHeight,
  },
  title: {
    fontSize: typography.title1.fontSize,
    fontWeight: typography.title1.fontWeight,
    lineHeight: typography.title1.lineHeight,
  },
});
