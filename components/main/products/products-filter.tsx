"use client";

import FilterContent from "./products-filter-content";
import { FilterState } from "./products-page-client";

interface ProductsFilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export default function ProductsFilter({
  filters,
  setFilters,
}: ProductsFilterProps) {
  return (
    // Stretched to the row's full height (grid height) by the parent's
    // default align-items: stretch, then `justify-end` pushes the card
    // to the bottom of that tall box in normal flow.
    <div className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:justify-end">
      <div className="rounded-md border border-border/70 bg-card p-5 shadow-2xs lg:sticky lg:bottom-6">
        <FilterContent filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
}
