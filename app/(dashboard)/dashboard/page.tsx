export const dynamic = "force-dynamic";

import CurrentOrder from "@/components/dashboard/home/current-order";
import DeliveryDetails from "@/components/dashboard/home/delivery-details";
import StatsSection from "@/components/dashboard/home/stats";
import {
  PageHeading,
  Panel,
} from "@/components/dashboard/layout/dashboard-panel";
import { EmptyOrders } from "@/components/dashboard/orders/empty-orders";
import { OrderHelpCard } from "@/components/dashboard/orders/order-help-card";
import { OrderListCard } from "@/components/dashboard/orders/order-list-card";
import {
  ACTIVE_ORDER_STATUSES,
  ORDER_LIST_SELECT,
} from "@/components/dashboard/orders/order-meta";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [statusCounts, currentOrder, latestOrders, profile] = await Promise.all(
    [
      prisma.order.groupBy({
        by: ["status"],
        where: { userId },
        _count: { _all: true },
      }),
      prisma.order.findFirst({
        where: { userId, status: { in: ACTIVE_ORDER_STATUSES } },
        orderBy: { orderDate: "desc" },
        select: ORDER_LIST_SELECT,
      }),
      prisma.order.findMany({
        where: { userId },
        orderBy: { orderDate: "desc" },
        take: 5,
        select: ORDER_LIST_SELECT,
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { phoneNumber: true, fullAddress: true },
      }),
    ],
  );

  const countOf = (...statuses: string[]) =>
    statusCounts
      .filter((row) => statuses.includes(row.status))
      .reduce((sum, row) => sum + row._count._all, 0);

  const stats = {
    total: statusCounts.reduce((sum, row) => sum + row._count._all, 0),
    inProgress: countOf(...ACTIVE_ORDER_STATUSES),
    delivered: countOf("DELIVERED"),
    closed: countOf("CANCELLED", "RETURNED"),
  };

  // The current order has its own card, so it isn't repeated in the list
  const recentOrders = latestOrders
    .filter((order) => order.id !== currentOrder?.id)
    .slice(0, 4);

  const firstName = session.user.name.trim().split(" ")[0] || "there";

  return (
    <div className="space-y-5">
      <PageHeading
        title={`Hi, ${firstName}`}
        description={
          stats.inProgress > 0
            ? `You have ${stats.inProgress} order${stats.inProgress !== 1 ? "s" : ""} in progress.`
            : "You have no orders in progress."
        }
      />

      <StatsSection stats={stats} />

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-5">
          {currentOrder && <CurrentOrder order={currentOrder} />}

          {stats.total === 0 ? (
            <Panel>
              <EmptyOrders />
            </Panel>
          ) : (
            recentOrders.length > 0 && (
              <Panel
                title="Recent orders"
                action={
                  <Link
                    href="/dashboard/orders"
                    className="shrink-0 text-sm font-medium text-primary-dark hover:underline"
                  >
                    View all
                  </Link>
                }
              >
                <div className="divide-y divide-border border-t border-border">
                  {recentOrders.map((order) => (
                    <OrderListCard key={order.id} order={order} />
                  ))}
                </div>
              </Panel>
            )
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <DeliveryDetails
            phoneNumber={profile?.phoneNumber}
            fullAddress={profile?.fullAddress}
          />
          <OrderHelpCard />
        </div>
      </div>
    </div>
  );
}
