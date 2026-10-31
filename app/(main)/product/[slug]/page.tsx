// app/product/[slug]/page.tsx
import { getUnitPrice } from "@/utils/calculate-order-total";
import { ProductBreadcrumb } from "@/components/main/product/product-breadcrumb";
import { ProductDetails } from "@/components/main/product/product-details";
import { ProductGallery } from "@/components/main/product/product-gallery";
import { ProductInfo } from "@/components/main/product/product-info";
import { ProductViewTracker } from "@/components/main/product/product-view-tracker";
import { RelatedProductsSection } from "@/components/main/product/related-products";
import { SITE_CONFIG } from "@/constants/site";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/catalog";
import { getFeaturedImageUrl } from "@/utils/get-featured-image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type CatalogProduct = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;

// Generate dynamic SEO description fallback
function getProductDescription(product: CatalogProduct) {
  const rawDescription =
    product.shortDescription ||
    `Buy ${product.title} at ${SITE_CONFIG.name}. ${
      product.category?.name ? `Category: ${product.category.name}.` : ""
    } High quality products with fast delivery across Bangladesh.`;

  return rawDescription.slice(0, 160).trim();
}

function getStructuredData(
  product: CatalogProduct,
  breadcrumbItems: { label: string; href: string }[],
) {
  const siteUrl = SITE_CONFIG.url;
  const productUrl = `${siteUrl}/product/${product.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.title,
        description: getProductDescription(product),
        url: productUrl,
        image: product.images.map((image) => image.url),
        sku: product.sku ?? undefined,
        brand: {
          "@type": "Brand",
          name: product.brand ?? SITE_CONFIG.name,
        },
        category: product.category.name,
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "BDT",
          price: getUnitPrice(product.price, product.discountPercentage),
          availability: product.isAvailable
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${siteUrl}/#organization` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: item.href === "#" ? productUrl : `${siteUrl}${item.href}`,
        })),
      },
    ],
  };
}

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

  const siteUrl = SITE_CONFIG.url;

  // Determine primary featured image
  const imageUrl = getFeaturedImageUrl(product.images) ?? SITE_CONFIG.ogImage;

  const description = getProductDescription(product);

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
      SITE_CONFIG.name,
    ].filter(Boolean) as string[],
    alternates: {
      canonical: `${siteUrl}/product/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/product/${product.slug}`,
      siteName: SITE_CONFIG.name,
      locale: "en_BD",
      type: "website",
      images: [
        {
          url: imageUrl,
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
    <main className="bg-muted">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getStructuredData(product, breadcrumbItems),
          ).replace(/</g, "\\u003c"),
        }}
      />
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
      <ProductViewTracker
        product={{
          id: product.id,
          name: product.title,
          price: getUnitPrice(product.price, product.discountPercentage),
        }}
      />
    </main>
  );
}
