"use client";

import type { CategoryDTO, ProductDTO } from "@/lib/data/catalog";
import { createContext, useContext, useMemo, type ReactNode } from "react";

type CatalogContextValue = {
  categories: CategoryDTO[];
  products: ProductDTO[];
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({
  categories,
  products,
  children,
}: CatalogContextValue & { children: ReactNode }) {
  // Re-derive only when the incoming server data actually changes identity
  const value = useMemo(
    () => ({ categories, products }),
    [categories, products],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error("useCatalog must be used within <CatalogProvider>");
  }
  return ctx;
}

export function useCategories() {
  return useCatalog().categories;
}

export function useProducts() {
  return useCatalog().products;
}

export function useProductsByCategory(categorySlug: string) {
  const { products, categories } = useCatalog();
  return useMemo(() => {
    const category = categories.find((c) => c.slug === categorySlug);
    if (!category) return [];
    return products.filter((p) => p.categoryId === category.id);
  }, [products, categories, categorySlug]);
}
