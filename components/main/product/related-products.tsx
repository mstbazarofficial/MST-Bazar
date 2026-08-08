import { ProductDTO } from "@/lib/data/catalog";
import Link from "next/link";
import { ProductCard } from "../common/card/product-card";
import HeadingStyle2 from "../common/HeadingStyle2";

export function RelatedProductsSection({
  products,
}: {
  products: ProductDTO[];
}) {
  return (
    <section className="w-full site-container section-y">
      {/* Section Header */}
      <div className="mb-4 sm:mb-6">
        <HeadingStyle2
          firstTitle="Related"
          secondTitle="Products"
          className="mb-5"
          link="/products"
        />
      </div>

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
