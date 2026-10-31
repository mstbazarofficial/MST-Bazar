import {
  getDhakaDayRange,
  getDhakaMonthRange,
  getDhakaNow,
} from "@/lib/dhaka-time";

export interface FinancePeriodFilters {
  period?: string; // "this-month", "last-month", "month", "year" or "custom"
  month?: string; // "YYYY-MM", for the "month" period
  year?: string; // "YYYY", for the "year" period
  from?: string; // "YYYY-MM-DD", for the "custom" period
  to?: string; // "YYYY-MM-DD", for the "custom" period
}

function isValidDay(day?: string): day is string {
  return (
    !!day && /^\d{4}-\d{2}-\d{2}$/.test(day) && !Number.isNaN(Date.parse(day))
  );
}

/** A "YYYY-MM" value `monthsAgo` months before the current Dhaka month. */
function getMonthValue(monthsAgo: number) {
  const now = getDhakaNow();

  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, 1),
  )
    .toISOString()
    .slice(0, 7);
}

/** The instants a period covers. Incomplete filters fall back to this month. */
export function resolveFinancePeriod(filters: FinancePeriodFilters) {
  if (filters.period === "last-month") {
    return getDhakaMonthRange(getMonthValue(1))!;
  }

  if (filters.period === "month") {
    const range = getDhakaMonthRange(filters.month);
    if (range) return range;
  }

  if (filters.period === "year" && /^\d{4}$/.test(filters.year ?? "")) {
    return {
      gte: getDhakaMonthRange(`${filters.year}-01`)!.gte,
      lt: getDhakaMonthRange(`${filters.year}-12`)!.lt,
    };
  }

  if (
    filters.period === "custom" &&
    isValidDay(filters.from) &&
    isValidDay(filters.to) &&
    filters.from <= filters.to
  ) {
    return {
      gte: getDhakaDayRange(filters.from).gte,
      lt: getDhakaDayRange(filters.to).lt,
    };
  }

  return getDhakaMonthRange(getMonthValue(0))!;
}
