import type { PropsWithChildren, JSX, ReactNode } from "react";
import { View } from "react-native";

import { StandardPageHeader } from "@/components/StandardPageHeader";
import { useAppTheme } from "@/lib/theme";

type PageShellProps = PropsWithChildren<{
  headerRight?: ReactNode;
  subtitle?: string;
  title?: string;
}>;

export function PageShell({ children, headerRight, subtitle, title }: PageShellProps): JSX.Element {
  const { theme } = useAppTheme();

  return (
    <View style={{ backgroundColor: theme.background, flex: 1 }}>
      {title ? <StandardPageHeader right={headerRight} subtitle={subtitle} title={title} /> : null}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
