import Footer from "@/components/main/common/layout/app-footer";
import { Navbar } from "@/components/main/common/layout/Navbar";
import { CartProvider } from "@/context/cart-provider";
import { CatalogProvider } from "@/context/catalog-provider";
import { QueryProvider } from "@/context/query-provider";
import { getAllCategories, getAllProducts } from "@/lib/data/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "MST Bazar | Online Grocery Store in Bangladesh",
    template: "%s | MST Bazar",
  },
  description:
    "Your trusted online grocery store in Bangladesh. Fresh, natural, and healthy products delivered straight to your doorstep.",
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
  return (
    <QueryProvider>
      <CatalogProvider categories={categories} products={products}>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </CatalogProvider>
    </QueryProvider>
  );
}
