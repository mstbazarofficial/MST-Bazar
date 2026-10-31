import { calculateOrderTotal } from "@/utils/calculate-order-total";
import { formatExactPrice } from "@/utils/format-price";

import { ChevronRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  formatOrderDate,
  OrderListItem,
  OrderStatusBadge,
  PAYMENT_LABELS,
} from "./order-meta";

interface OrderListCardProps {
  order: OrderListItem;
}

export function OrderListCard({ order }: OrderListCardProps) {
  const total = calculateOrderTotal(order).finalTotal;
  const [firstItem, ...otherItems] = order.orderItems;

  return (
    <Link
      href={`/dashboard/orders/${order.orderId}`}
      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
    >
      <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
        {firstItem?.productImage ? (
          <Image
            src={firstItem.productImage}
            alt=""
            width={48}
            height={48}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Package className="size-4 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {firstItem?.productName ?? "Order"}
          {otherItems.length > 0 && (
            <span className="text-muted-foreground">
              {" "}
              + {otherItems.length} more
            </span>
          )}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {order.orderId} · {formatOrderDate(order.orderDate)} ·{" "}
          {PAYMENT_LABELS[order.orderPaymentMethod]}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-semibold text-foreground tabular-nums">
          {formatExactPrice(total)}
        </span>
        <OrderStatusBadge status={order.status} />
      </div>

      <ChevronRight className="hidden size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
    </Link>
  );
}
