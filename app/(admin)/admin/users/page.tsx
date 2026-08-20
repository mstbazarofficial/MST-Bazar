// app/admin/orders/page.tsx
import { getAdminUsers } from "@/actions/admin/user-actions";
import { UsersPageClient } from "@/components/admin/users/users-page-client";
import { requireAdmin } from "@/lib/admin-auth";

type SearchParams = {
  search?: string;
  role?: string;
  month?: string;
  page?: string;
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const filters = {
    search: params.search,
    role: params.role,
    month: params.month,
    page: Number(params.page) || 1,
  };

  const initialData = await getAdminUsers(filters);

  return <UsersPageClient initialData={initialData} initialFilters={filters} />;
}
