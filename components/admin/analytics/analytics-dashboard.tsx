"use client";

import { PageHeader } from "@/components/admin/layout/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminFetch } from "@/lib/admin-fetch";
import type { RangeKey } from "@/lib/analytics/types";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as React from "react";
import { BangladeshCitiesCard } from "./bangladesh-cities-card";
import { BrowserBreakdownCard } from "./browser-breakdown-card";
import { CountryBreakdownCard } from "./country-breakdown-card";
import { DateRangeFilter } from "./date-range-filter";
import { DeviceBreakdownCard } from "./device-breakdown-card";
import { OverviewCards } from "./overview-cards";
import { SearchPerformanceCard } from "./search-performance-card";
import { TopPagesCard } from "./top-pages-card";
import { TrafficSourcesCard } from "./traffic-sources-card";
import { TrafficTrendChart } from "./traffic-trend-chart";

function timeAgo(iso: string): string {
  const seconds = Math.max(
    0,
    Math.round((Date.now() - new Date(iso).getTime()) / 1000),
  );
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}

// Bars need a card behind them: bg-muted is nearly the same shade as the
// page background, so a bare Skeleton on the page is invisible.
function SectionSkeleton({ className = "h-64" }: { className?: string }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56 max-w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className={`w-full ${className}`} />
      </CardContent>
    </Card>
  );
}

function StatSkeleton() {
  return (
    <Card className="flex flex-col gap-2.5 rounded-xl border border-border/50 bg-card p-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-6.5 w-24" />
      <Skeleton className="h-0.75 w-full rounded-full" />
    </Card>
  );
}

export function AnalyticsDashboard() {
  const queryClient = useQueryClient();
  const [rangeKey, setRangeKey] = React.useState<RangeKey>("30d");
  const [customRange, setCustomRange] = React.useState<
    { startDate: string; endDate: string } | undefined
  >();
  const [isRefreshing, startTransition] = React.useTransition();

  const custom = rangeKey === "custom" ? customRange : undefined;
  const queryKey = ["admin-analytics", rangeKey, custom];

  const { data, isFetching } = useQuery({
    queryKey,
    queryFn: () => adminFetch("analytics", { range: rangeKey, ...custom }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60_000,
  });
  const isPending = isFetching || isRefreshing;

  // The "updated Xm ago" label is derived from data.fetchedAt, which
  // only changes when new data arrives — but the *label itself* needs
  // to keep counting up in between. This tick forces a re-render every
  // 30s purely so timeAgo() gets recomputed against the current clock.
  const [, forceTick] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => {
    const id = setInterval(forceTick, 30_000);
    return () => clearInterval(id);
  }, []);

  function loadRange(
    key: RangeKey,
    custom?: { startDate: string; endDate: string },
  ) {
    setRangeKey(key);
    if (custom) setCustomRange(custom);
  }

  function handleRefresh() {
    startTransition(async () => {
      // Bypasses the cache (unlike loadRange) so this always pulls a
      // genuinely fresh read and the "updated" label actually moves.
      const next = await adminFetch("analytics", {
        range: rangeKey,
        ...custom,
        refresh: 1,
      });
      queryClient.setQueryData(queryKey, next);
    });
  }

  if (!data) {
    return (
      <>
        <PageHeader title="Analytics" />
        <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
          <AnalyticsDashboardSkeleton />
        </main>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Analytics" />
      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <div className="space-y-6">
          <DateRangeFilter
            value={rangeKey}
            customRange={customRange}
            onChange={loadRange}
            onRefresh={handleRefresh}
            isPending={isPending}
            lastUpdatedLabel={timeAgo(data.fetchedAt)}
          />

          <div
            className={
              isPending ? "opacity-60 transition-opacity" : "transition-opacity"
            }
          >
            <OverviewCards data={data.overview} />

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <TrafficTrendChart data={data.trend} />
                <SearchPerformanceCard data={data.search} />
                <TopPagesCard data={data.topPages} />
              </div>
              <div className=" space-y-6">
                <TrafficSourcesCard data={data.sources} />
                <BangladeshCitiesCard data={data.bangladeshCities} />
                <DeviceBreakdownCard data={data.devices} />
                <CountryBreakdownCard data={data.countries} />
                <BrowserBreakdownCard data={data.browsers} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export function AnalyticsDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <SectionSkeleton className="h-72" />
            <SectionSkeleton />
          </div>
          <div className="space-y-6">
            <SectionSkeleton className="h-40" />
            <SectionSkeleton className="h-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
