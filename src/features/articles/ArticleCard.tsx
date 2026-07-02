import { useRouter, type Href } from "expo-router";
import type { JSX } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrivacyBadge, RealmBadge } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { radius, spacing, typography } from "@/theme";

import type { Article } from "./articlesData";

type ArticleCardProps = {
  article: Article;
  onPress?: (article: Article) => void;
};

export function ArticleCard({ article, onPress }: ArticleCardProps): JSX.Element {
  const router = useRouter();
  const theme = useHealthOSTheme();

  function openArticle(): void {
    if (onPress) {
      onPress(article);
      return;
    }

    router.push("/modals/article-sheet" as Href);
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={openArticle}
      style={({ pressed }) => [styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, pressed && styles.pressed]}
    >
      <View style={[styles.thumbnail, { backgroundColor: `${theme.realms[article.realm]}1F` }]}>
        <View style={[styles.thumbnailPanel, { backgroundColor: `${theme.realms[article.realm]}33`, borderColor: `${theme.realms[article.realm]}66` }]} />
      </View>
      <View style={styles.copy}>
        <View style={styles.badges}>
          <RealmBadge realm={article.realm} label={article.topic} />
          <PrivacyBadge privacy="publicPreview" />
        </View>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{article.title}</Text>
        <Text style={[styles.summary, { color: theme.colors.textSecondary }]}>{article.summary}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.metaBadge, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border, color: theme.colors.textSecondary }]}>
            {article.source}
          </Text>
          <Text style={[styles.metaBadge, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border, color: theme.colors.textSecondary }]}>
            {article.region} • {article.language}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    overflow: "hidden",
    padding: spacing.md,
  },
  copy: {
    gap: spacing.sm,
  },
  metaBadge: {
    borderRadius: radius.pill,
    borderWidth: 1,
    fontSize: typography.tinyLabel.fontSize,
    fontWeight: typography.tinyLabel.fontWeight,
    lineHeight: typography.tinyLabel.lineHeight,
    overflow: "hidden",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  summary: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  thumbnail: {
    aspectRatio: 1.9,
    borderRadius: radius.md,
    overflow: "hidden",
    padding: spacing.md,
  },
  thumbnailPanel: {
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
  },
  title: {
    fontSize: typography.title3.fontSize,
    fontWeight: typography.title3.fontWeight,
    lineHeight: typography.title3.lineHeight,
  },
});
