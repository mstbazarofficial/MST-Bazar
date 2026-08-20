// app/admin/products/new/page.tsx
import { getAdminCategories } from "@/actions/admin/product-actions";
import { ProductFormPage } from "@/components/admin/products/product-form-page";
import { requireAdmin } from "@/lib/admin-auth";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getAdminCategories();

  return <ProductFormPage categories={categories} />;
}
