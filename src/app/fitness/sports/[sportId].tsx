import { createPlaceholderRoute } from "@/components/routing";

export default createPlaceholderRoute({
  primaryAction: "Review activity",
  purpose: "Sport detail screen for planned, imported, labeled, or completed activities with metrics, route, effort, hydration, injury notes, and Moment actions.",
  securityNote: "TODO: require explicit consent before syncing route, heart rate, injury notes, climate, hydration, or shared participant details.",
  title: "Sport detail",
});
