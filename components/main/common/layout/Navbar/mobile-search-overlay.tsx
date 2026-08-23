"use client";

import { useProductSearch } from "@/hooks/use-product-search";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { SearchResultsDropdown } from "./search-results-dropdown";

interface MobileSearchOverlayProps {
  onClose: () => void;
}

export function MobileSearchOverlay({ onClose }: MobileSearchOverlayProps) {
  const { query, setQuery, results, isOpen, setIsOpen, containerRef } =
    useProductSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsOpen(true);
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigate = () => {
    setIsOpen(false);
    onClose(); // Closes the mobile overlay on product click
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 flex items-center bg-background px-4 sm:hidden"
    >
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="search"
          placeholder="Search for products..."
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          className="flex h-10 w-full rounded-md border-0 bg-muted px-5 pr-12 text-sm text-foreground shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary [&::-webkit-search-cancel-button]:appearance-none"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted-foreground/10 hover:text-foreground"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        {isOpen && (
          <SearchResultsDropdown
            onNavigate={handleNavigate}
            query={query}
            searchResults={results}
          />
        )}
      </div>
    </div>
  );
}
