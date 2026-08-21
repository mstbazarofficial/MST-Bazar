// app/admin/products/[id]/edit/page.tsx
import {
  getAdminCategories,
  getAdminProductBySlug,
} from "@/actions/admin/product-actions";
import { ProductFormPage } from "@/components/admin/products/product-form-page";
import { requireAdmin } from "@/lib/admin-auth";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();

  const { slug } = await params;

  const [product, categories] = await Promise.all([
    getAdminProductBySlug(decodeURIComponent(slug)),
    getAdminCategories(),
  ]);

  if (!product) notFound();

  return (
    <ProductFormPage
      mode="edit"
      productId={product.id}
      categories={categories}
      initialValues={{
        title: product.title,
        inputSlug: product.slug,
        brand: product.brand ?? "",
        unit: product.unit ?? "",
        price: product.price,
        discountPercentage: product.discountPercentage,
        shortDescription: product.shortDescription ?? "",
        isBestDeal: product.isBestDeal,
        isAvailable: product.isAvailable,
        categoryId: product.categoryId,
        images: product.images,
        isPopular: product.isPopular,
        isCombo: product.isCombo,
        priority: product.priority,
        productDetails: product.productDetails ?? "",
      }}
    />
  );
}
