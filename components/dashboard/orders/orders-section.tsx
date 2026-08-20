"use client";

import { OrderStatus, PaymentMethod } from "@/generated/prisma/enums";
import { PackageOpen } from "lucide-react";
import { useState } from "react";
import { OrderListCard } from "./order-list-card";

// Re-use the same type — you can move this to a shared types file
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

const STATUS_FILTERS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Returned", value: "RETURNED" },
];

interface OrdersSectionProps {
  orders: OrderListItem[];
}

export function OrdersSection({ orders }: OrdersSectionProps) {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "ALL">("ALL");

  const filtered =
    activeFilter === "ALL"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">My Orders</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {orders.length} order{orders.length !== 1 ? "s" : ""} placed
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => {
          const count =
            f.value === "ALL"
              ? orders.length
              : orders.filter((o) => o.status === f.value).length;

          if (f.value !== "ALL" && count === 0) return null;

          return (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                activeFilter === f.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {f.label}
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeFilter === f.value
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Order list */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl py-16 flex flex-col items-center gap-3 text-center">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
            <PackageOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              No orders here
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeFilter === "ALL"
                ? "You haven't placed any orders yet."
                : `No ${activeFilter.toLowerCase()} orders found.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderListCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
