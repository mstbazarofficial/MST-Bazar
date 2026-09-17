// lib/analytics/date-range.ts

import { DateRange, RangeKey } from "./types";

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

/**
 * Resolves a filter key (or an explicit custom range) into concrete
 * start/end dates plus a same-length "previous period" for delta %s.
 * GA4 and Search Console both accept plain YYYY-MM-DD strings, so this
 * is the single source of truth every fetcher and component reads from.
 */
export function resolveDateRange(
  key: RangeKey,
  custom?: { startDate: string; endDate: string },
): DateRange {
  if (key === "custom" && custom) {
    const start = new Date(custom.startDate);
    const end = new Date(custom.endDate);
    const spanDays = Math.max(
      1,
      Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1,
    );
    const compareEnd = new Date(start);
    compareEnd.setUTCDate(compareEnd.getUTCDate() - 1);
    const compareStart = new Date(compareEnd);
    compareStart.setUTCDate(compareStart.getUTCDate() - spanDays + 1);

    return {
      key,
      startDate: custom.startDate,
      endDate: custom.endDate,
      compareStartDate: fmt(compareStart),
      compareEndDate: fmt(compareEnd),
    };
  }

  const spanByKey: Record<Exclude<RangeKey, "custom">, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  };
  const span = spanByKey[key as Exclude<RangeKey, "custom">] ?? 30;

  const end = daysAgo(1); // GA4 data for "today" is incomplete, so end yesterday
  const start = daysAgo(span);
  const compareEnd = daysAgo(span + 1);
  const compareStart = daysAgo(span * 2);

  return {
    key,
    startDate: fmt(start),
    endDate: fmt(end),
    compareStartDate: fmt(compareStart),
    compareEndDate: fmt(compareEnd),
  };
}

export function percentChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 1;
  return (current - previous) / previous;
}
