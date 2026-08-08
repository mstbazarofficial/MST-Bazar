import { ProductDTO } from "@/lib/data/catalog";
import Link from "next/link";
import { ProductCard } from "../common/card/product-card";
import HeadingStyle2 from "../common/HeadingStyle2";

export function PopularProductsSection({
  products,
}: {
  products: ProductDTO[];
}) {
  return (
    // Full-bleed section using your theme's soft green accent background token
    <section id="featured" className="w-full bg-accent/40 py-8 sm:py-12">
      <div className="site-container">
        {/* Header Row */}
        <HeadingStyle2
          firstTitle="Popular"
          secondTitle="Products"
          link="/products"
        />

        {/* Grid Layout: Desktop 5 Columns (10 items = 2 rows) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={`/product/${product.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
