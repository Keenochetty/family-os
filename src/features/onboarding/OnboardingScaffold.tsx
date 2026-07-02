import { useRouter, type Href } from "expo-router";
import type { JSX, ReactNode } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ActionButton, AppScreen, HealthCard, PrivacyBadge, RealmBadge, SectionHeader } from "@/components/ui";
import { radius, spacing, typography, type RealmColorKey } from "@/theme";

import { useHealthOSTheme } from "@/components/ui/theme";

type OnboardingScaffoldProps = {
  children: ReactNode;
  nextHref?: string;
  primaryLabel?: string;
  stepLabel: string;
  subtitle: string;
  title: string;
};

export function OnboardingScaffold({ children, nextHref, primaryLabel = "Continue", stepLabel, subtitle, title }: OnboardingScaffoldProps): JSX.Element {
  const router = useRouter();
  const theme = useHealthOSTheme();

  return (
    <AppScreen
      footer={
        nextHref ? (
          <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
            <ActionButton label={primaryLabel} onPress={() => router.push(nextHref as Href)} />
          </View>
        ) : undefined
      }
    >
      <View style={styles.hero}>
        <PrivacyBadge privacy="private" />
        <Text style={[styles.step, { color: theme.colors.textSecondary }]}>{stepLabel}</Text>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
      </View>
      {children}
    </AppScreen>
  );
}

export function SelectableCard({
  description,
  selected,
  title,
  onPress,
}: {
  description: string;
  onPress: () => void;
  selected?: boolean;
  title: string;
}): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.selectable,
        {
          backgroundColor: selected ? `${theme.brand.primary}18` : theme.colors.surface,
          borderColor: selected ? theme.brand.primary : theme.colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.selectCopy}>
        <Text style={[styles.selectTitle, { color: theme.colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.selectDescription, { color: theme.colors.textSecondary }]}>{description}</Text>
      </View>
      <View style={[styles.radio, { borderColor: selected ? theme.brand.primary : theme.colors.borderStrong }]}>
        {selected ? <View style={[styles.radioDot, { backgroundColor: theme.brand.primary }]} /> : null}
      </View>
    </Pressable>
  );
}

export function OnboardingTextField({ label, value }: { label: string; value: string }): JSX.Element {
  const theme = useHealthOSTheme();

  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
        value={value}
      />
    </View>
  );
}

export function RealmPreviewCard({ description, realm, title }: { description: string; realm: RealmColorKey; title: string }): JSX.Element {
  return (
    <HealthCard privacy="private" realm={realm} title={title} description={description}>
      <RealmBadge realm={realm} />
    </HealthCard>
  );
}

export function OnboardingNote({ title, message }: { message: string; title: string }): JSX.Element {
  return <HealthCard privacy="private" title={title} description={message} />;
}

export function OnboardingSection({ children, subtitle, title }: { children: ReactNode; subtitle?: string; title: string }): JSX.Element {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} subtitle={subtitle} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  fieldLabel: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    lineHeight: typography.label.lineHeight,
  },
  footer: {
    borderTopWidth: 0,
    padding: spacing.page,
  },
  hero: {
    gap: spacing.md,
  },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    lineHeight: typography.body.lineHeight,
    minHeight: 48,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  radio: {
    alignItems: "center",
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  radioDot: {
    borderRadius: radius.pill,
    height: 12,
    width: 12,
  },
  section: {
    gap: spacing.md,
  },
  selectCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  selectable: {
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
  selectDescription: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    lineHeight: typography.caption.lineHeight,
  },
  selectTitle: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  step: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    lineHeight: typography.label.lineHeight,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    lineHeight: typography.body.lineHeight,
  },
  title: {
    fontSize: typography.title1.fontSize,
    fontWeight: typography.title1.fontWeight,
    lineHeight: typography.title1.lineHeight,
  },
});
