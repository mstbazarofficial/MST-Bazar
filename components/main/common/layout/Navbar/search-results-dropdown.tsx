"use client";

import Image from "next/image";
import Link from "next/link";

import type { ProductDTO } from "@/lib/data/catalog";

interface SearchResultsDropdownProps {
  query: string;
  onNavigate?: () => void;
  searchResults?: ProductDTO[];
}

function getFeaturedImage(product: ProductDTO): string {
  const featured = product.images.find((img) => img.isFeatured);
  return (featured ?? product.images[0])?.url ?? "/placeholder.svg";
}

function formatPrice(price: number, discountPercentage: number) {
  if (!discountPercentage) return { final: price, original: null };
  const final = Math.round(price - (price * discountPercentage) / 100);
  return { final, original: price };
}

export function SearchResultsDropdown({
  query,
  onNavigate,
  searchResults,
}: SearchResultsDropdownProps) {
  if (!query.trim()) return null;

  return (
    <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
      {searchResults?.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
          No products found for &ldquo;{query}&rdquo;
        </p>
      ) : (
        <ul className="max-h-80 divide-y divide-border overflow-y-auto">
          {searchResults?.map((product) => {
            const { final, original } = formatPrice(
              product.price,
              product.discountPercentage,
            );
            const imageUrl = getFeaturedImage(product);

            return (
              <li key={product.id}>
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onNavigate}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                >
                  <span className="relative shrink-0">
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-md border border-border bg-muted object-cover"
                    />
                    {product.discountPercentage > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 rounded-full bg-destructive px-1 py-0.5 text-[9px] font-semibold leading-none text-primary-foreground">
                        -{product.discountPercentage}%
                      </span>
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {product.title}
                      </span>
                      {product.isBestDeal && (
                        <span className="shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                          Best deal
                        </span>
                      )}
                      {product.isPopular && !product.isBestDeal && (
                        <span className="shrink-0 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                          Popular
                        </span>
                      )}
                    </span>
                    {product.unit && (
                      <span className="text-xs text-muted-foreground">
                        {product.unit}
                      </span>
                    )}
                  </span>

                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-semibold text-primary">
                      ৳{final}
                    </span>
                    {original !== null && (
                      <span className="block text-xs text-muted-foreground line-through">
                        ৳{original}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
