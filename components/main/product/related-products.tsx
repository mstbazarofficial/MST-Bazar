import { ProductDTO } from "@/lib/data/catalog";
import Link from "next/link";
import { ProductCard } from "../common/card/product-card";

export function RelatedProductsSection({
  products,
}: {
  products: ProductDTO[];
}) {
  return (
    <section className="w-full site-container section-y">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
          Related Products
        </h2>

        <Link
          href="/products"
          className="text-xs sm:text-sm font-semibold text-primary hover:underline transition-all"
        >
          View All
        </Link>
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
