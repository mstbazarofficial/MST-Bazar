// lib/analytics/chart-colors.ts
// One small, deliberate palette reused across every chart so the page
// reads as one system rather than each card picking its own colors.
// Swap these to match Edugen's brand marks if they differ.
export const CHART_COLORS = {
  primary: "#0E7C6B", // deep emerald — users / primary series
  secondary: "#2F6FED", // clear blue — sessions / secondary series
  tertiary: "#D9A441", // warm gold — pageviews / tertiary series
  muted: "#94A3A8", // slate — comparison / previous period
  positive: "#0E7C6B",
  negative: "#C4483A",
} as const;

export const CHANNEL_COLORS: Record<string, string> = {
  "Organic Search": "#0E7C6B",
  Direct: "#2F6FED",
  Referral: "#D9A441",
  "Organic Social": "#8A5FBF",
  "Paid Search": "#C4483A",
  Email: "#2AA9A0",
  Display: "#B08968",
  Other: "#94A3A8",
};

export const DEVICE_COLORS: Record<string, string> = {
  mobile: "#0E7C6B",
  desktop: "#2F6FED",
  tablet: "#D9A441",
};
