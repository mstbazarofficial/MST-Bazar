import { StatTile } from "@/components/admin/orders/order-info/order-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUnitPrice } from "@/utils/calculate-order-total";
import { formatDate } from "@/utils/format-date";
import { formatExactPrice } from "@/utils/format-price";
import {
  CirclePlus,
  Images,
  Package,
  RefreshCw,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import type { AdminProduct } from "./product-sidebar";

export function ProductOverview({
  product,
  sales,
}: {
  product: AdminProduct;
  sales?: { unitsSold: number; orderCount: number };
}) {
  const hasFeaturedImage = product.images.some((image) => image.isFeatured);

  const timeline = [
    { label: "Created", date: product.createdAt, icon: CirclePlus },
    { label: "Last updated", date: product.updatedAt, icon: RefreshCw },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile
          icon={Wallet}
          iconClass="bg-blue-500/15 text-blue-700 dark:text-blue-400"
          label="Selling price"
          value={formatExactPrice(
            getUnitPrice(product.price, product.discountPercentage),
          )}
        >
          {product.discountPercentage > 0
            ? `${product.discountPercentage}% off ${formatExactPrice(product.price)}`
            : "No discount"}
        </StatTile>
        <StatTile
          icon={Package}
          iconClass="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
          label="Units sold"
          value={sales ? String(sales.unitsSold) : "—"}
        >
          Excludes cancelled and returned
        </StatTile>
        <StatTile
          icon={ShoppingBag}
          iconClass="bg-violet-500/15 text-violet-700 dark:text-violet-400"
          label="Orders"
          value={sales ? String(sales.orderCount) : "—"}
        >
          Excludes cancelled and returned
        </StatTile>
        <StatTile
          icon={Images}
          iconClass="bg-amber-500/15 text-amber-700 dark:text-amber-400"
          label="Images"
          value={String(product.images.length)}
        >
          {hasFeaturedImage ? "Featured image set" : "No featured image"}
        </StatTile>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Short description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed wrap-break-word text-muted-foreground">
              {product.shortDescription || "No short description added yet."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {timeline.map(({ label, date, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl bg-muted/50 p-3"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(date)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
