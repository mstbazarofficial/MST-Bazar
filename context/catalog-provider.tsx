"use client";

import type { CategoryDTO } from "@/lib/data/catalog";
import { createContext, useContext, type ReactNode } from "react";

const CatalogContext = createContext<CategoryDTO[] | null>(null);

export function CatalogProvider({
  categories,
  children,
}: {
  categories: CategoryDTO[];
  children: ReactNode;
}) {
  return (
    <CatalogContext.Provider value={categories}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCategories() {
  const categories = useContext(CatalogContext);
  if (!categories) {
    throw new Error("useCategories must be used within <CatalogProvider>");
  }
  return categories;
}
