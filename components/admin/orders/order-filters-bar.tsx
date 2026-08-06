// src/components/admin/orders/order-filters-bar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { OrderStatus } from "@/generated/prisma/enums";
import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export interface OrderFilters {
  search?: string;
  status?: string;
  month?: string; // e.g. "2026-06"
}

// Generates an array of past months (e.g., "June 2026")
// Generates an array of past months (e.g., "June 2026")
function getMonthOptions(monthsToGenerate = 12) {
  const options = [];
  const now = new Date();

  for (let i = 0; i < monthsToGenerate; i++) {
    // Setting day to 1 avoids end-of-month overflow bugs (e.g. Feb 31 -> Mar 3)
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthIndex = d.getMonth();
    const year = d.getFullYear();

    // Value format: YYYY-MM
    const value = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    // Label format: Month YYYY (e.g., "June 2026")
    const label = d.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    options.push({ label, value });
  }

  return options;
}
export function OrderFiltersBar({
  filters,
  onChange,
}: {
  filters: OrderFilters;
  onChange: (updates: Record<string, string | undefined | null>) => void;
}) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [prevSearchFilter, setPrevSearchFilter] = useState(
    filters.search || "",
  );

  // Generate date options once on mount
  const monthOptions = useMemo(() => getMonthOptions(12), []);

  // Dynamically create options from Prisma's enum
  const statusOptions = useMemo(() => {
    return Object.values(OrderStatus).map((status) => ({
      value: status,
      label:
        status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " "), // e.g., PENDING -> Pending
    }));
  }, []);

  // Sync state during rendering when props change
  if (filters.search !== prevSearchFilter) {
    setPrevSearchFilter(filters.search || "");
    setSearchInput(filters.search || "");
  }

  // Debounce effect for text search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (filters.search || "")) {
        onChange({ search: searchInput || undefined });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onChange]);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      {/* Search Input */}
      <div className="relative w-full lg:flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by Order #, customer name, email, or phone..."
          className="h-10 w-full pl-9"
        />
      </div>

      {/* Selects Wrapper */}
      <div className="flex w-full gap-3 sm:w-auto">
        {/* Order Status Native Select */}
        <div className="relative w-1/2 sm:w-44">
          <select
            value={filters.status || "all"}
            onChange={(e) => {
              const value = e.target.value;
              onChange({ status: value === "all" ? undefined : value });
            }}
            className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-50" />
        </div>

        {/* Month Filter Native Select */}
        <div className="relative w-1/2 sm:w-44">
          <select
            value={filters.month || "all"}
            onChange={(e) => {
              const value = e.target.value;
              onChange({ month: value === "all" ? undefined : value });
            }}
            className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 truncate"
          >
            <option value="all">All Time</option>
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-50" />
        </div>
      </div>
    </div>
  );
}
