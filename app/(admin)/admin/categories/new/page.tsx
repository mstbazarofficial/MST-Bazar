import { CategoryFormPage } from "@/components/admin/categories/category-form-page";
import { requireAdmin } from "@/lib/admin-auth";

export default async function NewCategoryPage() {
  await requireAdmin();

  return <CategoryFormPage />;
}
