"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * A separate layout for checkout would remount CartProvider on the way in and
 * drop cart changes still waiting to sync, so the store chrome is hidden here.
 */
export function HideOnCheckout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return pathname.startsWith("/checkout") ? null : children;
}
