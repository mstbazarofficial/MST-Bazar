import { OrderStatus, PaymentMethod } from "@/generated/prisma/enums";

export interface OrderListItem {
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

export const ORDER_LIST_SELECT = {
  id: true,
  orderId: true,
  status: true,
  orderPaymentMethod: true,
  shippingCost: true,
  discount: true,
  orderDate: true,
  orderItems: {
    select: {
      id: true,
      productName: true,
      productImage: true,
      quantity: true,
      price: true,
      discountPercentage: true,
    },
  },
} as const;

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
];

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CASH_ON_DELIVERY: "Cash on Delivery",
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  BANK_TRANSFER: "Bank Transfer",
  CARD: "Card",
  OTHER: "Other",
};

const STATUS_STYLES: Record<OrderStatus, { label: string; dot: string }> = {
  PENDING: { label: "Pending", dot: "bg-amber-500" },
  CONFIRMED: { label: "Confirmed", dot: "bg-blue-500" },
  PROCESSING: { label: "Processing", dot: "bg-blue-500" },
  SHIPPED: { label: "Shipped", dot: "bg-blue-500" },
  DELIVERED: { label: "Delivered", dot: "bg-primary" },
  CANCELLED: { label: "Cancelled", dot: "bg-red-500" },
  RETURNED: { label: "Returned", dot: "bg-orange-500" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, dot } = STATUS_STYLES[status];

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
      <span className={`size-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

// Fixed time zone so the server and the browser render the same date
export function formatOrderDate(
  date: Date,
  dateStyle: "medium" | "long" = "medium",
) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle,
    timeZone: "Asia/Dhaka",
  }).format(new Date(date));
}
