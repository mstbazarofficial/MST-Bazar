// app/admin/products/page.tsx
import {
  getAdminCategories,
  getAdminProducts,
  getAdminProductStats,
} from "@/actions/admin/product-actions";
import { ProductsPageClient } from "@/components/admin/products/products-page-client";
import { requireAdmin } from "@/lib/admin-auth";

type SearchParams = {
  search?: string;
  categoryId?: string;
  availability?: "all" | "available" | "unavailable";
  page?: string;
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const filters = {
    search: params.search,
    categoryId: params.categoryId,
    availability: params.availability ?? ("all" as const),
    page: Number(params.page) || 1,
  };

  const [initialData, initialStats, categories] = await Promise.all([
    getAdminProducts(filters),
    getAdminProductStats(),
    getAdminCategories(),
  ]);

  return (
    <ProductsPageClient
      initialData={initialData}
      initialStats={initialStats}
      initialFilters={filters}
      categories={categories}
    />
  );
}
