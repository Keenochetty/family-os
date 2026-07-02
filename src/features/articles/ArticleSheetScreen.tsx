import type { JSX } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionButton, HealthCard, PrivacyBadge, RealmBadge, SectionHeader } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import { featuredArticle } from "./articlesData";

export function ArticleSheetScreen(): JSX.Element {
  const article = featuredArticle;
  const theme = useHealthOSTheme();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.dragHandleWrap}>
        <View style={[styles.dragHandle, { backgroundColor: theme.colors.border }]} />
      </View>
      <View style={styles.header}>
        <PrivacyBadge privacy="publicPreview" />
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{article.title}</Text>
        <Text style={[styles.summary, { color: theme.colors.textSecondary }]}>{article.summary}</Text>
        <View style={styles.badges}>
          <RealmBadge realm={article.realm} label={article.topic} />
          <Text style={[styles.badge, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border, color: theme.colors.textSecondary }]}>
            {article.source}
          </Text>
          <Text style={[styles.badge, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border, color: theme.colors.textSecondary }]}>
            {article.region} • {article.language}
          </Text>
        </View>
      </View>

      <View style={[styles.hero, { backgroundColor: `${theme.realms[article.realm]}1F`, borderColor: `${theme.realms[article.realm]}55` }]} />

      <SectionHeader title="Key takeaways" subtitle="Short app summary only; original source remains linked below." />
      <HealthCard privacy="publicPreview" realm={article.realm} title="Summary">
        {article.keyTakeaways.map((item) => (
          <View key={item} style={styles.takeawayRow}>
            <View style={[styles.dot, { backgroundColor: theme.realms[article.realm] }]} />
            <Text style={[styles.takeawayText, { color: theme.colors.textSecondary }]}>{item}</Text>
          </View>
        ))}
      </HealthCard>

      <SectionHeader title="Related actions" />
      <View style={styles.actionGrid}>
        {article.relatedActions.map((action) => (
          <ActionButton key={action} label={action} variant="secondary" />
        ))}
      </View>

      <HealthCard
        privacy="publicPreview"
        realm="doctorWarning"
        title="Medical disclaimer"
        description="This is educational content, not medical advice. In an emergency, use local emergency services. For personal care decisions, consult a qualified clinician."
      />

      <Text style={[styles.sourceLink, { color: theme.brand.primary }]}>Original source: {article.originalUrl}</Text>
      <Text style={[styles.fullReadHint, { color: theme.colors.textSecondary }]}>Drag up to full read view. Full copied articles are intentionally not stored here.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionGrid: {
    gap: spacing.md,
  },
  badge: {
    borderRadius: radius.pill,
    borderWidth: 1,
    fontSize: typography.tinyLabel.fontSize,
    fontWeight: typography.tinyLabel.fontWeight,
    lineHeight: typography.tinyLabel.lineHeight,
    overflow: "hidden",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
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
  dragHandle: {
    borderRadius: radius.pill,
    height: 5,
    width: 48,
  },
  dragHandleWrap: {
    alignItems: "center",
  },
  fullReadHint: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    textAlign: "center",
  },
  header: {
    gap: spacing.sm,
  },
  hero: {
    aspectRatio: 1.75,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  sourceLink: {
    fontSize: typography.caption.fontSize,
    fontWeight: "800",
    lineHeight: typography.caption.lineHeight,
  },
  summary: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  takeawayRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  takeawayText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  title: {
    fontSize: typography.title1.fontSize,
    fontWeight: typography.title1.fontWeight,
    lineHeight: typography.title1.lineHeight,
  },
});
