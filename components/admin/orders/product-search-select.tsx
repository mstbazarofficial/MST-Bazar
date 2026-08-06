// components/admin/orders/product-search-select.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type ProductSearchResult = {
  id: string;
  title: string;
  sku?: string | null;
  price: number;
  discountPercentage: number;
  image?: string | null;
  isAvailable: boolean;
};

interface ProductSearchSelectProps {
  /** Async search function (Server Action or API call) */
  onSearch: (query: string) => Promise<ProductSearchResult[]>;
  /** Callback fired when a product is selected */
  onSelect: (product: ProductSearchResult) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ProductSearchSelect({
  onSearch,
  onSelect,
  placeholder = "Search product by title or SKU...",
  disabled = false,
}: ProductSearchSelectProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle user input changes directly in the event handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (!val.trim()) {
      setResults([]);
      setIsLoading(false);
      setIsOpen(false);
    } else {
      setIsLoading(true);
      setIsOpen(true);
    }
  };

  // Clear input handler
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsLoading(false);
    setIsOpen(false);
  };

  // Debounced search effect (only performs the async fetch)
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const timer = setTimeout(async () => {
      try {
        const data = await onSearch(trimmedQuery);
        setResults(data);
      } catch (error) {
        console.error("Failed to search products:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleSelectProduct = (product: ProductSearchResult) => {
    onSelect(product);
    handleClear();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="h-10 pl-9 pr-8"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Floating Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md transition-all">
          {isLoading ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No products found matching &quot;{query}&quot;
            </div>
          ) : (
            results.map((product) => {
              const discountedPrice =
                product.discountPercentage > 0
                  ? product.price * (1 - product.discountPercentage / 100)
                  : product.price;

              return (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-sm p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-muted-foreground">
                          <Package className="size-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="truncate font-medium text-foreground">
                        {product.title}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {product.sku && <span>SKU: {product.sku}</span>}
                        {!product.isAvailable && (
                          <Badge
                            variant="secondary"
                            className="px-1 py-0 text-[10px]"
                          >
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Price */}
                  <div className="shrink-0 text-right">
                    <div className="font-medium text-foreground">
                      ৳ {Math.round(discountedPrice).toLocaleString()}
                    </div>
                    {product.discountPercentage > 0 && (
                      <div className="text-xs text-muted-foreground line-through">
                        ৳ {Math.round(product.price).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
