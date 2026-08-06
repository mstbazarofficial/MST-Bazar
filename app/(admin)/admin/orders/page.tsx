// app/admin/orders/page.tsx
import {
  getAdminOrders,
  getAdminOrderStats,
} from "@/actions/admin/order-actions";
import { OrdersPageClient } from "@/components/admin/orders/orders-page-client";
import { requireAdmin } from "@/lib/admin-auth";

type SearchParams = {
  search?: string;
  status?: string;
  month?: string;
  page?: string;
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const filters = {
    search: params.search,
    status: params.status,
    month: params.month,
    page: Number(params.page) || 1,
  };

  const [initialData, initialStats] = await Promise.all([
    getAdminOrders(filters),
    getAdminOrderStats(),
  ]);

  return (
    <OrdersPageClient
      initialData={initialData}
      initialStats={initialStats}
      initialFilters={filters}
    />
  );
}
