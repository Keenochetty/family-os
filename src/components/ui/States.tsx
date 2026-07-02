import type { JSX, ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography } from "@/theme";

import { ActionButton } from "./ActionButton";
import { useHealthOSTheme } from "./theme";

type StateProps = {
  actionLabel?: string;
  icon?: ReactNode;
  message?: string;
  onAction?: () => void;
  title: string;
};

export function EmptyState({ actionLabel, icon, message, onAction, title }: StateProps): JSX.Element {
  return <StateFrame actionLabel={actionLabel} icon={icon} message={message} onAction={onAction} title={title} />;
}

export function ErrorState({ actionLabel = "Try again", icon, message, onAction, title }: StateProps): JSX.Element {
  return <StateFrame actionLabel={actionLabel} icon={icon} message={message} onAction={onAction} title={title} tone="danger" />;
}

export function LoadingState({ message = "Loading", title = "Please wait" }: Partial<StateProps>): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <View accessibilityLiveRegion="polite" style={[styles.frame, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <ActivityIndicator color={theme.brand.primary} />
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

function StateFrame({ actionLabel, icon, message, onAction, title, tone = "neutral" }: StateProps & { tone?: "neutral" | "danger" }): JSX.Element {
  const theme = useHealthOSTheme();
  const accent = tone === "danger" ? theme.colors.danger : theme.brand.primary;

  return (
    <View style={[styles.frame, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {icon ? <View style={styles.icon}>{icon}</View> : <View style={[styles.defaultIcon, { backgroundColor: `${accent}1A`, borderColor: `${accent}44` }]} />}
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      {message ? <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text> : null}
      {actionLabel && onAction ? <ActionButton label={actionLabel} onPress={onAction} variant={tone === "danger" ? "danger" : "secondary"} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  defaultIcon: {
    borderRadius: radius.md,
    borderWidth: 1,
    height: 44,
    width: 44,
  },
  frame: {
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xl,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    lineHeight: typography.body.lineHeight,
    textAlign: "center",
  },
  title: {
    fontSize: typography.title3.fontSize,
    fontWeight: typography.title3.fontWeight,
    lineHeight: typography.title3.lineHeight,
    textAlign: "center",
  },
});
