import Footer from "@/components/main/common/layout/app-footer";
import { Navbar } from "@/components/main/common/layout/Navbar";
import { CartProvider } from "@/context/cart-provider";
import { CatalogProvider } from "@/context/catalog-provider";
import { getAllCategories, getAllProducts } from "@/lib/data/catalog";

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
    <CatalogProvider categories={categories} products={products}>
      <CartProvider>
        <Navbar />
        {children}
        <Footer />
      </CartProvider>
    </CatalogProvider>
  );
}
