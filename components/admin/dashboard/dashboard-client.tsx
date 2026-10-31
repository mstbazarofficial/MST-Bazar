"use client";

import DashboardSkeleton from "@/app/(admin)/admin/skeleton";
import { QuickActions } from "@/components/admin/dashboard/quick-actions";
import { QuickStats } from "@/components/admin/dashboard/quick-stats";
import { RecentOrders } from "@/components/admin/dashboard/recent-orders";
import { RecentUsers } from "@/components/admin/dashboard/recent-users";
import { SalesChart } from "@/components/admin/dashboard/sales-chart";
import { PageHeader } from "@/components/admin/layout/page-header";
import { adminFetch } from "@/lib/admin-fetch";
import { useQuery } from "@tanstack/react-query";

export function DashboardClient() {
  const { data: overview } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminFetch("dashboard"),
  });

  if (!overview) return <DashboardSkeleton />;

  return (
    <>
      <PageHeader title="Dashboard" />
      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <QuickStats overview={overview} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <SalesChart data={overview.salesChart} />
          </div>
          <QuickActions />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <RecentOrders orders={overview.recentOrders} />
          <RecentUsers users={overview.recentUsers} />
        </div>
      </main>
    </>
  );
}
