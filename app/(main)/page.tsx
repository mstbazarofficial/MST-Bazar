import { CategorySection } from "@/components/main/home/category-section";
import { HeroSection } from "@/components/main/home/hero-section";
import { TopSellingSection } from "@/components/main/home/top-selling-section";
import { getAllCategories, getAllProducts } from "@/lib/data/catalog";
import dynamic from "next/dynamic";

const BestDealsSection = dynamic(() =>
  import("@/components/main/home/best-deal-section").then(
    (mod) => mod.BestDealsSection,
  ),
);
const ComboProductsSection = dynamic(() =>
  import("@/components/main/home/combo-products-section").then(
    (mod) => mod.ComboProductsSection,
  ),
);
const PopularProductsSection = dynamic(() =>
  import("@/components/main/home/popular-product-section").then(
    (mod) => mod.PopularProductsSection,
  ),
);
const HomeTrustSection = dynamic(() =>
  import("@/components/main/home/trust-section").then(
    (mod) => mod.HomeTrustSection,
  ),
);
const FaqSection = dynamic(
  () => import("@/components/main/home/home-faq-section"),
);
const CtaBanner = dynamic(() =>
  import("@/components/main/common/CtaBanner").then((mod) => mod.CtaBanner),
);

export default async function Home() {
  const categories = await getAllCategories();
  const products = await getAllProducts();
  const bestDeals = products.filter((p) => p.isBestDeal).slice(0, 5);
  const popularProducts = products.filter((p) => p.isPopular).slice(0, 10);
  const comboProducts = products.filter((p) => p.isCombo).slice(0, 10);
  const topSellingProducts = products.filter((p) => p.isTopSelling).slice(0, 4);

  return (
    <main>
      <HeroSection />
      <CategorySection categories={categories} />
      <TopSellingSection products={topSellingProducts} />
      <BestDealsSection products={bestDeals} />
      <PopularProductsSection products={popularProducts} />
      <ComboProductsSection products={comboProducts} />
      <CtaBanner />
      <HomeTrustSection />
      <FaqSection />
    </main>
  );
}
