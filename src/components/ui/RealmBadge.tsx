import type { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";

import { radius, realmColors, spacing, typography, type RealmColorKey } from "@/theme";

type RealmBadgeProps = {
  label?: string;
  realm: RealmColorKey;
};

export function RealmBadge({ label, realm }: RealmBadgeProps): JSX.Element {
  const color = realmColors[realm];

  return (
    <View accessibilityLabel={`${label ?? realm} realm`} style={[styles.badge, { backgroundColor: `${color}1A`, borderColor: `${color}66` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label ?? realm}</Text>
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
  dot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  label: {
    fontSize: typography.tinyLabel.fontSize,
    fontWeight: typography.tinyLabel.fontWeight,
    lineHeight: typography.tinyLabel.lineHeight,
    textTransform: "capitalize",
  },
});
