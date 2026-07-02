import type { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";

import { HealthCard, PrivacyBadge } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { spacing, typography, type PrivacyLabelKey, type RealmColorKey } from "@/theme";

type MetricSummaryCardProps = {
  detail: string;
  label: string;
  privacy?: PrivacyLabelKey;
  realm?: RealmColorKey;
  value: string;
};

export function MetricSummaryCard({ detail, label, privacy = "private", realm = "vitals", value }: MetricSummaryCardProps): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <HealthCard privacy={privacy} realm={realm} title={label}>
      <View style={styles.row}>
        <Text style={[styles.value, { color: theme.realms[realm] }]}>{value}</Text>
        <PrivacyBadge privacy={privacy} />
      </View>
      <Text style={[styles.detail, { color: theme.colors.textSecondary }]}>{detail}</Text>
    </HealthCard>
  );
}

const styles = StyleSheet.create({
  detail: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  value: {
    fontSize: typography.title1.fontSize,
    fontWeight: "800",
    lineHeight: typography.title1.lineHeight,
  },
});
