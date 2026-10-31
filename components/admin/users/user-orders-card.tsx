import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateOrderTotal } from "@/utils/calculate-order-total";
import { formatDate } from "@/utils/format-date";
import { formatPrice } from "@/utils/format-price";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { AdminUser } from "./user-sidebar";

export function UserOrdersCard({
  orders,
  title = "Orders",
  limit,
  onViewAll,
}: {
  orders: AdminUser["orders"];
  title?: string;
  limit?: number;
  onViewAll?: () => void;
}) {
  const visibleOrders = limit ? orders.slice(0, limit) : orders;

  return (
    <Card>
      <CardHeader>
        <div className="flex min-h-8 items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {onViewAll && orders.length > visibleOrders.length && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={onViewAll}
            >
              View all {orders.length}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {visibleOrders.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center text-muted-foreground">
            <ShoppingBag className="size-5" />
            <p className="text-sm">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.orderId}`}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {order.orderId}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatDate(order.orderDate)} · {order.orderItems.length}{" "}
                    {order.orderItems.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground tabular-nums">
                    {formatPrice(calculateOrderTotal(order).finalTotal)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
