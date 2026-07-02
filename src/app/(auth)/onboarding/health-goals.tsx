import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { purposeOptions } from "@/features/onboarding/onboardingData";
import { OnboardingScaffold } from "@/features/onboarding/OnboardingScaffold";
import { radius, spacing, typography } from "@/theme";
import { useHealthOSTheme } from "@/components/ui/theme";

export default function HealthGoalsScreen() {
  const [selected, setSelected] = useState<string[]>(["fitness", "nutrition", "family", "records"]);
  const theme = useHealthOSTheme();

  function toggle(id: string): void {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <OnboardingScaffold nextHref="/onboarding/top-realms" stepLabel="Purpose" title="What should Health OS help with first?" subtitle="Choose a few calm starting points. These moving pills shape your Top 4 realms.">
      <View style={styles.pillWrap}>
        {purposeOptions.map((option, index) => {
          const active = selected.includes(option.id);
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={option.id}
              onPress={() => toggle(option.id)}
              style={({ pressed }) => [
                styles.pill,
                {
                  backgroundColor: active ? `${theme.brand.primary}18` : theme.colors.surface,
                  borderColor: active ? theme.brand.primary : theme.colors.border,
                  marginTop: index % 2 === 0 ? 0 : spacing.md,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.pillText, { color: active ? theme.brand.primary : theme.colors.textPrimary }]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  pillText: {
    fontSize: typography.bodyStrong.fontSize,
    fontWeight: typography.bodyStrong.fontWeight,
    lineHeight: typography.bodyStrong.lineHeight,
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});
