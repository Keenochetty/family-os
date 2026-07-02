import { createPlaceholderRoute } from "@/components/routing";

export default createPlaceholderRoute({
  primaryAction: "Open",
  purpose: "Shared family chat surface for summaries selected by the owner, without exposing the original private AI thread by default.",
  securityNote: "TODO: require explicit share mode, participant permission checks, redaction review, and audit logging before rendering chat content.",
  title: "Shared chat",
});
