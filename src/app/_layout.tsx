import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider } from "heroui-native";
import type { JSX } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { FloatingNav } from "@/components/FloatingNav";
import { AppThemeProvider, useAppTheme } from "@/lib/theme";

import "../global.css";

function ThemedStatusBar(): JSX.Element {
  const { isDark } = useAppTheme();

  return <StatusBar style={isDark ? "light" : "dark"} />;
}

export default function RootLayout(): JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <AppThemeProvider>
          <View style={{ flex: 1 }}>
            <ThemedStatusBar />
            <Stack screenOptions={{ headerShown: false }} />
            <FloatingNav />
          </View>
        </AppThemeProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
