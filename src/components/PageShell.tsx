import type { PropsWithChildren, JSX } from "react";
import { View } from "react-native";

import { useAppTheme } from "@/lib/theme";

export function PageShell({ children }: PropsWithChildren): JSX.Element {
  const { theme } = useAppTheme();

  return <View style={{ backgroundColor: theme.background, flex: 1 }}>{children}</View>;
}
