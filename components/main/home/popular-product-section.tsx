import { ProductDTO } from "@/lib/data/catalog";
import { ProductCard } from "../common/card/product-card";
import { SectionHeading, ViewAllLink } from "../common/layout/section-heading";

export function PopularProductsSection({
  products,
}: {
  products: ProductDTO[];
}) {
  return (
    // Full-bleed section using your theme's soft green accent background token
    <section id="featured" className="w-full bg-muted py-8 sm:py-12">
      <div className="site-container">
        <SectionHeading
          rightElement={
            <ViewAllLink href="/products/popular-products" title="View All" />
          }
          highlightPositions={[2]}
          title="Popular products"
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
