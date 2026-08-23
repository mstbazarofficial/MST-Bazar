import Testimonials from "@/components/main/common/Testimonials";
import ProductsHeader from "@/components/main/products/products-header";
import { ProductsPageClient } from "@/components/main/products/products-page-client";
import { getAllCategories, getAllProducts } from "@/lib/data/catalog";
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
        return product.isBestDeal; // Adjust to match your data schema
      case "popular-products":
        return product.isPopular; // Adjust to match your data schema
      case "combo-deals":
        return product.isCombo; // Adjust to match your data schema
      case "top-selling":
        return product.isTopSelling; // Adjust to match your data schema
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
