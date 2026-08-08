import { CategoryDTO } from "@/lib/data/catalog";
import { CategoryCard } from "../common/card/category-card";
import HeadingStyle2 from "../common/HeadingStyle2";

export function CategorySection({ categories }: { categories: CategoryDTO[] }) {
  return (
    <section className="w-full site-container section-y">
      {/* Header Row */}
      <HeadingStyle2
        firstTitle="SHOP BY"
        secondTitle="Categories"
        link="/categories"
        position={5}
        isUnderLine={true}
      />

      {/* Grid Layout: Fills 2 cols on mobile, 3 on tablet, and 3-4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
