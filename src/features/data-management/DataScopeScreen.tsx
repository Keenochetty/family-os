import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useState } from "react";

import { ActionButton, HealthCard, PrivacyBadge, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import { dataSecurityNotes, emergencyProfileItems, exportScopes, importSources, offlineScopes, reportTemplates, type DataScope } from "./dataManagementData";

function ScopeRow({ item, onToggle }: { item: DataScope; onToggle?: (enabled: boolean) => void }): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <View style={[styles.scopeRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.scopeCopy}>
        <View style={styles.badges}>
          <RealmBadge realm={item.realm} />
          <PrivacyBadge privacy={item.privacy} />
        </View>
        <Text style={[styles.scopeTitle, { color: theme.colors.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.scopeDescription, { color: theme.colors.textSecondary }]}>{item.description}</Text>
      </View>
      {onToggle ? <Switch onValueChange={onToggle} thumbColor={theme.colors.surface} trackColor={{ false: theme.colors.surfaceAlt, true: theme.brand.primary }} value={item.enabled} /> : null}
    </View>
  );
}

export function ReportsScreen(): JSX.Element {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard privacy="private" realm="records" title="Reports" description="Create private reports from scoped records after privacy confirmation." action={<ActionButton label="Custom date range" onPress={() => router.push("/reports/create" as Href)} variant="secondary" />} />
      <SectionHeader title="Report templates" />
      {reportTemplates.map((report) => (
        <HealthCard key={report.id} privacy={report.privacy} realm={report.realm} title={report.title} description={report.description} action={<ActionButton label="Create" onPress={() => router.push("/reports/create" as Href)} variant="secondary" />} />
      ))}
      <SecurityNotes />
    </ScrollView>
  );
}

export function CreateReportScreen(): JSX.Element {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard privacy="private" realm="records" title="Create report" description="Choose report type, people, date range, data categories, and recipients before privacy confirmation." />
      {reportTemplates.map((report) => (
        <ScopeRow key={report.id} item={{ description: report.description, enabled: report.id === "doctor", id: report.id, privacy: report.privacy, realm: report.realm, title: report.title }} />
      ))}
      <HealthCard privacy="private" realm="records" title="Custom date range" description="Placeholder for start date, end date, selected realms, source labels, and excluded sensitive notes." />
      <SecurityNotes />
    </ScrollView>
  );
}

export function DataExportScreen(): JSX.Element {
  const [items, setItems] = useState(exportScopes);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard privacy="private" realm="records" title="Data export" description="Export health records, documents, AI chats, calendar, or Moments only after privacy confirmation." />
      {items.map((item) => (
        <ScopeRow key={item.id} item={item} onToggle={(enabled) => setItems((current) => current.map((next) => (next.id === item.id ? { ...next, enabled } : next)))} />
      ))}
      <ActionButton label="Privacy confirmation" variant="primary" />
      <SecurityNotes />
    </ScrollView>
  );
}

export function DataImportScreen(): JSX.Element {
  const [items, setItems] = useState(importSources);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard privacy="private" realm="records" title="Data import" description="Import records, documents, scans, or device files only after review and consent." />
      {items.map((item) => (
        <ScopeRow key={item.id} item={item} onToggle={(enabled) => setItems((current) => current.map((next) => (next.id === item.id ? { ...next, enabled } : next)))} />
      ))}
      <HealthCard privacy="private" realm="doctorWarning" title="Review before save" description="Imports must not silently overwrite health records. Conflicts should route to conflict resolution." />
    </ScrollView>
  );
}

export function OfflineSettingsScreen(): JSX.Element {
  const [items, setItems] = useState(offlineScopes);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard privacy="private" realm="emergency" title="Offline settings" description="Offline data is sensitive. Keep scopes small, review expiry, and require device protection before future sync." />
      {items.map((item) => (
        <ScopeRow key={item.id} item={item} onToggle={(enabled) => setItems((current) => current.map((next) => (next.id === item.id ? { ...next, enabled } : next)))} />
      ))}
      <SecurityNotes />
    </ScrollView>
  );
}

export function EmergencyProfileScreen(): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard privacy="private" realm="emergency" title="Emergency profile" description="Carefully scoped profile for emergency use. Keep it minimal and explicit." />
      <SectionHeader title="Emergency scope" subtitle="Only details selected here should be available offline." />
      <View style={[styles.panel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {emergencyProfileItems.map((item) => (
          <View key={item} style={[styles.simpleRow, { borderColor: theme.colors.border }]}>
            <RealmBadge realm="emergency" label="Scope" />
            <Text style={[styles.simpleText, { color: theme.colors.textSecondary }]}>{item}</Text>
          </View>
        ))}
      </View>
      <SecurityNotes />
    </ScrollView>
  );
}

function SecurityNotes(): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <HealthCard privacy="private" realm="doctorWarning" title="Security requirements">
      {dataSecurityNotes.map((note) => (
        <View key={note} style={styles.noteRow}>
          <View style={[styles.dot, { backgroundColor: theme.colors.danger }]} />
          <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>{note}</Text>
        </View>
      ))}
    </HealthCard>
  );
}

const styles = StyleSheet.create({
  badges: {
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
  noteRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  noteText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  panel: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  scopeCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  scopeDescription: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  scopeRow: {
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
  scopeTitle: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  simpleRow: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.lg,
  },
  simpleText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
});
