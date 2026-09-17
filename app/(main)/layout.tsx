import Footer from "@/components/main/common/layout/app-footer";
import { SiteHeader } from "@/components/main/common/layout/app-header";
import { SITE_CONFIG } from "@/constants/site";
import { CartProvider } from "@/context/cart-provider";
import { CatalogProvider } from "@/context/catalog-provider";
import { QueryProvider } from "@/context/query-provider";
import { getAllCategories, getAllProducts } from "@/lib/data/catalog";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa";

export const metadata: Metadata = {
  title: {
    default: "MST Bazar | Fresh Grocery Products & Honey in Bangladesh",
    template: "%s | MST Bazar",
  },
  description:
    "Shop fresh grocery products, honey, black seed, oils, and combo deals from MST Bazar. Quality essentials delivered across Bangladesh.",
  keywords: [
    "MST Bazar",
    "Fresh Grocery Products",
    "Honey in Bangladesh",
    "Organic Products",
    "Combo Deals",
    "Quality Essentials",
    "Online Grocery Shopping",
    "Nationwide Delivery",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, products] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
  ]);
  const whatsappNumber = SITE_CONFIG.whatsapp;

  return (
    <QueryProvider>
      <CatalogProvider categories={categories} products={products}>
        <CartProvider>
          <SiteHeader />

          {children}
          <Footer />
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              title="Chat with us on WhatsApp"
              className="fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] sm:right-9 sm:bottom-9"
            >
              <span className="absolute inset-0 rounded-full bg-[#25D366]/70 motion-safe:animate-ping" />
              <FaWhatsapp className="relative size-8" aria-hidden="true" />
            </a>
          )}
          {process.env.NEXT_PUBLIC_ENVIRONVENT === "production" && (
            <GoogleAnalytics gaId="G-91TTFGEMY6" />
          )}
        </CartProvider>
      </CatalogProvider>
    </QueryProvider>
  );
}
