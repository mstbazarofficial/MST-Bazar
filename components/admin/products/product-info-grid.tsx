"use client";

import { Badge } from "@/components/ui/badge";
import { CirclePlus, Flame, Layers, RefreshCw, Star } from "lucide-react";

type ProductInfoGridProps = {
  product: {
    sku: string | null;
    brand: string | null;
    category: {
      name: string;
    };
    unit: string | null;
    price: number;
    discountPercentage: number;
    isBestDeal: boolean;
    isPopular: boolean;
    isCombo: boolean;
    slug: string;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
  };
};

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function ProductInfoGrid({ product }: ProductInfoGridProps) {
  const finalPrice =
    product.price - (product.price * product.discountPercentage) / 100;

  const timelineItems = [
    { label: "Created", date: product.createdAt, icon: CirclePlus },
    { label: "Last updated", date: product.updatedAt, icon: RefreshCw },
  ];

  const hasFlags = product.isBestDeal || product.isPopular || product.isCombo;

  return (
    <div className="space-y-5">
      {/* Price & Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 p-4">
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(finalPrice)}
          </span>
          {product.discountPercentage > 0 && (
            <>
              <span className="text-sm font-medium text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </span>
              <Badge
                variant="destructive"
                className="px-1.5 py-0 text-xs font-bold"
              >
                -{product.discountPercentage}%
              </Badge>
            </>
          )}
        </div>

        {/* Product Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {product.isCombo && (
            <Badge className="gap-1 border-purple-500/30 bg-purple-500/10 text-purple-600 hover:bg-purple-500/15 dark:text-purple-400">
              <Layers className="size-3.5 text-purple-500" />
              Combo Pack
            </Badge>
          )}
          {product.isBestDeal && (
            <Badge className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 dark:text-amber-400">
              <Star className="size-3.5 fill-amber-500 text-amber-500" />
              Best Deal
            </Badge>
          )}
          {product.isPopular && (
            <Badge className="gap-1 border-orange-500/30 bg-orange-500/10 text-orange-600 hover:bg-orange-500/15 dark:text-orange-400">
              <Flame className="size-3.5 fill-orange-500 text-orange-500" />
              Popular
            </Badge>
          )}
          {!hasFlags && (
            <span className="text-xs text-muted-foreground">
              Standard Product
            </span>
          )}
        </div>
      </div>

      {/* Main Admin Meta Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border/50 bg-card p-3">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            SKU
          </span>
          <p className="mt-1 font-mono text-xs font-bold text-foreground">
            {product.sku ?? "—"}
          </p>
        </div>

        <div className="rounded-lg border border-border/50 bg-card p-3">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Category
          </span>
          <p className="mt-1 truncate text-xs font-semibold text-foreground">
            {product.category?.name ?? "—"}
          </p>
        </div>

        <div className="rounded-lg border border-border/50 bg-card p-3">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Brand
          </span>
          <p className="mt-1 truncate text-xs font-semibold text-foreground">
            {product.brand ?? "—"}
          </p>
        </div>

        <div className="rounded-lg border border-border/50 bg-card p-3">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Unit
          </span>
          <p className="mt-1 text-xs font-semibold text-foreground">
            {product.unit ?? "—"}
          </p>
        </div>

        <div className="rounded-lg border border-border/50 bg-card p-3">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Priority
          </span>
          <div className="mt-1">
            <Badge
              variant="outline"
              className="font-mono text-[11px] font-semibold"
            >
              {product.priority ?? 0}
            </Badge>
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-card p-3">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            URL Slug
          </span>
          <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
            {product.slug}
          </p>
        </div>
      </div>

      {/* Integrated Timeline */}
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          System Activity
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {timelineItems.map(({ label, date, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {formatDateTime(date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
