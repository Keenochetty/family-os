import { createPlaceholderRoute } from "@/components/routing";

export default createPlaceholderRoute({
  primaryAction: "Re-auth required",
  purpose: "Prepare 2FA, passkeys, sessions, and sensitive-screen lock settings.",
  securityNote: "TODO: require recent authentication before changing 2FA, passkeys, active sessions, recovery settings, or sensitive-screen lock rules.",
  title: "Security",
});
