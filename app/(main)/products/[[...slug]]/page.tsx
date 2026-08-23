import Testimonials from "@/components/main/common/Testimonials";
import ProductsHeader from "@/components/main/products/products-header";
import { ProductsPageClient } from "@/components/main/products/products-page-client";
import { getAllCategories, getAllProducts } from "@/lib/data/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SPECIAL_FILTERS: Record<string, string> = {
  "best-deals": "Best Deals",
  "popular-products": "Popular Products",
  "combo-deals": "Combo Deals",
  "top-selling": "Top Selling Products",
};

export async function generateStaticParams() {
  const categories = await getAllCategories();

  const specialParams = Object.keys(SPECIAL_FILTERS).map((filter) => ({
    slug: [filter],
  }));

  const categoryParams = categories.map((c) => ({
    slug: [c.slug],
  }));

  return [{}, ...specialParams, ...categoryParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const currentSlug = slug?.[0];

  const [categories, products] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
  ]);

  const existedCategory = currentSlug
    ? categories.find((c) => c.slug === currentSlug)
    : null;
  const isSpecialFilter = currentSlug ? currentSlug in SPECIAL_FILTERS : false;

  let pageTitle = "All Products";
  let description =
    "Explore our complete collection of fresh groceries, organic products, premium honey, and special deals at MST Bazar.";

  if (existedCategory) {
    pageTitle = existedCategory.name;
    description = `Browse high quality ${existedCategory.name} at MST Bazar. Fresh, authentic, and delivered across Bangladesh.`;
  } else if (currentSlug && isSpecialFilter) {
    pageTitle = SPECIAL_FILTERS[currentSlug];
    description = `Shop the best ${SPECIAL_FILTERS[currentSlug]} at MST Bazar. Great discounts and special offers on quality essentials.`;
  }

  // Find first matching product for fallback image
  const matchingProduct = products.find((product) => {
    if (!currentSlug) return true;
    if (existedCategory) return product.category.slug === currentSlug;
    switch (currentSlug) {
      case "best-deals":
        return product.isBestDeal;
      case "popular-products":
        return product.isPopular;
      case "combo-deals":
        return product.isCombo;
      case "top-selling":
        return product.isTopSelling;
      default:
        return true;
    }
  });

  // Priority: 1. Category image -> 2. First filtered product image -> 3. Site logo fallback
  const categoryImage =
    (existedCategory as { image?: string; imageUrl?: string } | null)?.image ||
    (existedCategory as { image?: string; imageUrl?: string } | null)?.imageUrl;

  const fallbackProductImage =
    matchingProduct?.images?.find((img) => img.isFeatured)?.url ||
    matchingProduct?.images?.[0]?.url;

  const rawOgImage =
    categoryImage || fallbackProductImage || "/assets/logo.png";

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com";
  const canonicalUrl = currentSlug
    ? `${siteUrl}/products/${currentSlug}`
    : `${siteUrl}/products`;

  const ogImageUrl = rawOgImage.startsWith("http")
    ? rawOgImage
    : `${siteUrl}${rawOgImage}`;

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${pageTitle} | MST Bazar`,
      description,
      url: canonicalUrl,
      siteName: "MST Bazar",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | MST Bazar`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const currentSlug = slug?.[0];

  const products = await getAllProducts();
  const categories = await getAllCategories();

  const existedCategory = currentSlug
    ? categories.find((c) => c.slug === currentSlug)
    : null;

  const isSpecialFilter = currentSlug ? currentSlug in SPECIAL_FILTERS : false;

  // Trigger 404 if slug exists but matches neither a category nor a special filter
  if (slug?.length && !existedCategory && !isSpecialFilter) {
    notFound();
  }

  // Set the dynamic header title
  let title = "All Products";
  if (existedCategory) {
    title = existedCategory.name;
  } else if (currentSlug && isSpecialFilter) {
    title = SPECIAL_FILTERS[currentSlug];
  }

  // Filter products by category or special flag
  const filteredProducts = products.filter((product) => {
    if (!currentSlug) return true;

    if (existedCategory) {
      return product.category.slug === currentSlug;
    }

    switch (currentSlug) {
      case "best-deals":
        return product.isBestDeal;
      case "popular-products":
        return product.isPopular;
      case "combo-deals":
        return product.isCombo;
      case "top-selling":
        return product.isTopSelling;
      default:
        return true;
    }
  });

  return (
    <main className="bg-muted">
      <ProductsHeader title={title} />
      <ProductsPageClient products={filteredProducts} />
      <Testimonials />
    </main>
  );
}
