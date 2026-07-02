import type { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PageShell } from "@/components/PageShell";
<<<<<<< Updated upstream
=======
import { FitnessRealmRoute } from "@/features/fitness-v3/FitnessRealmRoute";
>>>>>>> Stashed changes

export default function FitnessScreen(): JSX.Element {
  return (
    <PageShell>
<<<<<<< Updated upstream
      <View style={styles.screen}>
        <Text style={styles.title}>Fitness</Text>
        <Text style={styles.subtitle}>Fitness tracking will live here.</Text>
      </View>
=======
      <FitnessRealmRoute initialTab="today" />
>>>>>>> Stashed changes
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