"use client";

import { LayoutGrid, List } from "lucide-react";
import ProductsFilterMobile from "./products-filter-mobile";
import { FilterState } from "./products-page-client";

interface ProductsSortProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  sortBy: string;
  setSortBy: (val: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export default function ProductsSort({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
}: ProductsSortProps) {
  return (
    <div className="mb-6 mt-2 md:mt-0 flex items-center justify-between gap-3 rounded-md border border-border/60 bg-card px-2 md:px-4 py-2 md:py-3 shadow-2xs">
      <div className="lg:hidden">
        <ProductsFilterMobile filters={filters} setFilters={setFilters} />
      </div>

      <div className="flex items-center gap-2 md:justify-between md:w-full md:gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="hidden text-xs font-semibold whitespace-nowrap text-muted-foreground sm:inline">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 w-full min-w-0 cursor-pointer rounded-md border border-border/70 bg-card px-2 text-[11px] font-bold text-foreground outline-none focus:ring-1 focus:ring-primary sm:text-xs"
          >
            <option value="default">Default</option>
            <option value="popularity">Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
        <div className="items-center gap-1 rounded-md border border-border/40 bg-muted/50 p-1 lg:flex">
          <button
            onClick={() => setViewMode("grid")}
            className={`cursor-pointer rounded-md p-1.5 transition-all ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`cursor-pointer rounded-md p-1.5 transition-all ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="List View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
