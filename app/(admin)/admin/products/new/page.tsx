// app/admin/products/new/page.tsx
import { getAdminCategories } from "@/actions/admin/product-actions";
import { ProductFormPage } from "@/components/admin/products/product-form-page";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return <ProductFormPage categories={categories} />;
}
