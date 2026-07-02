import type { JSX, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { EmptyState, HealthCard, LoadingState } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { spacing, typography, type RealmColorKey } from "@/theme";

type ChartFrameProps = {
  accessibilityLabel?: string;
  children: ReactNode;
  dataSource?: string;
  empty?: boolean;
  emptyMessage?: string;
  loading?: boolean;
  realm?: RealmColorKey;
  timeRange?: string;
  title: string;
  unit?: string;
};

export function ChartFrame({
  accessibilityLabel,
  children,
  dataSource,
  empty,
  emptyMessage = "No chart data yet.",
  loading,
  realm = "vitals",
  timeRange,
  title,
  unit,
}: ChartFrameProps): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <HealthCard privacy="private" realm={realm} title={title} description={[timeRange, unit, dataSource].filter(Boolean).join(" - ")}>
      <View accessible accessibilityLabel={accessibilityLabel ?? `${title} chart`} style={styles.chartBody}>
        {loading ? <LoadingState title="Loading chart" message="Preparing private chart data." /> : empty ? <EmptyState title="No data" message={emptyMessage} /> : children}
        <Text style={[styles.disclaimer, { color: theme.colors.textSecondary }]}>
          Trends are informational and not a diagnosis. Please confirm medical decisions with a healthcare professional.
        </Text>
      </View>
    </HealthCard>
  );
}

const styles = StyleSheet.create({
  chartBody: {
    gap: spacing.md,
  },
  disclaimer: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
});
