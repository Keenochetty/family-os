import { StyleSheet, Text, View } from "react-native";

import { HealthCard } from "@/components/ui";
import { useHealthOSTheme } from "@/components/ui/theme";
import { OnboardingScaffold } from "@/features/onboarding/OnboardingScaffold";
import { radius, spacing } from "@/theme";

export default function AvatarScreen() {
  const theme = useHealthOSTheme();

  return (
    <OnboardingScaffold nextHref="/onboarding/plan" primaryLabel="Use avatar" stepLabel="Profile" title="Choose your avatar" subtitle="This placeholder shows how your profile can appear in calendar, family, and privacy review screens.">
      <View style={[styles.avatar, { backgroundColor: `${theme.brand.primary}18`, borderColor: `${theme.brand.primary}55` }]}>
        <Text style={[styles.initial, { color: theme.brand.primary }]}>K</Text>
      </View>
      <HealthCard privacy="private" title="Avatar privacy" description="Your avatar is profile metadata. Family and caregiver visibility should follow explicit profile-sharing settings later." />
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: radius.xxl,
    borderWidth: 1,
    height: 112,
    justifyContent: "center",
    marginVertical: spacing.lg,
    width: 112,
  },
  initial: {
    fontSize: 44,
    fontWeight: "800",
    lineHeight: 52,
  },
});
