import type { JSX } from "react";
import { StyleSheet, View } from "react-native";

import { HealthControlWidget } from "@/components/HealthControlWidget";
import { PageShell } from "@/components/PageShell";

export default function HealthScreen(): JSX.Element {
  return (
    <PageShell>
      <View style={styles.screen}>
        <HealthControlWidget framed={false} title="Health" subtitle="Your modular health board" />
      </View>
    </PageShell>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    paddingBottom: 128,
    paddingHorizontal: 16,
    paddingTop: 36,
    width: "100%",
  },
});
