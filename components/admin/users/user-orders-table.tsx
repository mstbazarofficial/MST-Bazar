import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/generated/prisma/browser";
import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";

interface OrderRow {
  id: string;
  orderId: string;
  status: OrderStatus;
  orderDate: Date;
  shippingCost: number;
  discount: number;
  orderItems: {
    price: number;
    quantity: number;
    discountPercentage: number;
  }[];
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

function getTotal(order: OrderRow) {
  const subtotal = order.orderItems.reduce(
    (s, i) => s + i.price * (1 - i.discountPercentage / 100) * i.quantity,
    0,
  );
  return subtotal + order.shippingCost - order.discount;
}

export function UserOrdersTable({ orders }: { orders: OrderRow[] }) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60 bg-muted/30">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Package className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Orders</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20">
                {["Order ID", "Date", "Items", "Total", "Status", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const s = STATUS_STYLES[order.status];
                return (
                  <tr
                    key={order.id}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-foreground whitespace-nowrap">
                      {order.orderId}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                      }).format(new Date(order.orderDate))}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {order.orderItems.length}
                    </td>
                    <td className="px-5 py-3 text-xs font-semibold text-foreground whitespace-nowrap">
                      ৳{getTotal(order).toFixed(2)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.className}`}
                      >
                        {s.label}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/orders/${order.orderId}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline whitespace-nowrap"
                      >
                        View
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
