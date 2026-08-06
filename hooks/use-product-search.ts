"use client";

import { useProducts } from "@/context/catalog-provider";
import { useEffect, useMemo, useRef, useState } from "react";

export function useProductSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const products = useProducts();
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.trim().toLowerCase();

    return products
      .filter((p) => p.title.toLowerCase().includes(q))
      .slice(0, 5);
  }, [products, query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return { query, setQuery, results, isOpen, setIsOpen, containerRef };
}
