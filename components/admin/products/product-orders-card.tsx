import type { getAdminProductOrders } from "@/actions/admin/product-actions";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUnitPrice } from "@/utils/calculate-order-total";
import { formatDate } from "@/utils/format-date";
import { formatExactPrice } from "@/utils/format-price";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

type ProductOrders = Awaited<ReturnType<typeof getAdminProductOrders>>;

export function ProductOrdersCard({ orders }: { orders?: ProductOrders }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex min-h-8 items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">Orders</CardTitle>
          {orders && orders.total > orders.items.length && (
            <span className="text-xs text-muted-foreground">
              Latest {orders.items.length} of {orders.total}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!orders ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : orders.items.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center text-muted-foreground">
            <ShoppingBag className="size-5" />
            <p className="text-sm">No orders for this product yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.items.map(({ id, order, ...item }) => (
              <Link
                key={id}
                href={`/admin/orders/${order.orderId}`}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {order.orderId}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {order.customerName} · {formatDate(order.orderDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground tabular-nums">
                    {item.quantity} ×{" "}
                    {formatExactPrice(
                      getUnitPrice(item.price, item.discountPercentage),
                    )}
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
