// src/components/admin/products/products-page-client.tsx
"use client";

import type { ProductAvailabilityFilter } from "@/actions/admin/product-actions";
import AdminProductsSkeleton from "@/app/(admin)/admin/products/skeleton";
import { PageHeader } from "@/components/admin/layout/page-header";
import { ProductFiltersBar } from "@/components/admin/products/product-filters-bar";
import { ProductStatsCards } from "@/components/admin/products/product-stats-cards";
import { ProductsPagination } from "@/components/admin/products/products-pagination";
import { ProductsTable } from "@/components/admin/products/products-table";
import { buttonVariants } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin-fetch";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function ProductsPageClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      categorySlug: searchParams.get("slug") ?? "",
      availability:
        (searchParams.get("availability") as ProductAvailabilityFilter) ||
        "all",
      page: Number(searchParams.get("page")) || 1,
    }),
    [searchParams],
  );

  const { data, isFetching } = useQuery({
    queryKey: ["admin-products", filters],
    queryFn: () => adminFetch("products", filters),
    placeholderData: keepPreviousData,
  });

  // Stats change rarely, so a longer staleTime avoids refetching on every filter tweak
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["admin-product-stats"],
    queryFn: () => adminFetch("productStats"),
    staleTime: 60_000,
  });

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => adminFetch("categories"),
  });

  const updateParams = useCallback(
    (updates: Record<string, string | undefined | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      if (!("page" in updates)) next.set("page", "1");

      window.history.pushState(null, "", `${pathname}?${next.toString()}`);
    },
    [pathname, searchParams],
  );

  if (!data || !stats || !categories) return <AdminProductsSkeleton />;

  return (
    <>
      <PageHeader
        title="Products List"
        actions={
          <Link
            href="/admin/products/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="size-4" />
            Add product
          </Link>
        }
      />

      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <ProductStatsCards stats={stats} isLoading={isStatsLoading} />

        <ProductFiltersBar
          categories={categories}
          filters={filters}
          onChange={updateParams}
        />

        <ProductsTable products={data?.products ?? []} isLoading={isFetching} />

        <ProductsPagination
          page={filters.page}
          pageSize={data?.pageSize ?? 5}
          total={data?.total ?? 0}
          onPageChange={(page) => updateParams({ page: String(page) })}
        />
      </main>
    </>
  );
}
