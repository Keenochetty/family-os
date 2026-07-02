import type { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import { ChartFrame } from "./ChartFrame";
import type { ChartBaseProps, HeartRateZone } from "./chartTypes";
import { chartAccent } from "./chartUtils";

type HeartRateZoneChartProps = ChartBaseProps & {
  data: HeartRateZone[];
};

export function HeartRateZoneChart({ data, realm = "sport", ...frameProps }: HeartRateZoneChartProps): JSX.Element {
  const theme = useHealthOSTheme();
  const fallback = chartAccent(realm);
  const total = data.reduce((sum, zone) => sum + zone.minutes, 0);

  return (
    <ChartFrame {...frameProps} empty={data.length === 0} realm={realm}>
      <View style={styles.stack}>
        <View style={styles.zoneBar}>
          {data.map((zone) => (
            <View
              key={zone.id}
              style={[
                styles.zoneSegment,
                {
                  backgroundColor: zone.zoneColor ?? fallback,
                  flex: Math.max(zone.minutes, 1),
                },
              ]}
            />
          ))}
        </View>
        {data.map((zone) => (
          <View key={zone.id} style={styles.zoneRow}>
            <View style={[styles.legendDot, { backgroundColor: zone.zoneColor ?? fallback }]} />
            <Text style={[styles.zoneLabel, { color: theme.colors.textPrimary }]}>{zone.label}</Text>
            <Text style={[styles.zoneMinutes, { color: theme.colors.textSecondary }]}>{zone.minutes} min</Text>
          </View>
        ))}
        <Text style={[styles.zoneMinutes, { color: theme.colors.textSecondary }]}>Total: {total} min</Text>
      </View>
    </ChartFrame>
  );
}

const styles = StyleSheet.create({
  legendDot: {
    borderRadius: radius.pill,
    height: 9,
    width: 9,
  },
  stack: {
    gap: spacing.sm,
  },
  zoneBar: {
    borderRadius: radius.pill,
    flexDirection: "row",
    height: 18,
    overflow: "hidden",
  },
  zoneLabel: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    lineHeight: typography.caption.lineHeight,
  },
  zoneMinutes: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  zoneRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  zoneSegment: {
    height: "100%",
  },
});
