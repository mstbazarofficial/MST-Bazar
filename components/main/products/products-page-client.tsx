"use client";

import { ProductDTO } from "@/lib/data/catalog";
import { useMemo, useState } from "react";
import { ProductCard } from "../common/card/product-card";
import ProductsFilter from "./products-filter";
import ProductsSort from "./products-sort";
export type FilterState = {
  priceRange: [number, number];
  discounts: string[];
};
export function ProductsPageClient({ products }: { products: ProductDTO[] }) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [50, 2500],
    discounts: [],
  });
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const visibleProducts = useMemo(() => {
    let list = products.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
    );

    if (filters.discounts.length > 0) {
      list = list.filter((p) =>
        filters.discounts.some(
          (d) => (p.discountPercentage ?? 0) >= parseInt(d, 10),
        ),
      );
    }

    if (sortBy === "price-low")
      list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high")
      list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "popularity")
      list = [...list].sort(
        (a, b) => Number(b.isPopular) - Number(a.isPopular),
      );

    return list;
  }, [products, filters, sortBy]);

  return (
    <div className="site-container section-y pt-2! flex flex-col gap-6 lg:flex-row ">
      <ProductsFilter filters={filters} setFilters={setFilters} />

      <div className="min-w-0 flex-1">
        <ProductsSort
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {visibleProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1 rounded-md border border-border/60 bg-card px-5 py-16 text-center shadow-2xs">
            <p className="text-sm font-bold text-foreground">
              No products match these filters
            </p>
            <p className="text-xs text-muted-foreground">
              Try widening the price range or clearing a discount filter.
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-4 grid-cols-2 ${
              viewMode === "list"
                ? "lg:grid-cols-1"
                : "md:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                href={`/product/${product.slug}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
