// src/components/admin/orders/orders-page-client.tsx
"use client";

import AdminOrdersSkeleton from "@/app/(admin)/admin/orders/skeleton";
import { PageHeader } from "@/components/admin/layout/page-header";
import { OrderFiltersBar } from "@/components/admin/orders/order-filters-bar";
import { OrderStatsCards } from "@/components/admin/orders/order-stats-cards";
import { OrdersTable } from "@/components/admin/orders/orders-table";
import { DataTablePagination } from "@/components/my-ui/data-table-pagination";
import { buttonVariants } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin-fetch";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function OrdersPageClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      status: searchParams.get("status") ?? "",
      month: searchParams.get("month") ?? "",
      page: Number(searchParams.get("page")) || 1,
    }),
    [searchParams],
  );

  const { data, isFetching } = useQuery({
    queryKey: ["admin-orders", filters],
    queryFn: () => adminFetch("orders", filters),
    placeholderData: keepPreviousData,
  });

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["admin-order-stats"],
    queryFn: () => adminFetch("orderStats"),
    staleTime: 60_000,
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

  if (!data || !stats) return <AdminOrdersSkeleton />;

  return (
    <>
      <PageHeader
        actions={
          <Link
            href="/admin/orders/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="size-4" />
            Add order
          </Link>
        }
        title="Orders List"
      />

      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <OrderStatsCards stats={stats} isLoading={isStatsLoading} />

        <OrderFiltersBar filters={filters} onChange={updateParams} />

        <OrdersTable orders={data?.orders ?? []} isLoading={isFetching} />

        <DataTablePagination
          currentPage={filters.page}
          pageSize={data?.pageSize ?? 20}
          totalItems={data?.total ?? 0}
          itemName="orders"
          onPageChange={(page) => updateParams({ page: String(page) })}
        />
      </main>
    </>
  );
}
