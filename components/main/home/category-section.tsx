import { CategoryDTO } from "@/lib/data/catalog";
import Link from "next/link";
import { CategoryCard } from "../common/card/category-card";

export function CategorySection({ categories }: { categories: CategoryDTO[] }) {
  return (
    <section className="w-full site-container section-y">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
          Shop by Category
        </h2>
        <Link
          href="/categories/products"
          className="text-xs sm:text-sm font-semibold text-primary hover:underline transition-all"
        >
          View All
        </Link>
      </div>

      {/* Grid Layout: Fills 2 cols on mobile, 3 on tablet, and 3-4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
