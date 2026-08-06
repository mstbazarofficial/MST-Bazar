// app/admin/products/new/page.tsx
import {
  getActiveCampaigns,
  getAdminCategories,
} from "@/actions/admin/product-actions";
import { ProductFormPage } from "@/components/admin/products/product-form-page";
import { requireAdmin } from "@/lib/admin-auth";

export default async function NewProductPage() {
  await requireAdmin();
  const [categories, campaigns] = await Promise.all([
    getAdminCategories(),
    getActiveCampaigns(),
  ]);

  return <ProductFormPage categories={categories} campaigns={campaigns} />;
}
