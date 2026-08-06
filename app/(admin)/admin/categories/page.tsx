// app/admin/categories/page.tsx
import { CategoriesPageHeader } from "@/components/admin/categories/categories-page-header";
import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { CategoriesTableSkeleton } from "@/components/admin/categories/categories-table-skeleton";
import { CategorySearch } from "@/components/admin/categories/category-search";
import { requireAdmin } from "@/lib/admin-auth";
import { Suspense } from "react";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  await requireAdmin();
  const { search } = await searchParams;

  return (
    <>
      <CategoriesPageHeader />

      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <CategorySearch defaultValue={search} />

        {/* key={search} forces a fresh Suspense fallback whenever the search
            term changes, so the table area shows skeletons instead of a
            stale list, without blocking the header/search bar */}
        <Suspense key={search ?? ""} fallback={<CategoriesTableSkeleton />}>
          <CategoriesTable search={search} />
        </Suspense>
      </main>
    </>
  );
}
