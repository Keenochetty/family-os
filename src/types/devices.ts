export type DeviceProfile = {
  id: string;
  brand: string;
  model: string;
  deviceType:
    | "watch"
    | "band"
    | "fitness_band"
    | "ring"
    | "scale"
    | "bp_monitor"
    | "glucose_meter"
    | "thermometer"
    | "pulse_oximeter"
    | "bike_sensor"
    | "heart_rate_strap"
    | "sleep_tracker"
    | "smart_water_bottle"
    | "other";
  connectionType: "apple_health" | "health_connect" | "api" | "ble" | "manual";
  consentGranted?: boolean;
  lastSyncAt?: string;
  metricPermissions?: Record<string, boolean>;
  priority?: number;
  syncStatus?: "connected" | "syncing" | "stale" | "disconnected" | "needs_consent";
  supportedMetrics: string[];
  supportedPlatforms: ("ios" | "android" | "web")[];
  reliabilityScore?: number;
};
