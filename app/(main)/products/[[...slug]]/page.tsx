import Testimonials from "@/components/main/common/Testimonials";
import ProductsHeader from "@/components/main/products/products-header";
import { ProductsPageClient } from "@/components/main/products/products-page-client";
import { getAllCategories, getAllProducts } from "@/lib/data/catalog";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const categories = await getAllCategories();

  return [
    {}, // /products
    ...categories.map((c) => ({
      slug: [c.slug],
    })),
  ];
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  const products = await getAllProducts();
  const categories = await getAllCategories();

  const existedCategory = slug
    ? categories.find((c) => c.slug === slug[0])
    : null;

  if (!existedCategory && slug?.length) {
    notFound();
  }

  const filteredProducts = slug
    ? products.filter((product) => product.category.slug === slug[0])
    : products;

  return (
    <main className="bg-muted">
      <ProductsHeader
        title={existedCategory ? existedCategory.name : "All Products"}
      />
      <ProductsPageClient products={filteredProducts} />
      <Testimonials />
    </main>
  );
}
