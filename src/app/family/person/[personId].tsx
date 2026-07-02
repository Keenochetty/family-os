import { createPlaceholderRoute } from "@/components/routing";

export default createPlaceholderRoute({
  primaryAction: "Open",
  purpose: "Family person profile for relationship, circles, role labels, shared calendar visibility, and approved summaries.",
  securityNote: "TODO: load only the selected person's permitted profile fields and keep health records hidden unless explicitly shared.",
  title: "Family person",
});
