"use client";

import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import { getDhakaMonthOptions, getDhakaNow, toDhakaDay } from "@/lib/dhaka-time";
import type { FinancePeriodFilters } from "@/lib/finance-period";
import { useMemo } from "react";

const PERIOD_OPTIONS = [
  { value: "this-month", label: "This month" },
  { value: "last-month", label: "Last month" },
  { value: "month", label: "Choose a month" },
  { value: "year", label: "Year" },
  { value: "custom", label: "Custom dates" },
];

export function FinancePeriodFilter({
  filters,
}: {
  filters: FinancePeriodFilters;
}) {
  const updateParams = useUpdateSearchParams();
  const period = filters.period ?? "this-month";

  const monthOptions = useMemo(() => getDhakaMonthOptions(36), []);
  const yearOptions = useMemo(() => {
    const currentYear = getDhakaNow().getUTCFullYear();
    return Array.from({ length: 5 }, (_, i) => String(currentYear - i));
  }, []);

  function changePeriod(next: string) {
    const today = toDhakaDay(new Date());

    updateParams({
      period: next === "this-month" ? undefined : next,
      month: next === "month" ? monthOptions[0].value : undefined,
      year: next === "year" ? yearOptions[0] : undefined,
      from: next === "custom" ? today : undefined,
      to: next === "custom" ? today : undefined,
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <NativeSelect
        aria-label="Period"
        value={period}
        onChange={(e) => changePeriod(e.target.value)}
        className="sm:w-44"
      >
        {PERIOD_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>

      {period === "month" && (
        <NativeSelect
          aria-label="Month"
          value={filters.month}
          onChange={(e) => updateParams({ month: e.target.value })}
          className="sm:w-44"
        >
          {monthOptions.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </NativeSelect>
      )}

      {period === "year" && (
        <NativeSelect
          aria-label="Year"
          value={filters.year}
          onChange={(e) => updateParams({ year: e.target.value })}
          className="sm:w-32"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </NativeSelect>
      )}

      {period === "custom" && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            aria-label="From"
            value={filters.from ?? ""}
            max={filters.to}
            onChange={(e) => updateParams({ from: e.target.value })}
            className="sm:w-40"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="date"
            aria-label="To"
            value={filters.to ?? ""}
            min={filters.from}
            onChange={(e) => updateParams({ to: e.target.value })}
            className="sm:w-40"
          />
        </div>
      )}
    </div>
  );
}
