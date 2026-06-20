import type { JSX } from "react";
import { Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useRouter } from "expo-router";

import { PageShell } from "@/components/PageShell";
import type { HealthRealmConfig } from "@/features/health/config/healthRealmRegistry";

type HealthFeaturePlaceholderScreenProps = {
  config: HealthRealmConfig;
};

export function HealthFeaturePlaceholderScreen({ config }: HealthFeaturePlaceholderScreenProps): JSX.Element {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const background = isDark ? "#09090b" : "#F8FAFC";
  const panel = isDark ? "#18181B" : "#FFFFFF";
  const text = isDark ? "#F8FAFC" : "#111827";
  const muted = isDark ? "rgba(248,250,252,0.68)" : "#64748B";
  const border = isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.08)";
  const status = config.setupRequired ? "Setup needed" : "Coming soon";

  return (
    <PageShell>
      <View style={[styles.screen, { backgroundColor: background }]}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={[styles.backButton, { borderColor: border }]}>
          <Text style={[styles.backText, { color: text }]}>Back</Text>
        </Pressable>

        <View style={[styles.card, { backgroundColor: panel, borderColor: border }]}>
          <View style={[styles.iconBadge, { backgroundColor: config.accentColor }]}>
            <Text style={styles.iconText}>{config.emoji ?? config.icon.slice(0, 1).toUpperCase()}</Text>
          </View>
          <Text style={[styles.status, { color: config.accentColor }]}>{status}</Text>
          <Text style={[styles.title, { color: text }]}>{config.label}</Text>
          <Text style={[styles.description, { color: muted }]}>{config.description}</Text>

          <View style={styles.actions}>
            {config.placeholderActions.slice(0, 3).map((action) => (
              <Pressable accessibilityRole="button" key={action} style={[styles.actionButton, { borderColor: border }]}>
                <Text style={[styles.actionText, { color: text }]}>{action}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </PageShell>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
    textAlign: "center",
  },
  actions: {
    gap: 10,
    marginTop: 24,
    width: "100%",
  },
  backButton: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  backText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
  },
  card: {
    alignItems: "center",
    borderRadius: 28,
    borderWidth: 1,
    maxWidth: 420,
    padding: 24,
    width: "100%",
  },
  description: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 22,
    marginTop: 12,
    textAlign: "center",
  },
  iconBadge: {
    alignItems: "center",
    borderRadius: 24,
    height: 64,
    justifyContent: "center",
    marginBottom: 18,
    width: 64,
  },
  iconText: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: 0,
  },
  screen: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 128,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  status: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 34,
    marginTop: 8,
    textAlign: "center",
  },
});
