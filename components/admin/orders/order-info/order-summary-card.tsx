import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateOrderTotal } from "@/utils/calculate-order-total";
import { formatPrice } from "@/utils/format-price";
import { Calculator, Pencil } from "lucide-react";

type OrderSummaryInput = {
  orderItems: { price: number; quantity: number; discountPercentage: number }[];
  discount: number;
  shippingCost: number;
};

export function OrderSummaryCard({
  order,
  onEditClick,
}: {
  order: OrderSummaryInput;
  onEditClick: () => void;
}) {
  const total = calculateOrderTotal(order);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Calculator className="size-4" />
            Order Summary
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onEditClick}>
            <Pencil className="size-3.5" />
            Edit
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        {/* 1. Items Subtotal */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items Subtotal</span>
          <span className="text-foreground font-medium">
            {formatPrice(total.itemsSubtotal)}
          </span>
        </div>

        {/* 2. Shipping Cost */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping Cost</span>
          <span className="text-foreground font-medium">
            {formatPrice(order.shippingCost)}
          </span>
        </div>

        {/* 3. Order Discount */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Discount</span>
          <span className="text-emerald-600 font-medium dark:text-emerald-400">
            -{formatPrice(total.discountAmount)}
          </span>
        </div>

        <div className="my-3 h-px bg-border" />

        {/* 4. Final Total */}
        <div className="flex justify-between text-lg font-semibold">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">
            {formatPrice(total.finalTotal)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
