import { CtaBanner } from "@/components/main/common/CtaBanner";
import { BestDealsSection } from "@/components/main/home/best-deal-section";
import { CategorySection } from "@/components/main/home/category-section";
import { ComboProductsSection } from "@/components/main/home/combo-products-section";
import { HeroSection } from "@/components/main/home/hero-section";
import FaqSection from "@/components/main/home/home-faq-section";
import { PopularProductsSection } from "@/components/main/home/popular-product-section";
import { TopSellingSection } from "@/components/main/home/top-selling-section";
import { HomeTrustSection } from "@/components/main/home/trust-section";
import { getAllCategories, getAllProducts } from "@/lib/data/catalog";
import { Suspense } from "react";

export default async function Home() {
  const categories = await getAllCategories();
  const products = await getAllProducts();
  const bestDeals = products.filter((p) => p.isBestDeal).slice(0, 5);
  const popularProducts = products.filter((p) => p.isPopular).slice(0, 10);
  const comboProducts = products.filter((p) => p.isCombo).slice(0, 10);
  const topSellingProducts = products.filter((p) => p.isTopSelling).slice(0, 4);

  return (
    <main>
      <Suspense
        fallback={
          <section className="site-container section-y w-full">
            <div className="h-80 rounded-3xl bg-muted/30" />
          </section>
        }
      >
        <HeroSection />
      </Suspense>
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
