import { CategoryDTO } from "@/lib/data/catalog";
import { CategoryCard3 } from "../common/card/category-card";
import { SectionHeading } from "../common/layout/section-heading";

export function CategorySection({ categories }: { categories: CategoryDTO[] }) {
  return (
    <section className="w-full site-container section-y ">
      <SectionHeading highlightPositions={[3]} title="SHOP BY CATEGORIES" />

      {/* Grid Layout: Fills 2 cols on mobile, 3 on tablet, and 3-4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 my-5 md:my-10">
        {categories.map((category) => (
          <CategoryCard3 key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
