import { ProductDTO } from "@/lib/data/catalog";
import Link from "next/link";
import { ProductCard } from "../common/card/product-card";
import HeadingStyle2 from "../common/HeadingStyle2";

export function BestDealsSection({ products }: { products: ProductDTO[] }) {
  return (
    <section id="best-deals" className="w-full site-container section-y">
      {/* Section Header */}
      <HeadingStyle2
        firstTitle="Best Deals"
        secondTitle="For You"
        link="/deals"
      />

      {/* Product Grid: 2 cols on mobile -> 3 cols on sm -> 6 cols on lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            href={`/product/${product.slug}`}
          />
        ))}
      </div>
    </section>
  );
}
