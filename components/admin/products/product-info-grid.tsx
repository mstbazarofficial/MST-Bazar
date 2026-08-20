"use client";

import { Badge } from "@/components/ui/badge";
import { Check, CirclePlus, Copy, Flame, RefreshCw, Star } from "lucide-react";
import { useState } from "react";

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
  const [copied, setCopied] = useState(false);
  const finalPrice =
    product.price - (product.price * product.discountPercentage) / 100;

  const handleCopySlug = () => {
    navigator.clipboard.writeText(product.slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timelineItems = [
    { label: "Created", date: product.createdAt, icon: CirclePlus },
    { label: "Last updated", date: product.updatedAt, icon: RefreshCw },
  ];

  return (
    <div className="space-y-6">
      {/* Top Meta Attributes including Priority */}
      <div className="grid grid-cols-2 gap-4 border-b border-border/60 pb-4 sm:grid-cols-5">
        <div>
          <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            SKU
          </span>
          <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
            {product.sku ?? "—"}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Category
          </span>
          <p className="mt-0.5 text-sm font-medium text-foreground">
            {product.category?.name ?? "—"}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Brand
          </span>
          <p className="mt-0.5 text-sm font-medium text-foreground">
            {product.brand ?? "—"}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Unit
          </span>
          <p className="mt-0.5 text-sm font-medium text-foreground">
            {product.unit ?? "—"}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Priority
          </span>
          <div className="mt-0.5">
            <Badge variant="outline" className="font-mono text-xs">
              {product.priority ?? 0}
            </Badge>
          </div>
        </div>
      </div>

      {/* Pricing & Deals Highlights */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-muted/40 p-3.5 border border-border/40">
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(finalPrice)}
          </span>
          {product.discountPercentage > 0 && (
            <>
              <span className="text-sm font-medium text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </span>
              <Badge variant="destructive" className="px-1.5 py-0 text-xs">
                -{product.discountPercentage}%
              </Badge>
            </>
          )}
        </div>

        {/* Feature Badges */}
        <div className="flex items-center gap-2">
          {product.isBestDeal && (
            <Badge className="gap-1 bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400 border-amber-500/30">
              <Star className="size-3.5 fill-amber-500 text-amber-500" />
              Best Deal
            </Badge>
          )}
          {product.isPopular && (
            <Badge className="gap-1 bg-orange-500/15 text-orange-600 hover:bg-orange-500/20 dark:text-orange-400 border-orange-500/30">
              <Flame className="size-3.5 fill-orange-500 text-orange-500" />
              Popular
            </Badge>
          )}
          {!product.isBestDeal && !product.isPopular && (
            <span className="text-xs text-muted-foreground">Standard Item</span>
          )}
        </div>
      </div>

      {/* Technical Meta / Slug */}
      <div className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-xs">
        <span className="font-medium text-muted-foreground">URL Slug:</span>
        <button
          type="button"
          onClick={handleCopySlug}
          className="flex items-center gap-1.5 font-mono text-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <span>{product.slug}</span>
          {copied ? (
            <Check className="size-3.5 text-emerald-600" />
          ) : (
            <Copy className="size-3.5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Integrated Timeline */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Timeline
        </h2>
        <div className="space-y-4">
          {timelineItems.map(({ label, date, icon: Icon }, i) => (
            <div key={label} className="relative flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Icon className="size-3.5" />
                </span>
                {i === 0 && <span className="mt-1 h-full w-px bg-border" />}
              </div>
              <div className="pb-1">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">
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
