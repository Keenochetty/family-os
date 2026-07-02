import type { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";

import { planLockLabels, radius, spacing, typography, type PlanLockLabelKey } from "@/theme";

type PlanLockBadgeProps = {
  lock: PlanLockLabelKey;
};

export function PlanLockBadge({ lock }: PlanLockBadgeProps): JSX.Element {
  const token = planLockLabels[lock];

  return (
    <View accessibilityLabel={token.accessibilityLabel} style={[styles.badge, { backgroundColor: `${token.tone}18`, borderColor: `${token.tone}66` }]}>
      <Text style={[styles.lock, { color: token.tone }]}>Lock</Text>
      <Text style={[styles.label, { color: token.tone }]}>{token.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: typography.tinyLabel.fontSize,
    fontWeight: typography.tinyLabel.fontWeight,
    lineHeight: typography.tinyLabel.lineHeight,
  },
  lock: {
    fontSize: typography.tinyLabel.fontSize,
    fontWeight: "800",
    lineHeight: typography.tinyLabel.lineHeight,
  },
});
