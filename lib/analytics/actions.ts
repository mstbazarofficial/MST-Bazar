"use server";

import { unstable_cache, updateTag } from "next/cache";
import {
  GA4_PROPERTY_ID,
  getGa4Client,
  getSearchConsoleClient,
  GSC_SITE_URL,
} from "./clients";
import { percentChange, resolveDateRange } from "./date-range";
import type {
  AnalyticsDashboardData,
  BrowserRow,
  CityRow,
  CountryRow,
  DateRange,
  DeviceRow,
  OverviewMetrics,
  RangeKey,
  SearchPerformance,
  TopPageRow,
  TrafficSourceRow,
  TrendPoint,
} from "./types";

// ---------------------------------------------------------------------
// GA4: one runReport call fetches BOTH the current and comparison
// period at once (GA4 supports multiple dateRanges per request), which
// halves the number of round trips versus fetching them separately.
// ---------------------------------------------------------------------
async function fetchOverview(range: DateRange): Promise<OverviewMetrics> {
  const client = getGa4Client();
  const [response] = await client.runReport({
    property: GA4_PROPERTY_ID,
    dateRanges: [
      { startDate: range.startDate, endDate: range.endDate, name: "current" },
      {
        startDate: range.compareStartDate,
        endDate: range.compareEndDate,
        name: "previous",
      },
    ],
    metrics: [
      { name: "totalUsers" },
      { name: "newUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "engagementRate" },
      { name: "averageSessionDuration" },
      { name: "bounceRate" },
    ],
  });

  const byPeriod: Record<string, number[]> = {};
  for (const row of response.rows ?? []) {
    const period = row.dimensionValues?.[0]?.value ?? "current";
    byPeriod[period] = (row.metricValues ?? []).map((m) =>
      Number(m.value ?? 0),
    );
  }
  const cur = byPeriod["current"] ?? [0, 0, 0, 0, 0, 0, 0];
  const prev = byPeriod["previous"] ?? [0, 0, 0, 0, 0, 0, 0];

  const metrics: OverviewMetrics = {
    users: cur[0],
    newUsers: cur[1],
    sessions: cur[2],
    pageviews: cur[3],
    engagementRate: cur[4],
    avgEngagementTimeSec: cur[5],
    bounceRate: cur[6],
    deltas: {
      users: percentChange(cur[0], prev[0]),
      newUsers: percentChange(cur[1], prev[1]),
      sessions: percentChange(cur[2], prev[2]),
      pageviews: percentChange(cur[3], prev[3]),
      engagementRate: percentChange(cur[4], prev[4]),
      avgEngagementTimeSec: percentChange(cur[5], prev[5]),
      bounceRate: percentChange(cur[6], prev[6]),
    },
  };
  return metrics;
}

async function fetchTrend(range: DateRange): Promise<TrendPoint[]> {
  const client = getGa4Client();
  const [response] = await client.runReport({
    property: GA4_PROPERTY_ID,
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: "date" }],
    metrics: [
      { name: "totalUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
    ],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });

  return (response.rows ?? []).map((row) => {
    const raw = row.dimensionValues?.[0]?.value ?? ""; // YYYYMMDD
    const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
    const [users, sessions, pageviews] = (row.metricValues ?? []).map((m) =>
      Number(m.value ?? 0),
    );
    return { date, users, sessions, pageviews };
  });
}

const CHANNEL_LABELS: Record<string, string> = {
  "Organic Search": "Organic Search",
  Direct: "Direct",
  Referral: "Referral",
  "Organic Social": "Organic Social",
  "Paid Search": "Paid Search",
  Email: "Email",
  Display: "Display",
  Unassigned: "Other",
};

async function fetchSources(range: DateRange): Promise<TrafficSourceRow[]> {
  const client = getGa4Client();
  const [response] = await client.runReport({
    property: GA4_PROPERTY_ID,
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "totalUsers" }, { name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });

  const rows = response.rows ?? [];
  const totalSessions = rows.reduce(
    (sum, r) => sum + Number(r.metricValues?.[1]?.value ?? 0),
    0,
  );

  return rows.map((row) => {
    const channel = row.dimensionValues?.[0]?.value ?? "Other";
    const users = Number(row.metricValues?.[0]?.value ?? 0);
    const sessions = Number(row.metricValues?.[1]?.value ?? 0);
    return {
      channel: CHANNEL_LABELS[channel] ?? channel,
      users,
      sessions,
      share: totalSessions ? sessions / totalSessions : 0,
    };
  });
}

async function fetchDevices(range: DateRange): Promise<DeviceRow[]> {
  const client = getGa4Client();
  const [response] = await client.runReport({
    property: GA4_PROPERTY_ID,
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "totalUsers" }, { name: "sessions" }],
  });

  const rows = response.rows ?? [];
  const totalUsers = rows.reduce(
    (sum, r) => sum + Number(r.metricValues?.[0]?.value ?? 0),
    0,
  );

  return rows.map((row) => {
    const device = (row.dimensionValues?.[0]?.value ?? "desktop").toLowerCase();
    const users = Number(row.metricValues?.[0]?.value ?? 0);
    const sessions = Number(row.metricValues?.[1]?.value ?? 0);
    return {
      device: (["mobile", "desktop", "tablet"].includes(device)
        ? device
        : "desktop") as DeviceRow["device"],
      users,
      sessions,
      share: totalUsers ? users / totalUsers : 0,
    };
  });
}

async function fetchBangladeshCities(range: DateRange): Promise<CityRow[]> {
  const client = getGa4Client();
  const [response] = await client.runReport({
    property: GA4_PROPERTY_ID,
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: "city" }],
    metrics: [{ name: "totalUsers" }, { name: "sessions" }],
    dimensionFilter: {
      filter: {
        fieldName: "country",
        stringFilter: { matchType: "EXACT", value: "Bangladesh" },
      },
    },
    orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
    limit: 12,
  });

  const rows = (response.rows ?? []).filter(
    (r) => r.dimensionValues?.[0]?.value !== "(not set)",
  );
  const totalUsers = rows.reduce(
    (sum, r) => sum + Number(r.metricValues?.[0]?.value ?? 0),
    0,
  );

  return rows.map((row) => {
    const city = row.dimensionValues?.[0]?.value ?? "Unknown";
    const users = Number(row.metricValues?.[0]?.value ?? 0);
    const sessions = Number(row.metricValues?.[1]?.value ?? 0);
    return {
      city,
      users,
      sessions,
      share: totalUsers ? users / totalUsers : 0,
    };
  });
}

async function fetchCountries(range: DateRange): Promise<CountryRow[]> {
  const client = getGa4Client();
  const [response] = await client.runReport({
    property: GA4_PROPERTY_ID,
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: "country" }],
    metrics: [{ name: "totalUsers" }, { name: "sessions" }],
    orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
    limit: 8,
  });

  const rows = (response.rows ?? []).filter(
    (r) => r.dimensionValues?.[0]?.value !== "(not set)",
  );
  const totalUsers = rows.reduce(
    (sum, r) => sum + Number(r.metricValues?.[0]?.value ?? 0),
    0,
  );

  return rows.map((row) => {
    const country = row.dimensionValues?.[0]?.value ?? "Unknown";
    const users = Number(row.metricValues?.[0]?.value ?? 0);
    const sessions = Number(row.metricValues?.[1]?.value ?? 0);
    return {
      country,
      users,
      sessions,
      share: totalUsers ? users / totalUsers : 0,
    };
  });
}

async function fetchBrowsers(range: DateRange): Promise<BrowserRow[]> {
  const client = getGa4Client();
  const [response] = await client.runReport({
    property: GA4_PROPERTY_ID,
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: "browser" }],
    metrics: [{ name: "totalUsers" }, { name: "sessions" }],
    orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
    limit: 8,
  });

  const rows = response.rows ?? [];
  const totalUsers = rows.reduce(
    (sum, r) => sum + Number(r.metricValues?.[0]?.value ?? 0),
    0,
  );

  return rows.map((row) => {
    const browser = row.dimensionValues?.[0]?.value ?? "Unknown";
    const users = Number(row.metricValues?.[0]?.value ?? 0);
    const sessions = Number(row.metricValues?.[1]?.value ?? 0);
    return {
      browser,
      users,
      sessions,
      share: totalUsers ? users / totalUsers : 0,
    };
  });
}

async function fetchTopPagesContent(range: DateRange): Promise<TopPageRow[]> {
  const client = getGa4Client();
  const [response] = await client.runReport({
    property: GA4_PROPERTY_ID,
    dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
    dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
    metrics: [{ name: "screenPageViews" }, { name: "userEngagementDuration" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 10,
  });

  return (response.rows ?? []).map((row) => {
    const path = row.dimensionValues?.[0]?.value ?? "/";
    const title = row.dimensionValues?.[1]?.value ?? "";
    const pageviews = Number(row.metricValues?.[0]?.value ?? 0);
    const engagementDuration = Number(row.metricValues?.[1]?.value ?? 0);
    return {
      path,
      title,
      pageviews,
      // Total engaged time on the page divided by its views — a practical
      // stand-in for "time on page" (GA4 has no direct per-page metric).
      avgDurationSec: pageviews ? engagementDuration / pageviews : 0,
    };
  });
}

// ---------------------------------------------------------------------
// Search Console: totals+trend, top queries, and top pages are 3
// independent queries against the same searchAnalytics.query endpoint,
// so they're fired together with Promise.all rather than sequentially.
// ---------------------------------------------------------------------
async function fetchSearchPerformance(
  range: DateRange,
): Promise<SearchPerformance> {
  const searchconsole = getSearchConsoleClient();
  const siteUrl = GSC_SITE_URL;

  const [trendRes, queriesRes, pagesRes] = await Promise.all([
    searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: range.startDate,
        endDate: range.endDate,
        dimensions: ["date"],
      },
    }),

    searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: range.startDate,
        endDate: range.endDate,
        dimensions: ["query"],
        rowLimit: 15,
      },
    }),

    searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: range.startDate,
        endDate: range.endDate,
        dimensions: ["page"],
        rowLimit: 15,
      },
    }),
  ]);

  const trendRows = trendRes.data.rows ?? [];

  const trend = trendRows.map((r) => ({
    date: r.keys?.[0] ?? "",
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
  }));

  const totals = trendRows.reduce<{
    clicks: number;
    impressions: number;
    positionWeighted: number;
  }>(
    (acc, r) => {
      const clicks = r.clicks ?? 0;
      const impressions = r.impressions ?? 0;
      const position = r.position ?? 0;

      acc.clicks += clicks;
      acc.impressions += impressions;
      acc.positionWeighted += position * impressions;

      return acc;
    },
    {
      clicks: 0,
      impressions: 0,
      positionWeighted: 0,
    },
  );

  const topQueries = (queriesRes.data.rows ?? []).map((r) => ({
    query: r.keys?.[0] ?? "",
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: r.ctr ?? 0,
    position: r.position ?? 0,
  }));

  const topPages = (pagesRes.data.rows ?? []).map((r) => ({
    page: r.keys?.[0] ?? "",
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: r.ctr ?? 0,
    position: r.position ?? 0,
  }));

  return {
    totals: {
      clicks: totals.clicks,
      impressions: totals.impressions,
      ctr: totals.impressions ? totals.clicks / totals.impressions : 0,
      position: totals.impressions
        ? totals.positionWeighted / totals.impressions
        : 0,
    },
    trend,
    topQueries,
    topPages,
  };
}

// ---------------------------------------------------------------------
// Public server action. Every dashboard component gets its data from
// this single call so the page issues one round trip to the server;
// internally it fans out to GA4 + GSC in parallel via Promise.all.
// Wrapped in unstable_cache keyed by the resolved date range so
// switching between 7d/30d/90d — or clicking back to a range you
// already viewed — is served from cache instead of re-hitting the
// Google APIs, which are the slow part of this page.
// ---------------------------------------------------------------------
export async function getAnalyticsDashboard(
  rangeKey: RangeKey,
  custom?: { startDate: string; endDate: string },
): Promise<AnalyticsDashboardData> {
  const range = resolveDateRange(rangeKey, custom);

  const cached = unstable_cache(
    async () => {
      const [
        overview,
        trend,
        sources,
        devices,
        bangladeshCities,
        countries,
        browsers,
        topPages,
        search,
      ] = await Promise.all([
        fetchOverview(range),
        fetchTrend(range),
        fetchSources(range),
        fetchDevices(range),
        fetchBangladeshCities(range),
        fetchCountries(range),
        fetchBrowsers(range),
        fetchTopPagesContent(range),
        fetchSearchPerformance(range),
      ]);

      const data: AnalyticsDashboardData = {
        range,
        overview,
        trend,
        sources,
        search,
        bangladeshCities,
        devices,
        countries,
        browsers,
        topPages,
        fetchedAt: new Date().toISOString(),
      };
      return data;
    },
    [
      "analytics-dashboard",
      range.startDate,
      range.endDate,
      range.compareStartDate,
      range.compareEndDate,
    ],
    { revalidate: 3600, tags: ["analytics-dashboard"] }, // GA4/GSC data itself lags ~24-48h, hourly cache is plenty fresh
  );

  return cached();
}

// ---------------------------------------------------------------------
// The refresh button needs to bypass the hour-long cache above —
// otherwise clicking it just re-reads the same cached entry and the
// "updated Xm ago" label never moves. This clears every cached entry
// tagged "analytics-dashboard" (all date ranges) and then fetches, so
// the very next read for ANY range is guaranteed fresh, not just the
// one currently on screen.
// ---------------------------------------------------------------------
export async function refreshAnalyticsDashboard(
  rangeKey: RangeKey,
  custom?: { startDate: string; endDate: string },
): Promise<AnalyticsDashboardData> {
  updateTag("analytics-dashboard");
  return getAnalyticsDashboard(rangeKey, custom);
}
