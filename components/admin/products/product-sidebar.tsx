"use client";

import type { getAdminProductBySlug } from "@/actions/admin/product-actions";
import {
  Property,
  RailSection,
} from "@/components/admin/orders/order-info/order-sidebar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getUnitPrice } from "@/utils/calculate-order-total";
import { formatDateTime } from "@/utils/format-date";
import { formatExactPrice } from "@/utils/format-price";
import {
  ExternalLink,
  Flame,
  Layers,
  Package,
  Pencil,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { ProductImageGallery } from "./product-image-gallery";

export type AdminProduct = NonNullable<
  Awaited<ReturnType<typeof getAdminProductBySlug>>
>;

function getListingFlags(product: AdminProduct) {
  return [
    {
      active: product.isCombo,
      label: "Combo Pack",
      icon: Layers,
      className: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
    },
    {
      active: product.isBestDeal,
      label: "Best Deal",
      icon: Star,
      className: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    },
    {
      active: product.isTopSelling,
      label: "Top Selling",
      icon: TrendingUp,
      className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    },
    {
      active: product.isPopular,
      label: "Popular",
      icon: Flame,
      className: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
    },
  ].filter((flag) => flag.active);
}

export function ProductSidebar({ product }: { product: AdminProduct }) {
  const flags = getListingFlags(product);
  const finalPrice = getUnitPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <aside className="scrollbar-slim shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:w-88 lg:overflow-y-auto xl:w-96">
      <div className="p-4">
        <ProductImageGallery images={product.images} />
      </div>

      <div className="space-y-4 border-t border-border p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
              <Package className="size-3.5" />
              Product
            </p>
            <Badge
              variant="outline"
              className={cn(
                "border-transparent",
                product.isAvailable
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-500/15 text-red-700 dark:text-red-400",
              )}
            >
              {product.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
          <h2 className="mt-2 text-xl font-semibold wrap-break-word text-foreground">
            {product.title}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {product.category.name}
            {product.unit && ` · ${product.unit}`}
          </p>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-2xl font-bold text-foreground tabular-nums">
            {formatExactPrice(finalPrice)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-muted-foreground line-through tabular-nums">
                {formatExactPrice(product.price)}
              </span>
              <Badge variant="destructive" className="text-xs font-bold">
                -{product.discountPercentage}%
              </Badge>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/admin/products/${product.slug}/edit`}
            className={buttonVariants({ size: "sm" })}
          >
            <Pencil className="size-3.5" />
            Edit
          </Link>
          <a
            href={`/product/${product.slug}`}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            <ExternalLink className="size-3.5" />
            View in store
          </a>
        </div>
      </div>

      <RailSection title="Listing">
        {flags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {flags.map(({ label, icon: Icon, className }) => (
              <Badge
                key={label}
                variant="outline"
                className={cn("gap-1 border-transparent", className)}
              >
                <Icon className="size-3.5" />
                {label}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Standard product</p>
        )}
      </RailSection>

      <RailSection title="Details">
        <dl className="grid grid-cols-2 gap-3">
          <Property
            label="SKU"
            value={product.sku ?? "—"}
            copyLabel={product.sku ? "SKU" : undefined}
            mono
          />
          <Property label="Brand" value={product.brand ?? "—"} />
          <Property label="Unit" value={product.unit ?? "—"} />
          <Property label="Priority" value={String(product.priority)} />
          <div className="col-span-2">
            <Property
              label="URL slug"
              value={product.slug}
              copyLabel="URL slug"
              mono
            />
          </div>
        </dl>
      </RailSection>

      <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        Last updated {formatDateTime(product.updatedAt)}
      </p>
    </aside>
  );
}
