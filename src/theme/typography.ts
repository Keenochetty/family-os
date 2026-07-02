export const typography = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: "700" },
  hero: { fontSize: 34, lineHeight: 40, fontWeight: "700" },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: "700" },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: "700" },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: "600" },
  section: { fontSize: 18, lineHeight: 24, fontWeight: "600" },
  body: { fontSize: 16, lineHeight: 22, fontWeight: "400" },
  bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: "600" },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" },
  tinyLabel: { fontSize: 11, lineHeight: 14, fontWeight: "600" },
  label: { fontSize: 12, lineHeight: 16, fontWeight: "600" },
} as const;

export type TypographyToken = keyof typeof typography;
