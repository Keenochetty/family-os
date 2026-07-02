import type { JSX, ReactNode } from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "@/theme";

import { useHealthOSTheme } from "./theme";

type AppScreenProps = {
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
};

export function AppScreen({ children, footer, scroll = true, style }: AppScreenProps): JSX.Element {
  const theme = useHealthOSTheme();
  const content = <View style={[styles.content, style]}>{children}</View>;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    padding: spacing.page,
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
});
