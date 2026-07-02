import type { JSX } from "react";

import { PageShell } from "@/components/PageShell";
import { HealthScreen as HealthScreenContent } from "@/features/health";

export default function HealthScreen(): JSX.Element {
  return (
<<<<<<< Updated upstream
    <PageShell>
      <View style={styles.screen}>
        <HealthControlWidget framed={false} title="Health Control" subtitle="Your modular health board" />
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
=======
    <PageShell title="Health">
      <HealthScreenContent />
    </PageShell>
  );
}
>>>>>>> Stashed changes
