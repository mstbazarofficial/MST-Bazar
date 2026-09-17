// lib/analytics/types.ts
// Shared shapes returned by the server action to every dashboard component.
// Keeping these in one file means the client components and the server
// action can never drift out of sync on field names.

export type RangeKey = "7d" | "30d" | "90d" | "custom";

export interface DateRange {
  key: RangeKey;
  startDate: string; // YYYY-MM-DD, inclusive
  endDate: string; // YYYY-MM-DD, inclusive
  /** Same-length period immediately before startDate, for % change */
  compareStartDate: string;
  compareEndDate: string;
}

export interface OverviewMetrics {
  users: number;
  newUsers: number;
  sessions: number;
  pageviews: number;
  engagementRate: number; // 0..1
  bounceRate: number; // 0..1
  avgEngagementTimeSec: number;
  // deltas vs. the previous equivalent period, e.g. 0.12 = +12%
  deltas: {
    users: number;
    newUsers: number;
    sessions: number;
    pageviews: number;
    engagementRate: number;
    bounceRate: number;
    avgEngagementTimeSec: number;
  };
}

export interface TrendPoint {
  date: string; // YYYY-MM-DD
  users: number;
  sessions: number;
  pageviews: number;
}

export interface TrafficSourceRow {
  channel: string; // "Organic Search", "Direct", "Referral", "Organic Social", ...
  users: number;
  sessions: number;
  share: number; // 0..1 of total sessions
}

export interface SearchQueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number; // 0..1
  position: number;
}

export interface SearchPageRow {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchPerformance {
  totals: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  };
  trend: { date: string; clicks: number; impressions: number }[];
  topQueries: SearchQueryRow[];
  topPages: SearchPageRow[];
}

export interface CityRow {
  city: string;
  users: number;
  sessions: number;
  share: number; // 0..1 of Bangladesh users
}

export interface DeviceRow {
  device: "mobile" | "desktop" | "tablet";
  users: number;
  sessions: number;
  share: number;
}

export interface CountryRow {
  country: string;
  users: number;
  sessions: number;
  share: number; // 0..1 of total users
}

export interface BrowserRow {
  browser: string;
  users: number;
  sessions: number;
  share: number;
}

export interface TopPageRow {
  path: string;
  title: string;
  pageviews: number;
  avgDurationSec: number;
}

export interface AnalyticsDashboardData {
  range: DateRange;
  overview: OverviewMetrics;
  trend: TrendPoint[];
  sources: TrafficSourceRow[];
  search: SearchPerformance;
  bangladeshCities: CityRow[];
  devices: DeviceRow[];
  countries: CountryRow[];
  browsers: BrowserRow[];
  topPages: TopPageRow[];
  fetchedAt: string; // ISO timestamp, for a "last updated" label
}
