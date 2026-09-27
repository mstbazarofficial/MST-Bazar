import { CategoryDTO } from "@/lib/data/catalog";
import { CategoryCard3 } from "../common/card/category-card";
import { SectionHeading } from "../common/layout/section-heading";

export function CategorySection({ categories }: { categories: CategoryDTO[] }) {
  return (
    <section className="w-full site-container section-y">
      <SectionHeading highlightPositions={[3]} title="SHOP BY CATEGORIES" />

      <div
        className="grid gap-3 sm:gap-4 my-5 md:my-10 justify-center"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
        }}
      >
        {categories.map((category) => (
          <CategoryCard3 key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
