"use client";

import type { ProductSearchResult } from "@/lib/data/catalog";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 250;

async function fetchSearchResults(q: string): Promise<ProductSearchResult[]> {
  const response = await fetch(
    `/api/products/search?q=${encodeURIComponent(q)}`,
  );
  if (!response.ok) throw new Error("Product search failed");
  return response.json();
}

export function useProductSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trimmedQuery = query.trim();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(trimmedQuery), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [trimmedQuery]);

  const { data: results = [], isFetching } = useQuery({
    queryKey: ["product-search", debouncedQuery],
    queryFn: () => fetchSearchResults(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  const isSearching = isFetching || trimmedQuery !== debouncedQuery;

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

  return {
    query,
    setQuery,
    results,
    isSearching,
    isOpen,
    setIsOpen,
    containerRef,
  };
}
