import { FiltersBarSkeleton } from "@/components/admin/layout/loading-skeletons";
import { PageHeader } from "@/components/admin/layout/page-header";
import { OrderStatsCards } from "@/components/admin/orders/order-stats-cards";
import { OrdersTable } from "@/components/admin/orders/orders-table";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminOrdersLoading() {
  return (
    <>
      <PageHeader
        title="Orders List"
        actions={
          <Link
            href="/admin/orders/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="size-4" />
            Add order
          </Link>
        }
      />

      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <OrderStatsCards isLoading />
        <FiltersBarSkeleton />
        <OrdersTable orders={[]} isLoading />
      </main>
    </>
  );
}
