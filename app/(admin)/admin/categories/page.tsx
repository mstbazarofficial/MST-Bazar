import { getAdminCategories } from "@/actions/admin/category-actions";
import { CategoriesPageHeader } from "@/components/admin/categories/categories-page-header";
import { CategoryPageClient } from "@/components/admin/categories/category-page-client";

export default async function AdminCategoriesPage() {
  const initialCategories = await getAdminCategories();

  return (
    <>
      <CategoriesPageHeader />
      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <CategoryPageClient initialCategories={initialCategories} />
      </main>
    </>
  );
}
