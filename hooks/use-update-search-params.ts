"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/** Updates URL filters. Any change returns the list to page 1 unless it sets page. */
export function useUpdateSearchParams() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (updates: Record<string, string | undefined | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");

      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });

      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    },
    [pathname, searchParams],
  );
}
