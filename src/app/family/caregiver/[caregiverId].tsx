import { createPlaceholderRoute } from "@/components/routing";

export default createPlaceholderRoute({
  primaryAction: "Review",
  purpose: "Caregiver profile for limited care access, pickup notes, allergies, medications, and care logs.",
  securityNote: "TODO: require parent approval, least-privilege scopes, expiry controls, revocation, and audit events before caregiver access.",
  title: "Caregiver access",
});
