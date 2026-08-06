import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateOrderTotal } from "@/utils/calculate-order-total";
import { formatPrice } from "@/utils/format-price";
import { Pencil, TrendingUp } from "lucide-react";

type CostInput = {
  orderItems: { price: number; quantity: number; discountPercentage: number }[];
  discount: number;
  shippingCost: number;
  productCost: number | null;
  deliveryCost: number | null;
};

export function CostManagementCard({
  order,
  onEditClick,
}: {
  order: CostInput;
  onEditClick: () => void;
}) {
  const finalTotal = calculateOrderTotal(order).finalTotal;
  const totalCost = (order.productCost ?? 0) + (order.deliveryCost ?? 0);
  const profit = finalTotal - totalCost;
  const profitMargin =
    finalTotal > 0 ? ((profit / finalTotal) * 100).toFixed(1) : "0";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <TrendingUp className="size-4" />
            Cost & Revenue
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onEditClick}>
            <Pencil className="size-3.5" />
            Edit
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Product Cost</span>
            <span className="text-foreground">
              {order.productCost != null
                ? formatPrice(order.productCost)
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Delivery Cost</span>
            <span className="text-foreground">
              {order.deliveryCost != null
                ? formatPrice(order.deliveryCost)
                : "N/A"}
            </span>
          </div>
          <div className="my-2 h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Cost</span>
            <span className="font-medium text-foreground">
              {formatPrice(totalCost)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Revenue</span>
            <span className="text-foreground">{formatPrice(finalTotal)}</span>
          </div>
        </div>

        <div className="rounded-lg bg-emerald-500/10 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Profit
            </span>
            <div className="text-right">
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                {formatPrice(profit)}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                {profitMargin}% margin
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
