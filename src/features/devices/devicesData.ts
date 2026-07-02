import type { DeviceProfile } from "@/types";

export type MetricPermission = {
  enabled: boolean;
  id: string;
  label: string;
  reason: string;
};

export type SyncSourcePriority = {
  fallback: string;
  metric: string;
  primary: string;
};

export const nativeHealthPlatforms = [
  {
    description: "iOS source for steps, workouts, heart rate, sleep, and body metrics. No sync starts until metric consent is granted.",
    id: "apple-health",
    platform: "ios",
    title: "Apple Health",
  },
  {
    description: "Android source for health and fitness data through Health Connect. Permissions are metric-by-metric.",
    id: "health-connect",
    platform: "android",
    title: "Health Connect",
  },
];

export const deviceLibrary: DeviceProfile[] = [
  {
    brand: "Apple",
    connectionType: "apple_health",
    consentGranted: false,
    deviceType: "watch",
    id: "device-apple-watch",
    lastSyncAt: "Not connected",
    metricPermissions: { heartRate: false, steps: false, workouts: false },
    model: "Watch",
    priority: 1,
    supportedMetrics: ["Heart rate", "Steps", "Workouts", "Sleep"],
    supportedPlatforms: ["ios"],
    syncStatus: "needs_consent",
  },
  {
    brand: "Garmin",
    connectionType: "api",
    consentGranted: true,
    deviceType: "watch",
    id: "device-garmin",
    lastSyncAt: "Today 07:42",
    metricPermissions: { heartRate: true, steps: true, workouts: true },
    model: "Forerunner",
    priority: 2,
    reliabilityScore: 0.92,
    supportedMetrics: ["Heart rate", "Steps", "Workouts", "Recovery"],
    supportedPlatforms: ["ios", "android", "web"],
    syncStatus: "connected",
  },
  {
    brand: "Withings",
    connectionType: "ble",
    consentGranted: true,
    deviceType: "scale",
    id: "device-scale",
    lastSyncAt: "Yesterday 20:15",
    metricPermissions: { bodyFat: false, weight: true },
    model: "Body scale",
    priority: 1,
    supportedMetrics: ["Weight", "Body fat"],
    supportedPlatforms: ["ios", "android"],
    syncStatus: "stale",
  },
  {
    brand: "Bluetooth",
    connectionType: "ble",
    consentGranted: false,
    deviceType: "heart_rate_strap",
    id: "device-hr-strap",
    lastSyncAt: "Not paired",
    metricPermissions: { heartRate: false },
    model: "Heart rate strap",
    priority: 3,
    supportedMetrics: ["Heart rate"],
    supportedPlatforms: ["ios", "android"],
    syncStatus: "disconnected",
  },
  {
    brand: "Hidrate",
    connectionType: "ble",
    consentGranted: false,
    deviceType: "smart_water_bottle",
    id: "device-water",
    lastSyncAt: "Library only",
    metricPermissions: { hydration: false },
    model: "Smart water bottle",
    priority: 4,
    supportedMetrics: ["Hydration"],
    supportedPlatforms: ["ios", "android"],
    syncStatus: "needs_consent",
  },
];

export const supportedDeviceTypes = [
  "watch",
  "fitness band",
  "smart ring",
  "scale",
  "blood pressure monitor",
  "glucose meter",
  "thermometer",
  "pulse oximeter",
  "bike sensor",
  "heart rate strap",
  "sleep tracker",
  "smart water bottle",
];

export const metricPermissions: MetricPermission[] = [
  { enabled: true, id: "steps", label: "Steps", reason: "Used for activity summaries and trends." },
  { enabled: true, id: "heartRate", label: "Heart rate", reason: "Used for workouts and vitals charts." },
  { enabled: false, id: "sleep", label: "Sleep", reason: "Sensitive lifestyle data, off until consent." },
  { enabled: true, id: "weight", label: "Weight", reason: "Used for private trend charts." },
  { enabled: false, id: "glucose", label: "Glucose", reason: "Medical data requires explicit consent." },
  { enabled: false, id: "bloodPressure", label: "Blood pressure", reason: "Medical data requires explicit consent." },
  { enabled: false, id: "hydration", label: "Hydration", reason: "Can be imported from smart bottle or manual logs." },
];

export const sourcePriority: SyncSourcePriority[] = [
  { fallback: "Manual entry", metric: "Steps", primary: "Apple Health / Health Connect" },
  { fallback: "Watch", metric: "Heart rate", primary: "Garmin Forerunner" },
  { fallback: "Manual entry", metric: "Weight", primary: "Withings Body scale" },
  { fallback: "Manual entry", metric: "Hydration", primary: "Smart water bottle" },
];

export const troubleshootingItems = [
  "Confirm platform permissions are granted per metric.",
  "Check Bluetooth pairing and battery level.",
  "Resolve duplicate metrics through source priority.",
  "Use conflict resolution before overwriting health records.",
  "Write audit events for connect, permission change, sync, and disconnect.",
];
