import { ProductDTO } from "@/lib/data/catalog";
import { ProductCard } from "../common/card/product-card";
import { SectionHeading } from "../common/layout/section-heading";

export function RelatedProductsSection({
  products,
}: {
  products: ProductDTO[];
}) {
  return (
    <section className="w-full site-container section-y">
      <SectionHeading highlightPositions={[2]} title="Related Products" />

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
