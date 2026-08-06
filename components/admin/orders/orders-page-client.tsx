// src/components/admin/orders/orders-page-client.tsx
"use client";

import {
  getAdminOrders,
  getAdminOrderStats,
} from "@/actions/admin/order-actions";
import { PageHeader } from "@/components/admin/layout/page-header";
import { OrderFiltersBar } from "@/components/admin/orders/order-filters-bar";
import { OrderStatsCards } from "@/components/admin/orders/order-stats-cards";
import { OrdersTable } from "@/components/admin/orders/orders-table";
import { DataTablePagination } from "@/components/my-ui/data-table-pagination";
import { buttonVariants } from "@/components/ui/button";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

type AdminOrdersResult = Awaited<ReturnType<typeof getAdminOrders>>;
type AdminOrderStats = Awaited<ReturnType<typeof getAdminOrderStats>>;

export function OrdersPageClient({
  initialData,
  initialStats,
  initialFilters,
}: {
  initialData: AdminOrdersResult;
  initialStats: AdminOrderStats;
  initialFilters: {
    search?: string;
    status?: string;
    month?: string;
    page: number;
  };
}) {
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

  const isInitial =
    filters.search === (initialFilters.search ?? "") &&
    filters.status === (initialFilters.status ?? "") &&
    filters.month === (initialFilters.month ?? "") &&
    filters.page === initialFilters.page;

  const { data, isFetching } = useQuery({
    queryKey: ["admin-orders", filters],
    queryFn: () => getAdminOrders(filters),
    initialData: isInitial ? initialData : undefined,
    placeholderData: keepPreviousData,
  });

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["admin-order-stats"],
    queryFn: () => getAdminOrderStats(),
    initialData: initialStats,
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
