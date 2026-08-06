"use client";

import type { ProductAvailabilityFilter } from "@/actions/admin/product-actions";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import { useEffect, useState } from "react";

type Category = { id: string; name: string; slug: string };

export function ProductFiltersBar({
  categories,
  filters,
  onChange,
}: {
  categories: Category[];
  filters: {
    search: string;
    categorySlug: string;
    availability: ProductAvailabilityFilter;
  };
  onChange: (updates: Record<string, string | undefined | null>) => void;
}) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const [prevSearchFilter, setPrevSearchFilter] = useState(filters.search);

  // Sync state during rendering to avoid cascading render warnings
  if (filters.search !== prevSearchFilter) {
    setPrevSearchFilter(filters.search);
    setSearchInput(filters.search);
  }

  // Debounce effect for text search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onChange({ search: searchInput || undefined });
      }
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search Input - Full width on mobile, expands on desktop */}
      <div className="relative w-full sm:flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title or SKU..."
          className="pl-9 h-10 w-full"
        />
      </div>

      {/* Selects Wrapper - Side by side on mobile, auto-width on desktop */}
      <div className="flex w-full gap-3 sm:w-auto">
        {/* Category Native Select */}
        <div className="relative w-1/2 sm:w-48">
          <select
            value={filters.categorySlug || "all"}
            onChange={(e) => {
              const value = e.target.value;
              onChange({ slug: value === "all" ? undefined : value });
            }}
            className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm shadow-sm ring-offset-background transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 truncate"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-50" />
        </div>

        {/* Availability Native Select */}
        <div className="relative w-1/2 sm:w-44">
          <select
            value={filters.availability || "all"}
            onChange={(e) => {
              const value = e.target.value;
              onChange({ availability: value === "all" ? undefined : value });
            }}
            className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm shadow-sm ring-offset-background transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All statuses</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-50" />
        </div>
      </div>
    </div>
  );
}
