// src/components/admin/products/product-stats-cards.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Box, CheckCircle2, Star } from "lucide-react";

interface ProductStatsCardsProps {
  stats?: { total: number; active: number; bestDeal: number };
  isLoading: boolean;
}

const CARD_CONFIG = [
  {
    key: "total" as const,
    label: "Total Products",
    icon: Box,
    iconClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    key: "active" as const,
    label: "Active Products",
    icon: CheckCircle2,
    iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "bestDeal" as const,
    label: "Best Deal Products",
    icon: Star,
    iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

export function ProductStatsCards({
  stats,
  isLoading,
}: ProductStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {CARD_CONFIG.map(({ key, label, icon: Icon, iconClass }) => (
        <div
          key={key}
          className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm"
        >
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            {isLoading || !stats ? (
              <Skeleton className="mt-1.5 h-7 w-12" />
            ) : (
              <p className="mt-1 text-2xl font-semibold">{stats[key]}</p>
            )}
          </div>
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              iconClass,
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>
      ))}
    </div>
  );
}
