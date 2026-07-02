import { useCallback, useState } from "react";

import * as Haptics from "expo-haptics";

import type { HapticIntensity } from "@/theme";

export type HapticIntent = Exclude<HapticIntensity, "off">;

export function useHaptics(initialEnabled = true): {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  trigger: (intent?: HapticIntensity) => Promise<void>;
} {
  const [enabled, setEnabled] = useState(initialEnabled);

  const trigger = useCallback(
    async (intent: HapticIntensity = "selection") => {
      if (!enabled || intent === "off") {
        return;
      }

      if (intent === "selection") {
        await Haptics.selectionAsync();
        return;
      }

      if (intent === "success" || intent === "warning" || intent === "error") {
        const notificationType =
          intent === "success"
            ? Haptics.NotificationFeedbackType.Success
            : intent === "warning"
              ? Haptics.NotificationFeedbackType.Warning
              : Haptics.NotificationFeedbackType.Error;

        await Haptics.notificationAsync(notificationType);
        return;
      }

      const styleMap = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      } as const;

      await Haptics.impactAsync(styleMap[intent]);
    },
    [enabled],
  );

  return { enabled, setEnabled, trigger };
}
