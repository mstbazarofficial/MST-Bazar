import { CtaBanner } from "@/components/main/common/CtaBanner";
import { BestDealsSection } from "@/components/main/home/best-deal-section";
import { CategorySection } from "@/components/main/home/category-section";
import { ComboProductsSection } from "@/components/main/home/combo-products-section";
import { HeroSection } from "@/components/main/home/hero-section";
import FaqSection from "@/components/main/home/home-faq-section";
import { PopularProductsSection } from "@/components/main/home/popular-product-section";
import { HomeTrustSection } from "@/components/main/home/trust-section";
import { getAllCategories, getAllProducts } from "@/lib/data/catalog";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  const categories = await getAllCategories();
  const products = await getAllProducts();
  const bestDeals = products.filter((p) => p.isBestDeal).slice(0, 6);
  const popularProducts = products.filter((p) => p.isPopular).slice(0, 10);
  const comboProducts = products.filter((p) => p.isCombo).slice(0, 10);

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
      <ComboProductsSection products={comboProducts} />
      <CtaBanner />
      <HomeTrustSection />
      <section className="site-container section-y hidden">
        <div className="max-w-3xl">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            How does MST Bazar deliver fresh groceries in Bangladesh?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            MST Bazar sources grocery products from trusted suppliers, including
            honey, oils, spices, and pantry essentials. We package each order
            carefully and deliver it to homes across Bangladesh. Customers can
            track an order, review our return policy, or contact our support
            team whenever an order needs attention.
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            Helpful MST Bazar guides
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Learn more about our products, shopping process, delivery service,
            and customer care before placing an order. These guides explain what
            MST Bazar offers and where to find help with payment, returns,
            refunds, and order questions.
          </p>
          <nav
            aria-label="Helpful MST Bazar guides"
            className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm"
          >
            <Link
              className="text-primary-dark underline-offset-4 hover:underline"
              href="/about"
            >
              Our story and values
            </Link>
            <Link
              className="text-primary-dark underline-offset-4 hover:underline"
              href="/faq"
            >
              Shopping FAQ
            </Link>
            <Link
              className="text-primary-dark underline-offset-4 hover:underline"
              href="/return-refund"
            >
              Returns and refunds
            </Link>
            <Link
              className="text-primary-dark underline-offset-4 hover:underline"
              href="/contact"
            >
              Contact customer care
            </Link>
          </nav>
        </div>

        <address className="mt-6 not-italic text-sm leading-relaxed text-muted-foreground">
          MST Bazar customer care:{" "}
          <a
            className="text-primary-dark hover:underline"
            href="tel:+880123456789"
          >
            +880 1234 56789
          </a>
          <br />
          House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh
        </address>
      </section>
      <FaqSection />
    </main>
  );
}
