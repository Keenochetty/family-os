import { createPlaceholderRoute } from "@/components/routing";

export default createPlaceholderRoute({
  primaryAction: "Manage",
  purpose: "Permission manager for family circles, caregivers, schools, shared chats, records, tasks, and Moments.",
  securityNote: "TODO: enforce owner/admin checks, backend row-level security, privacy review, revocation, and audit history before changing access.",
  title: "Family permissions",
});
