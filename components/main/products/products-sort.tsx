"use client";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
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
    <div className="mb-6 flex items-center justify-between gap-3 rounded-md border border-border/60 bg-card px-5 py-3 shadow-2xs">
      {/* Left: mobile filter trigger + sort */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="lg:hidden">
          <ProductsFilterMobile filters={filters} setFilters={setFilters} />
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <span className="hidden text-xs font-semibold whitespace-nowrap text-muted-foreground sm:inline">
            Sort by:
          </span>
          <NativeSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 cursor-pointer rounded-md border-border/70 text-xs font-bold focus:ring-1 focus:ring-primary lg:h-8"
          >
            <NativeSelectOption value="default">Default</NativeSelectOption>
            <NativeSelectOption value="popularity">
              Popularity
            </NativeSelectOption>
            <NativeSelectOption value="price-low">
              Price: Low to High
            </NativeSelectOption>
            <NativeSelectOption value="price-high">
              Price: High to Low
            </NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      {/* Right: grid/list toggle — desktop only, mobile has no list mode */}
      <div className="hidden items-center gap-1 rounded-md border border-border/40 bg-muted/50 p-1 lg:flex">
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
  );
}
