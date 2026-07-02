import type { JSX } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionButton, HealthCard, PrivacyBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import { ArticleCard } from "./ArticleCard";
import { articles, hiddenSources, sourceRoutingRules, trustedSources, type SourcePreference } from "./articlesData";

function SourceRow({ source }: { source: SourcePreference }): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <View style={[styles.sourceRow, { borderColor: theme.colors.border }]}>
      <View style={styles.sourceText}>
        <Text style={[styles.sourceTitle, { color: theme.colors.textPrimary }]}>{source.label}</Text>
        <Text style={[styles.sourceDescription, { color: theme.colors.textSecondary }]}>{source.description}</Text>
      </View>
      <Text style={[styles.sourceState, { color: source.trusted ? theme.brand.primary : theme.colors.danger }]}>{source.trusted ? "Trusted" : "Hidden"}</Text>
    </View>
  );
}

export function ArticlesSourcesScreen(): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HealthCard
        privacy="publicPreview"
        realm="records"
        title="Articles & Sources"
        description="Educational previews are routed by country and language, always showing source labels and original links."
      >
        <View style={styles.preferenceGrid}>
          <View style={[styles.preferenceTile, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
            <Text style={[styles.preferenceLabel, { color: theme.colors.textSecondary }]}>Preferred country</Text>
            <Text style={[styles.preferenceValue, { color: theme.colors.textPrimary }]}>South Africa</Text>
          </View>
          <View style={[styles.preferenceTile, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
            <Text style={[styles.preferenceLabel, { color: theme.colors.textSecondary }]}>Preferred language</Text>
            <Text style={[styles.preferenceValue, { color: theme.colors.textPrimary }]}>English</Text>
          </View>
        </View>
      </HealthCard>

      <SectionHeader title="Recommended articles" subtitle="Short summaries only. Open the original source for the full article." />
      {articles.map((article) => (
        <ArticleCard article={article} key={article.id} />
      ))}

      <SectionHeader title="Trusted sources" />
      <View style={[styles.sourcePanel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {trustedSources.map((source) => (
          <SourceRow key={source.id} source={source} />
        ))}
      </View>

      <SectionHeader title="Hidden sources" subtitle="Sources hidden because they are unverified or missing metadata." />
      <View style={[styles.sourcePanel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {hiddenSources.map((source) => (
          <SourceRow key={source.id} source={source} />
        ))}
      </View>

      <SectionHeader title="Routing rules" subtitle="Global content must respect local preferences before fallback." />
      <HealthCard privacy="publicPreview" realm="records" title="Source routing">
        {sourceRoutingRules.map((rule) => (
          <View key={rule} style={styles.ruleRow}>
            <PrivacyBadge privacy="publicPreview" />
            <Text style={[styles.ruleText, { color: theme.colors.textSecondary }]}>{rule}</Text>
          </View>
        ))}
      </HealthCard>

      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.reportBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, pressed && styles.pressed]}
      >
        <View style={styles.sourceText}>
          <Text style={[styles.sourceTitle, { color: theme.colors.textPrimary }]}>Report outdated article</Text>
          <Text style={[styles.sourceDescription, { color: theme.colors.textSecondary }]}>Flag old, regional, unsafe, or missing-source content for review.</Text>
        </View>
        <ActionButton label="Report" variant="secondary" />
      </Pressable>
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
  preferenceGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  preferenceLabel: {
    fontSize: typography.tinyLabel.fontSize,
    fontWeight: typography.tinyLabel.fontWeight,
    lineHeight: typography.tinyLabel.lineHeight,
    textTransform: "uppercase",
  },
  preferenceTile: {
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  preferenceValue: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  reportBox: {
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
  ruleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  ruleText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  sourceDescription: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  sourcePanel: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  sourceRow: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  sourceState: {
    fontSize: typography.caption.fontSize,
    fontWeight: "800",
    lineHeight: typography.caption.lineHeight,
  },
  sourceText: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  sourceTitle: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
});
