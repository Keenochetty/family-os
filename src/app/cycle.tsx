import type { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PageShell } from "@/components/PageShell";

export default function CycleScreen(): JSX.Element {
  return (
    <PageShell title="Cycle">
      <View style={styles.screen}>
        <Text style={styles.subtitle}>Cycle tracking will live here.</Text>
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
