import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { Platform, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useState } from "react";

import { ActionButton, HealthCard, PrivacyBadge, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";
import type { DeviceProfile } from "@/types";

import { deviceLibrary, metricPermissions, nativeHealthPlatforms, sourcePriority, supportedDeviceTypes, troubleshootingItems } from "./devicesData";

function statusLabel(status: DeviceProfile["syncStatus"]): string {
  if (status === "connected") return "Connected";
  if (status === "syncing") return "Syncing";
  if (status === "stale") return "Stale";
  if (status === "needs_consent") return "Needs consent";
  return "Disconnected";
}

function DeviceCard({ device }: { device: DeviceProfile }): JSX.Element {
  const router = useRouter();
  const theme = useHealthOSTheme();
  const status = statusLabel(device.syncStatus);

  return (
    <HealthCard
      action={<ActionButton label={device.consentGranted ? "Manage" : "Consent"} onPress={() => router.push("/profile/settings/consent-center" as Href)} variant="secondary" />}
      privacy={device.consentGranted ? "private" : "publicPreview"}
      realm="vitals"
      title={`${device.brand} ${device.model}`}
      description={`${device.deviceType.replaceAll("_", " ")} • ${device.connectionType.replace("_", " ")} • Last sync: ${device.lastSyncAt ?? "Never"}`}
    >
      <View style={styles.badgeRow}>
        <RealmBadge realm="vitals" label={status} />
        <PrivacyBadge privacy={device.consentGranted ? "private" : "publicPreview"} />
      </View>
      <View style={styles.metricWrap}>
        {device.supportedMetrics.map((metric) => (
          <Text key={metric} style={[styles.metricChip, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border, color: theme.colors.textSecondary }]}>
            {metric}
          </Text>
        ))}
      </View>
    </HealthCard>
  );
}

export function ConnectedDevicesScreen(): JSX.Element {
  const [permissions, setPermissions] = useState(metricPermissions);
  const router = useRouter();
  const theme = useHealthOSTheme();
  const activeNativePlatform = Platform.OS === "ios" ? nativeHealthPlatforms[0] : nativeHealthPlatforms[1];

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard
        privacy="private"
        realm="vitals"
        title="Connected devices"
        description="Device sync is off by default. Each metric needs explicit consent and future audit logging before backend sync."
      >
        <View style={styles.badgeRow}>
          <RealmBadge realm="vitals" label="Metric permissions" />
          <RealmBadge realm="records" label="Audit hooks prepared" />
        </View>
      </HealthCard>

      <SectionHeader title="Native health platform" subtitle="Platform-specific placeholders only." />
      <HealthCard
        action={<ActionButton label="Review consent" onPress={() => router.push("/profile/settings/consent-center" as Href)} variant="secondary" />}
        privacy="publicPreview"
        realm="vitals"
        title={activeNativePlatform.title}
        description={activeNativePlatform.description}
      />

      <SectionHeader title="Connected device cards" subtitle="Sync status, last sync time, and explicit permissions." />
      {deviceLibrary.map((device) => (
        <DeviceCard device={device} key={device.id} />
      ))}

      <SectionHeader title="Bluetooth device library" subtitle="Supported types prepared for pairing flows." />
      <View style={styles.typeGrid}>
        {supportedDeviceTypes.map((deviceType) => (
          <View key={deviceType} style={[styles.typeChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.typeText, { color: theme.colors.textPrimary }]}>{deviceType}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Metric permissions" subtitle="User controls each data type before sync." />
      <View style={[styles.panel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {permissions.map((permission) => (
          <View key={permission.id} style={[styles.permissionRow, { borderColor: theme.colors.border }]}>
            <View style={styles.permissionText}>
              <Text style={[styles.permissionTitle, { color: theme.colors.textPrimary }]}>{permission.label}</Text>
              <Text style={[styles.permissionReason, { color: theme.colors.textSecondary }]}>{permission.reason}</Text>
            </View>
            <Switch
              onValueChange={(enabled) => setPermissions((items) => items.map((item) => (item.id === permission.id ? { ...item, enabled } : item)))}
              thumbColor={theme.colors.surface}
              trackColor={{ false: theme.colors.surfaceAlt, true: theme.brand.primary }}
              value={permission.enabled}
            />
          </View>
        ))}
      </View>

      <SectionHeader title="Data source priority" subtitle="Resolve duplicates without silently overwriting records." />
      <View style={[styles.panel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {sourcePriority.map((source) => (
          <View key={source.metric} style={[styles.priorityRow, { borderColor: theme.colors.border }]}>
            <Text style={[styles.priorityMetric, { color: theme.colors.textPrimary }]}>{source.metric}</Text>
            <Text style={[styles.priorityText, { color: theme.colors.textSecondary }]}>Primary: {source.primary}</Text>
            <Text style={[styles.priorityText, { color: theme.colors.textSecondary }]}>Fallback: {source.fallback}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Troubleshooting" />
      <HealthCard
        action={<ActionButton label="Resolve conflicts" onPress={() => router.push("/modals/conflict-resolution" as Href)} variant="secondary" />}
        privacy="private"
        realm="records"
        title="Sync checks"
        description="These checks prepare future device support without connecting to external services yet."
      >
        {troubleshootingItems.map((item) => (
          <View key={item} style={styles.troubleRow}>
            <View style={[styles.dot, { backgroundColor: theme.brand.primary }]} />
            <Text style={[styles.troubleText, { color: theme.colors.textSecondary }]}>{item}</Text>
          </View>
        ))}
      </HealthCard>

      <HealthCard
        action={<ActionButton label="Disconnect flow" onPress={() => router.push("/modals/privacy-review" as Href)} variant="danger" />}
        privacy="private"
        realm="doctorWarning"
        title="Disconnect device"
        description="Disconnect should stop future sync, preserve existing records unless the user deletes them, and write an audit event."
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 150,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  dot: {
    borderRadius: radius.pill,
    height: 8,
    marginTop: 5,
    width: 8,
  },
  metricChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    fontSize: typography.tinyLabel.fontSize,
    fontWeight: typography.tinyLabel.fontWeight,
    lineHeight: typography.tinyLabel.lineHeight,
    overflow: "hidden",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  metricWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  panel: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  permissionReason: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  permissionRow: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
  permissionText: {
    flex: 1,
    gap: spacing.xs,
  },
  permissionTitle: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  priorityMetric: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  priorityRow: {
    borderBottomWidth: 1,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  priorityText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  troubleRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  troubleText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  typeChip: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    width: "47%",
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  typeText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "800",
    lineHeight: typography.caption.lineHeight,
    textTransform: "capitalize",
  },
});
