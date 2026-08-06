// src/components/admin/orders/order-stats-cards.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Clock, Package, Truck } from "lucide-react";

interface OrderStatsCardsProps {
  stats?: { total: number; pending: number; delivered: number };
  isLoading: boolean;
}

const CARD_CONFIG = [
  {
    key: "total" as const,
    label: "Total Orders",
    icon: Package,
    iconClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    key: "pending" as const,
    label: "Pending Orders",
    icon: Clock,
    iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    key: "delivered" as const,
    label: "Delivered Orders",
    icon: Truck,
    iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

export function OrderStatsCards({ stats, isLoading }: OrderStatsCardsProps) {
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
