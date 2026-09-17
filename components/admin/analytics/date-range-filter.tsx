"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { RangeKey } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import * as React from "react";
import type { DateRange as CalendarDateRange } from "react-day-picker";

const PRESETS: { key: Exclude<RangeKey, "custom">; label: string }[] = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
];

interface DateRangeFilterProps {
  value: RangeKey;
  customRange?: { startDate: string; endDate: string };
  onChange: (
    key: RangeKey,
    custom?: { startDate: string; endDate: string },
  ) => void;
  onRefresh: () => void;
  isPending: boolean;
  lastUpdatedLabel?: string;
}

export function DateRangeFilter({
  value,
  customRange,
  onChange,
  onRefresh,
  isPending,
  lastUpdatedLabel,
}: DateRangeFilterProps) {
  const [calendarValue, setCalendarValue] = React.useState<
    CalendarDateRange | undefined
  >(
    customRange
      ? {
          from: new Date(customRange.startDate),
          to: new Date(customRange.endDate),
        }
      : undefined,
  );
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  function applyCustomRange(range?: CalendarDateRange) {
    setCalendarValue(range);
    if (range?.from && range?.to) {
      onChange("custom", {
        startDate: range.from.toISOString().slice(0, 10),
        endDate: range.to.toISOString().slice(0, 10),
      });
      setPopoverOpen(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
        {PRESETS.map((preset) => (
          <button
            key={preset.key}
            onClick={() => onChange(preset.key)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              value === preset.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {preset.label}
          </button>
        ))}

        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger
            render={
              <button
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  value === "custom"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {value === "custom" && customRange
                  ? `${customRange.startDate} → ${customRange.endDate}`
                  : "Custom"}
              </button>
            }
          />

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={calendarValue}
              onSelect={applyCustomRange}
              numberOfMonths={2}
              disabled={{ after: new Date() }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-3">
        {lastUpdatedLabel && (
          <span className="text-xs text-muted-foreground">
            Updated {lastUpdatedLabel}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isPending}
          className="gap-1.5"
        >
          <RefreshCw
            className={cn("h-3.5 w-3.5", isPending && "animate-spin")}
          />
          Refresh
        </Button>
      </div>
    </div>
  );
}
