import type { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PageShell } from "@/components/PageShell";

export default function MentalHealthScreen(): JSX.Element {
  return (
    <PageShell>
      <View style={styles.screen}>
        <Text style={styles.title}>Mental Health</Text>
        <Text style={styles.subtitle}>Mental health check-ins will live here.</Text>
      </View>
    </PageShell>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0,
    textAlign: "center",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 20,
    marginTop: 10,
    textAlign: "center",
  },
});