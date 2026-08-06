import { getAdminProductBySlug } from "@/actions/admin/product-actions";
import { ProductCampaignCard } from "@/components/admin/products/product-campaign-card";
import { ProductDescriptions } from "@/components/admin/products/product-descriptions";
import { ProductDetailHeader } from "@/components/admin/products/product-detail-header";
import { ProductImageGallery } from "@/components/admin/products/product-image-gallery";
import { ProductInfoGrid } from "@/components/admin/products/product-info-grid";
import { ProductTimelineCard } from "@/components/admin/products/product-timeline-card";
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

  const activeCampaign = product.campaigns.find((c) => c.isActive) ?? null;

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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <ProductImageGallery images={product.images} />

          <div className="rounded-lg border border-border bg-card p-4">
            <ProductInfoGrid
              product={{
                sku: product.sku,
                brand: product.brand,
                categoryName: product.category.name,
                unit: product.unit,
                price: product.price,
                discountPercentage: product.discountPercentage,
                isBestDeal: product.isBestDeal,
                slug: product.slug,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ProductDescriptions productDetails={product.productDetails} />
          </div>

          <div className="space-y-6">
            <ProductCampaignCard campaign={activeCampaign} />
            <ProductTimelineCard
              createdAt={product.createdAt}
              updatedAt={product.updatedAt}
            />
          </div>
        </div>
      </main>
    </>
  );
}
