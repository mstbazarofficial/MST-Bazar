import { ProductDTO } from "@/lib/data/catalog";
import { ProductCard } from "../common/card/product-card";
import { SectionHeading, ViewAllLink } from "../common/layout/section-heading";

export function ComboProductsSection({ products }: { products: ProductDTO[] }) {
  return (
    <section id="combo-products" className="w-full site-container section-y">
      <SectionHeading
        rightElement={
          <ViewAllLink href="/products/combo-deals" title="View All" />
        }
        highlightPositions={[2, 3]}
        title="Exclusive Combo Deals"
      />

      {/* Product Grid: 2 cols on mobile -> 3 cols on sm -> 5 cols on lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
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
