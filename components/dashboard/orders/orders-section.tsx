"use client";

import { PageHeading, Panel } from "@/components/dashboard/layout/dashboard-panel";
import { OrderStatus } from "@/generated/prisma/enums";
import { useState } from "react";
import { EmptyOrders } from "./empty-orders";
import { OrderListCard } from "./order-list-card";
import { OrderListItem } from "./order-meta";

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
      <PageHeading
        title="Orders"
        description={`${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
      />

      <Panel>
        {orders.length > 0 && (
          <div className="flex flex-wrap gap-x-5 border-b border-border px-5">
            {STATUS_FILTERS.map((f) => {
              const count =
                f.value === "ALL"
                  ? orders.length
                  : orders.filter((o) => o.status === f.value).length;

              if (f.value !== "ALL" && count === 0) return null;

              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setActiveFilter(f.value)}
                  aria-pressed={activeFilter === f.value}
                  className={`-mb-px shrink-0 border-b-2 py-3 text-sm font-medium transition-colors ${
                    activeFilter === f.value
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                  <span className="ml-1.5 text-xs text-muted-foreground tabular-nums">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((order) => (
              <OrderListCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
