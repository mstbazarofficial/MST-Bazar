// app/product/[slug]/page.tsx
import { ProductBreadcrumb } from "@/components/main/product/product-breadcrumb";
import { ProductDetails } from "@/components/main/product/product-details";
import { ProductGallery } from "@/components/main/product/product-gallery";
import { ProductInfo } from "@/components/main/product/product-info";
import { RelatedProductsSection } from "@/components/main/product/related-products";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/catalog";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    {
      label: product.category.name,
      href: `/products/${product.category.slug}`,
    },
    { label: product.title, href: "#" },
  ];

  const relatedProducts = await getRelatedProducts(
    product.category.id,
    product.id,
  );

  return (
    <main className="min-h-screen bg-muted">
      <div className="site-container">
        <ProductBreadcrumb items={breadcrumbItems} />
        <div className="grid grid-cols-1 gap-8 rounded-md border border-border/50 bg-card p-4 shadow-xs sm:p-6 lg:grid-cols-2 lg:gap-10">
          <ProductGallery
            images={product.images}
            productTitle={product.title}
          />
          <ProductInfo product={product} />
        </div>

        <div className="rounded-md mt-6 border border-border/50 bg-card p-4 shadow-xs sm:p-6">
          <ProductDetails longDescription={product.productDetails} />
        </div>
      </div>
      <RelatedProductsSection products={relatedProducts} />
    </main>
  );
}
