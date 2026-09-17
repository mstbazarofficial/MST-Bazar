"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  getAnalyticsDashboard,
  refreshAnalyticsDashboard,
} from "@/lib/analytics/actions";
import type { AnalyticsDashboardData, RangeKey } from "@/lib/analytics/types";
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

function SectionSkeleton({ className = "h-80" }: { className?: string }) {
  return <Skeleton className={`w-full rounded-xl ${className}`} />;
}

export function AnalyticsDashboard({
  initialData,
}: {
  initialData: AnalyticsDashboardData;
}) {
  const [data, setData] = React.useState(initialData);
  const [rangeKey, setRangeKey] = React.useState<RangeKey>(
    initialData.range.key,
  );
  const [customRange, setCustomRange] = React.useState<
    { startDate: string; endDate: string } | undefined
  >(
    initialData.range.key === "custom"
      ? {
          startDate: initialData.range.startDate,
          endDate: initialData.range.endDate,
        }
      : undefined,
  );
  const [isPending, startTransition] = React.useTransition();

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
    startTransition(async () => {
      const next = await getAnalyticsDashboard(key, custom);
      setData(next);
    });
  }

  function handleRefresh() {
    startTransition(async () => {
      // Bypasses the cache (unlike loadRange) so this always pulls a
      // genuinely fresh read and the "updated" label actually moves.
      const next = await refreshAnalyticsDashboard(rangeKey, customRange);
      setData(next);
    });
  }

  return (
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
  );
}

export function AnalyticsDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Skeleton className="h-9 w-64 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SectionSkeleton key={i} className="h-26" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionSkeleton />
        </div>
        <SectionSkeleton />
      </div>
    </div>
  );
}
