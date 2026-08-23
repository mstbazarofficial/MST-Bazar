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
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL;

  // Determine primary featured image
  const imageUrl =
    product.images.find((img) => img.isFeatured)?.url || product.images[0]?.url;

  // Generate dynamic SEO description fallback
  const rawDescription =
    product.shortDescription ||
    `Buy ${product.title} at MST Shop. ${
      product.category?.name ? `Category: ${product.category.name}.` : ""
    } High quality products with fast delivery across Bangladesh.`;

  const description = rawDescription.slice(0, 160).trim();

  const title = `${product.title}`;

  return {
    title,
    description,
    keywords: [
      product.title,
      product.category?.name,
      product.brand,
      "online shop Bangladesh",
      "buy online BD",
      "MST Shop",
    ].filter(Boolean) as string[],
    alternates: {
      canonical: `${siteUrl}/product/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/product/${product.slug}`,
      siteName: "MST Shop",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
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

        <div className="mt-6 rounded-md border border-border/50 bg-card p-4 shadow-xs sm:p-6">
          <ProductDetails longDescription={product.productDetails} />
        </div>
      </div>
      <RelatedProductsSection products={relatedProducts} />
    </main>
  );
}
