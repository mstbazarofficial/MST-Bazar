import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { OrderStatus, PaymentMethod } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

import { ArrowRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OrderListItem {
  id: string;
  orderId: string;
  status: OrderStatus;
  orderPaymentMethod: PaymentMethod;
  shippingCost: number;
  discount: number;
  orderDate: Date;
  orderItems: {
    id: string;
    productName: string;
    productImage: string | null;
    quantity: number;
    price: number;
    discountPercentage: number;
  }[];
}

interface OrderListCardProps {
  order: OrderListItem;
}

const STATUS_STYLES: Record<OrderStatus, { label: string; className: string }> =
  {
    PENDING: {
      label: "Pending",
      className: "bg-amber-100 text-amber-700 border-amber-200",
    },
    CONFIRMED: {
      label: "Confirmed",
      className: "bg-sky-100 text-sky-700 border-sky-200",
    },
    PROCESSING: {
      label: "Processing",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    SHIPPED: {
      label: "Shipped",
      className: "bg-indigo-100 text-indigo-700 border-indigo-200",
    },
    DELIVERED: {
      label: "Delivered",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-100 text-red-700 border-red-200",
    },
    RETURNED: {
      label: "Returned",
      className: "bg-orange-100 text-orange-700 border-orange-200",
    },
  };

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CASH_ON_DELIVERY: "Cash on Delivery",
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  BANK_TRANSFER: "Bank Transfer",
  CARD: "Card",
  OTHER: "Other",
};

function getOrderTotal(order: OrderListItem): number {
  const itemsTotal = order.orderItems.reduce((sum, item) => {
    const discounted = item.price * (1 - item.discountPercentage / 100);
    return sum + discounted * item.quantity;
  }, 0);
  return itemsTotal + order.shippingCost - order.discount;
}

export function OrderListCard({ order }: OrderListCardProps) {
  const status = STATUS_STYLES[order.status];
  const total = getOrderTotal(order);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(order.orderDate));

  const previewItems = order.orderItems.slice(0, 3);
  const extraCount = order.orderItems.length - previewItems.length;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xs hover:shadow-sm transition-shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-2 min-w-0">
          <Package className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate">
            {order.orderId}
          </span>
        </div>
        <Badge
          variant="outline"
          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${status.className}`}
        >
          {status.label}
        </Badge>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex items-center gap-4">
        {/* Item image previews */}
        <div className="flex -space-x-2 shrink-0">
          {previewItems.map((item) =>
            item.productImage ? (
              <div
                key={item.id}
                className="h-11 w-11 rounded-xl border-2 border-card overflow-hidden bg-muted shadow-xs"
              >
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div
                key={item.id}
                className="h-11 w-11 rounded-xl border-2 border-card bg-primary/10 flex items-center justify-center shadow-xs"
              >
                <Package className="h-4 w-4 text-primary/50" />
              </div>
            ),
          )}
          {extraCount > 0 && (
            <div className="h-11 w-11 rounded-xl border-2 border-card bg-muted flex items-center justify-center shadow-xs">
              <span className="text-[10px] font-bold text-muted-foreground">
                +{extraCount}
              </span>
            </div>
          )}
        </div>

        {/* Order meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight truncate">
            {order.orderItems.length === 1
              ? order.orderItems[0].productName
              : `${order.orderItems.length} items`}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formattedDate} · {PAYMENT_LABELS[order.orderPaymentMethod]}
          </p>
        </div>

        {/* Total + CTA */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-sm font-bold text-foreground">
            ৳{total.toFixed(2)}
          </span>
          <Link
            href={`/dashboard/orders/${order.orderId}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-xl text-xs font-semibold h-7 px-3",
            )}
          >
            Details
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
