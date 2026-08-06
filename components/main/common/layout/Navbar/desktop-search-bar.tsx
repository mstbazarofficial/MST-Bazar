"use client";

import { useProductSearch } from "@/hooks/use-product-search";
import { Search } from "lucide-react";
import { SearchResultsDropdown } from "./search-results-dropdown";

export function DesktopSearchBar() {
  const { query, setQuery, results, isOpen, setIsOpen, containerRef } =
    useProductSearch();

  return (
    <div
      ref={containerRef}
      className="relative hidden w-full max-w-xl sm:block"
    >
      <input
        type="search"
        placeholder="Search for products..."
        value={query}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        className="flex h-10 w-full rounded-md border-0 bg-muted px-5 pr-14 text-sm text-foreground shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary"
      />
      <button
        type="button"
        aria-label="Search"
        className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Search className="h-4 w-4" strokeWidth={2.5} />
      </button>
      {isOpen && (
        <SearchResultsDropdown
          onNavigate={() => setIsOpen(false)}
          query={query}
          searchResults={results}
        />
      )}
    </div>
  );
}
