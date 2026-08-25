import { ProductDTO } from "@/lib/data/catalog";
import { TopSellingProductCard } from "../common/card/top-selling-product-card";
import { SectionHeading, ViewAllLink } from "../common/layout/section-heading";

export function TopSellingSection({ products }: { products: ProductDTO[] }) {
  return (
    <section
      id="top-selling"
      className="w-full site-container section-y bg-muted"
    >
      <SectionHeading
        rightElement={
          <ViewAllLink href="/products/top-selling" title="View All" />
        }
        highlightPositions={[3]}
        title="Top Selling Products"
      />

      {/* Featured Grid: 1 col on XS -> 2 cols on SM -> 4 cols on LG */}
      <div className="grid grid-cols-2 sm:grid-cols-2  gap-4 sm:gap-6">
        {products.map((product) => (
          <TopSellingProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
