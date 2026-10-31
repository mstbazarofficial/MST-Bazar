import type { OrderStatus, PaymentMethod } from "@/generated/prisma/enums";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  CONFIRMED: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  PROCESSING: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
  SHIPPED: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
  DELIVERED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  RETURNED: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  CANCELLED: "bg-red-500/15 text-red-700 dark:text-red-400",
};

export const ORDER_FULFILMENT_STEPS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

// COD is recorded automatically when the order is delivered.
export function canMarkOrderPaid(order: {
  status: OrderStatus;
  orderPaymentMethod: PaymentMethod;
  due: number;
}) {
  return (
    order.due > 0 &&
    order.status !== "CANCELLED" &&
    order.status !== "RETURNED" &&
    (order.orderPaymentMethod !== "CASH_ON_DELIVERY" ||
      order.status === "DELIVERED")
  );
}
