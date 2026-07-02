import type { PrivacyLabelKey, RealmColorKey } from "@/theme";

export type ScanMode = {
  description: string;
  id: string;
  label: string;
  realm: RealmColorKey;
};

export type ScanResultPreview = {
  caution?: string;
  confidence: string;
  id: string;
  modeLabel: string;
  primaryAction: string;
  privacy: PrivacyLabelKey;
  realm: RealmColorKey;
  summary: string;
  title: string;
};

export const scanModes: ScanMode[] = [
  { id: "barcode", label: "Barcode", description: "Product barcode and package lookup placeholder.", realm: "nutrition" },
  { id: "ingredients", label: "Ingredients", description: "Ingredients and allergen terms for review.", realm: "nutrition" },
  { id: "nutrition", label: "Nutrition table", description: "Calories, macros, serving size, and source fields.", realm: "nutrition" },
  { id: "medication", label: "Medication package", description: "Medication name and reminder draft with pharmacist caution.", realm: "medication" },
  { id: "document", label: "Document", description: "Doctor note, prescription, test result, or school form.", realm: "documents" },
  { id: "food", label: "Food plate", description: "Meal estimate draft that must be reviewed before saving.", realm: "nutrition" },
  { id: "vitals", label: "Vitals screen", description: "Blood pressure, heart rate, glucose, or thermometer screen.", realm: "vitals" },
  { id: "baby", label: "Baby product", description: "Baby product, feeding label, or child care form.", realm: "baby" },
];

export const scanResultStates: ScanResultPreview[] = [
  {
    confidence: "High",
    id: "barcode-detected",
    modeLabel: "Barcode detected",
    primaryAction: "Review result",
    privacy: "private",
    realm: "nutrition",
    summary: "Product name and nutrition label placeholder found. Confirm serving size before saving.",
    title: "Protein yoghurt",
  },
  {
    caution: "Possible concern found. Please confirm with a healthcare professional or pharmacist.",
    confidence: "Medium",
    id: "medication-detected",
    modeLabel: "Medication package",
    primaryAction: "Review medicine",
    privacy: "private",
    realm: "medication",
    summary: "Medication name, dose text, and expiry date were detected as a draft.",
    title: "Medication draft",
  },
  {
    confidence: "Medium",
    id: "document-detected",
    modeLabel: "Document",
    primaryAction: "Review document",
    privacy: "private",
    realm: "documents",
    summary: "Doctor note text extracted as a private draft. Attach to person only after review.",
    title: "Doctor note",
  },
];

export const scanHistoryPreview: ScanResultPreview[] = [
  {
    confidence: "Reviewed",
    id: "history-1",
    modeLabel: "Food label",
    primaryAction: "Open",
    privacy: "private",
    realm: "nutrition",
    summary: "Saved privately to meal notes after manual review.",
    title: "Cereal label",
  },
  {
    confidence: "Reviewed",
    id: "history-2",
    modeLabel: "School form",
    primaryAction: "Open",
    privacy: "private",
    realm: "documents",
    summary: "Stored privately. Not shared with school or caregiver yet.",
    title: "School medical form",
  },
];
