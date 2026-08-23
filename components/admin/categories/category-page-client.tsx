"use client";

import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  priority: number | null;
  image: string | null;
  _count: {
    products: number;
  };
};

export function CategoryPageClient({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  // Update input & URL parameters silently without triggering Next.js server navigation
  const handleSearch = (term: string) => {
    setSearch(term);

    const params = new URLSearchParams(window.location.search);
    if (term.trim()) {
      params.set("search", term.trim());
    } else {
      params.delete("search");
    }

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    window.history.replaceState(null, "", newUrl);
  };

  // Instant in-memory filtering
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return initialCategories;
    const query = search.toLowerCase().trim();
    return initialCategories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        cat.slug.toLowerCase().includes(query),
    );
  }, [initialCategories, search]);

  return (
    <div className="space-y-6">
      <div>
        <Input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full"
        />
      </div>

      <CategoriesTable categories={filteredCategories} />
    </div>
  );
}
