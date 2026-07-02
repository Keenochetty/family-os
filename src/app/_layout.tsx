import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import type { JSX } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { FloatingNav } from "@/components/FloatingNav";
<<<<<<< Updated upstream
=======
import { AIAssistantLayer } from "@/features/ai";
import { AppThemeProvider, useAppTheme } from "@/lib/theme";
>>>>>>> Stashed changes

import "../global.css";

export default function RootLayout(): JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
<<<<<<< Updated upstream
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
          <FloatingNav />
        </View>
=======
        <AppThemeProvider>
          <View style={{ flex: 1 }}>
            <ThemedStatusBar />
            <Stack screenOptions={{ headerShown: false }} />
            <AIAssistantLayer />
            <FloatingNav />
          </View>
        </AppThemeProvider>
>>>>>>> Stashed changes
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
