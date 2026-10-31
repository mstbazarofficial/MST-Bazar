"use client";

import AdminCategoriesSkeleton from "@/app/(admin)/admin/categories/skeleton";
import { CategoriesPageHeader } from "@/components/admin/categories/categories-page-header";
import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { Input } from "@/components/ui/input";
import { adminFetch } from "@/lib/admin-fetch";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export function CategoryPageClient() {
  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => adminFetch("categories"),
  });

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
    const all = categories ?? [];
    if (!search.trim()) return all;
    const query = search.toLowerCase().trim();
    return all.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        cat.slug.toLowerCase().includes(query),
    );
  }, [categories, search]);

  if (!categories) return <AdminCategoriesSkeleton />;

  return (
    <>
      <CategoriesPageHeader />
      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full bg-card"
            />
          </div>

          <CategoriesTable categories={filteredCategories} />
        </div>
      </main>
    </>
  );
}
