import type { PropsWithChildren, JSX } from "react";
import { useColorScheme, View } from "react-native";

export function PageShell({ children }: PropsWithChildren): JSX.Element {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? "#09090b" : "#f8fafc";

  return <View style={{ backgroundColor, flex: 1 }}>{children}</View>;
}
