import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { HealthControlWidget } from "@/components/HealthControlWidget";
import { GoalRing, MetricSummaryCard, TrendLineChart, WeeklyBarChart, weeklyWaterData, weightTrendData } from "@/components/charts";
import { ActionButton, ContextActionMenu, HealthCard, PlanLockBadge, PrivacyBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { ArticleCard, articles } from "@/features/articles";
import { radius, spacing, typography } from "@/theme";

import { moreToolGroups, topRealmWidgets, type HealthRealmWidget, type HealthTool } from "./healthData";

type MenuTarget =
  | { kind: "realm"; item: HealthRealmWidget }
  | { kind: "tool"; item: HealthTool }
  | null;

function RealmWidget({ item, onLongPress }: { item: HealthRealmWidget; onLongPress: (item: HealthRealmWidget) => void }): JSX.Element {
  const router = useRouter();
  const theme = useHealthOSTheme();

  return (
    <HealthCard
      action={<ActionButton label={item.actionLabel} onPress={() => router.push(item.route as Href)} variant="secondary" />}
      description={item.description}
      onLongPress={() => onLongPress(item)}
      privacy={item.privacy}
      realm={item.realm}
      title={item.title}
    >
      <View style={styles.realmMetricRow}>
        <Text style={[styles.realmMetric, { color: theme.realms[item.realm] }]}>{item.miniMetric}</Text>
        <Text style={[styles.realmStatus, { color: theme.colors.textSecondary }]}>{item.status}</Text>
      </View>
      <View style={[styles.miniChartTrack, { backgroundColor: theme.colors.surfaceAlt }]}>
        <View style={[styles.miniChartFill, { backgroundColor: theme.realms[item.realm], width: item.id === "realm-records" ? "42%" : "68%" }]} />
      </View>
    </HealthCard>
  );
}

function ToolChip({ item, onLongPress }: { item: HealthTool; onLongPress: (item: HealthTool) => void }): JSX.Element {
  const router = useRouter();
  const theme = useHealthOSTheme();

  return (
    <Pressable
      accessibilityLabel={item.label}
      accessibilityRole="button"
      onLongPress={() => onLongPress(item)}
      onPress={() => router.push(item.route as Href)}
      style={({ pressed }) => [
        styles.toolChip,
        { backgroundColor: item.locked ? theme.colors.surfaceAlt : theme.colors.surface, borderColor: theme.colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.toolDot, { backgroundColor: theme.realms[item.realm] }]} />
      <Text numberOfLines={1} style={[styles.toolText, { color: theme.colors.textPrimary }]}>
        {item.label}
      </Text>
      {item.locked ? <PlanLockBadge lock="plusRequired" /> : <PrivacyBadge privacy={item.privacy} />}
    </Pressable>
  );
}

export function HealthScreen(): JSX.Element {
  const [menuTarget, setMenuTarget] = useState<MenuTarget>(null);
  const router = useRouter();
  const theme = useHealthOSTheme();

  function openTarget(): void {
    if (!menuTarget) {
      return;
    }

    router.push(menuTarget.item.route as Href);
    setMenuTarget(null);
  }

  const menuTitle = menuTarget ? (menuTarget.kind === "realm" ? menuTarget.item.title : menuTarget.item.label) : undefined;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <PrivacyBadge privacy="private" />
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Health</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Top realms, records, documents, tools, and source-backed learning. Private by default.
        </Text>
      </View>

      <SectionHeader title="Top 4 realms" subtitle="Long press for quick log, records, charts, AI, reorder, privacy, or sharing." />
      <View style={styles.realmGrid}>
        {topRealmWidgets.map((item) => (
          <RealmWidget key={item.id} item={item} onLongPress={(next) => setMenuTarget({ kind: "realm", item: next })} />
        ))}
      </View>

      <SectionHeader title="This week's catch-up" subtitle="Collapsed summary with safe, private details." />
      <HealthCard
        privacy="private"
        realm="records"
        title="This week: 5 workouts - 2 symptoms - 1 document - 4 mood logs"
        description="Trends, missed reminders, abnormal readings, and reports require review before sharing."
        action={<ActionButton label="Ask AI" onPress={() => router.push("/ai" as Href)} variant="secondary" />}
      />

      <View style={styles.twoColumn}>
        <HealthCard
          privacy="private"
          realm="documents"
          title="Documents"
          description="Doctor notes, prescriptions, scans, child clinic cards, and school forms."
          action={<ActionButton label="Review" onPress={() => router.push("/records" as Href)} variant="secondary" />}
        />
        <HealthCard
          privacy="private"
          realm="records"
          title="Records / History"
          description="Filter by person, realm, date, status, shared/private, doctor reviewed, and attachments."
          action={<ActionButton label="Open" onPress={() => router.push("/records" as Href)} variant="secondary" />}
        />
      </View>

      <SectionHeader title="Health Control" subtitle="Existing modular board preserved inside the Health tab." />
      <HealthControlWidget framed={false} title="Health Control" subtitle="Your modular health board" />

      <SectionHeader title="Chart previews" subtitle="Reusable chart components for records, vitals, hydration, fitness, and trends." />
      <MetricSummaryCard label="Current weight" value="81.5 kg" detail="Private manual record. Source labels appear on chart cards." realm="vitals" />
      <TrendLineChart
        data={weightTrendData}
        dataSource="Manual records"
        realm="vitals"
        timeRange="Last 5 weeks"
        title="Weight trend"
        unit="kg"
        onLongPressPoint={() => router.push("/modals/privacy-review" as Href)}
      />
      <WeeklyBarChart
        data={weeklyWaterData}
        dataSource="Manual logs"
        realm="hydration"
        timeRange="This week"
        title="Water"
        unit="ml"
        onLongPressPoint={() => router.push("/ai" as Href)}
      />
      <GoalRing dataSource="Daily goal" goal={2500} realm="hydration" timeRange="Today" title="Hydration goal" unit="ml" value={1800} />

      <SectionHeader title="More tools" subtitle="Grouped by intent, not dumped into one grid." />
      {moreToolGroups.map((group) => (
        <View key={group.id} style={styles.toolGroup}>
          <Text style={[styles.groupTitle, { color: theme.colors.textPrimary }]}>{group.title}</Text>
          <View style={styles.toolGrid}>
            {group.tools.map((tool) => (
              <ToolChip key={tool.id} item={tool} onLongPress={(next) => setMenuTarget({ kind: "tool", item: next })} />
            ))}
          </View>
        </View>
      ))}

      <SectionHeader title="Explore realms" subtitle="Educational article cards must show source, region, license, disclaimer, and original link before real content." />
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}

      <Modal animationType="fade" onRequestClose={() => setMenuTarget(null)} transparent visible={Boolean(menuTarget)}>
        <View style={styles.modalRoot}>
          <Pressable accessibilityRole="button" onPress={() => setMenuTarget(null)} style={styles.scrim} />
          <View style={[styles.menuDock, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <ContextActionMenu
              title={menuTitle}
              actions={[
                { id: "open", label: "Open", onPress: openTarget },
                { id: "quick-log", label: "Quick log", onPress: openTarget },
                { id: "records", label: "View records", onPress: () => router.push("/records" as Href) },
                { id: "charts", label: "View charts", onPress: () => router.push("/health" as Href) },
                { id: "ask-ai", label: "Ask AI", onPress: () => router.push("/ai" as Href) },
                { id: "privacy", label: "Privacy review", onPress: () => router.push("/modals/privacy-review" as Href) },
                { id: "share", label: "Share summary", onPress: () => router.push("/modals/privacy-review" as Href) },
                { id: "remove", label: "Remove", destructive: true, onPress: () => setMenuTarget(null) },
              ]}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: 150,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  groupTitle: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  hero: {
    gap: spacing.sm,
  },
  menuDock: {
    borderRadius: radius.lg,
    borderWidth: 1,
    margin: spacing.lg,
    overflow: "hidden",
  },
  miniChartFill: {
    borderRadius: radius.pill,
    height: "100%",
  },
  miniChartTrack: {
    borderRadius: radius.pill,
    height: 8,
    overflow: "hidden",
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  realmGrid: {
    gap: spacing.md,
  },
  realmMetric: {
    fontSize: typography.title3.fontSize,
    fontWeight: "800",
    lineHeight: typography.title3.lineHeight,
  },
  realmMetricRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  realmStatus: {
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    lineHeight: typography.caption.lineHeight,
  },
  scrim: {
    backgroundColor: "rgba(15,23,42,0.34)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  title: {
    fontSize: typography.title1.fontSize,
    fontWeight: typography.title1.fontWeight,
    lineHeight: typography.title1.lineHeight,
  },
  toolChip: {
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  toolDot: {
    borderRadius: radius.pill,
    height: 10,
    width: 10,
  },
  toolGrid: {
    gap: spacing.sm,
  },
  toolGroup: {
    gap: spacing.sm,
  },
  toolText: {
    flex: 1,
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  twoColumn: {
    gap: spacing.md,
  },
});
