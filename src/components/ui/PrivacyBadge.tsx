import type { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";

import { privacyLabels, radius, spacing, typography, type PrivacyLabelKey } from "@/theme";

type PrivacyBadgeProps = {
  privacy: PrivacyLabelKey;
};

export function PrivacyBadge({ privacy }: PrivacyBadgeProps): JSX.Element {
  const token = privacyLabels[privacy];

  return (
    <View accessibilityLabel={token.accessibilityLabel} style={[styles.badge, { backgroundColor: `${token.tone}18`, borderColor: `${token.tone}66` }]}>
      <Text style={[styles.label, { color: token.tone }]}>{token.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: typography.tinyLabel.fontSize,
    fontWeight: typography.tinyLabel.fontWeight,
    lineHeight: typography.tinyLabel.lineHeight,
  },
});
