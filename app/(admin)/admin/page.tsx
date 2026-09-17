import { QuickActions } from "@/components/admin/dashboard/quick-actions";
import { QuickStats } from "@/components/admin/dashboard/quick-stats";
import { RecentOrders } from "@/components/admin/dashboard/recent-orders";
import { RecentUsers } from "@/components/admin/dashboard/recent-users";
import { PageHeader } from "@/components/admin/layout/page-header";
import { prisma } from "@/lib/prisma"; // adjust to your prisma client path

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    pendingOrders,
    totalCategories,
    recentOrders,
    recentUsers,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.category.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { orderDate: "desc" },
      select: {
        id: true,
        orderId: true,
        customerName: true,
        status: true,
        productCost: true,
        orderDate: true,
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        image: true,
      },
    }),
  ]);

  const stats = {
    totalProducts,
    totalOrders,
    totalUsers,
    pendingOrders,
    totalCategories,
  };

  return (
    <>
      <PageHeader title=" Dashboard" />
      <section className="dashboard-container">
        <QuickStats stats={stats} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <RecentOrders orders={recentOrders} />
            <RecentUsers users={recentUsers} />
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </section>
    </>
  );
}
