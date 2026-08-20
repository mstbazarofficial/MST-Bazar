import { getAdminProductBySlug } from "@/actions/admin/product-actions";
import { ProductDescriptions } from "@/components/admin/products/product-descriptions";
import { ProductDetailHeader } from "@/components/admin/products/product-detail-header";
import { ProductImageGallery } from "@/components/admin/products/product-image-gallery";
import { ProductInfoGrid } from "@/components/admin/products/product-info-grid";
import { requireAdmin } from "@/lib/admin-auth";
import { notFound } from "next/navigation";

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();

  const { slug } = await params;
  const product = await getAdminProductBySlug(decodeURIComponent(slug));
  if (!product) notFound();

  return (
    <>
      <ProductDetailHeader
        product={{
          id: product.id,
          title: product.title,
          slug: product.slug,
          isAvailable: product.isAvailable,
        }}
      />

      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        {/* TOP SECTION: Gallery + Core Info */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          <ProductImageGallery images={product.images} />

          <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-2xs">
            <ProductInfoGrid product={product} />
          </div>
        </div>

        <ProductDescriptions productDetails={product.productDetails} />
      </main>
    </>
  );
}
