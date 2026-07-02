import { createPlaceholderRoute } from "@/components/routing";

export default createPlaceholderRoute({
  primaryAction: "Invite",
  purpose: "Invite flow for choosing circle, relationship, role, permissions, expiry, and QR or link delivery.",
  securityNote: "TODO: require signed-in owner/admin access, expiring invite tokens, consent capture, and audit logging before sending invitations.",
  title: "Family invite",
});
