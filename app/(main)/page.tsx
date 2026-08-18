import { CtaBanner } from "@/components/main/common/CtaBanner";
import { BestDealsSection } from "@/components/main/home/best-deal-section";
import { CategorySection } from "@/components/main/home/category-section";
import FaqSection from "@/components/main/home/FAQ";
import { HeroSection } from "@/components/main/home/hero-section";
import { PopularProductsSection } from "@/components/main/home/popular-product-section";
import PromoBannersSection from "@/components/main/home/PromoBannersSection";
import { getAllCategories, getAllProducts } from "@/lib/data/catalog";
import { Suspense } from "react";

export default async function Home() {
  const categories = await getAllCategories();
  const products = await getAllProducts();
  const bestDeals = products.filter((p) => p.isBestDeal).slice(0, 6);
  const popularProducts = products.filter((p) => p.isPopular).slice(0, 10);

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
      <BestDealsSection products={bestDeals} />
      <PopularProductsSection products={popularProducts} />
      <PromoBannersSection />
      <FaqSection />
      <CtaBanner />
    </main>
  );
}
