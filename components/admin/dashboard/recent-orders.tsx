"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "RETURNED";

export type RecentOrder = {
  orderId: string;
  customerName: string;
  status: OrderStatus;
  productCost: number | null;
  itemsCount?: number;
  orderDate: Date | string;
};

const statusStyles: Record<OrderStatus, { label: string; className: string }> =
  {
    PENDING: {
      label: "Pending",
      className:
        "bg-amber-100 text-amber-700 hover:bg-amber-100 border-none dark:bg-amber-950/50 dark:text-amber-400",
    },
    CONFIRMED: {
      label: "Confirmed",
      className:
        "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none dark:bg-blue-950/50 dark:text-blue-400",
    },
    PROCESSING: {
      label: "Processing",
      className:
        "bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none dark:bg-indigo-950/50 dark:text-indigo-400",
    },
    SHIPPED: {
      label: "Shipped",
      className:
        "bg-purple-100 text-purple-700 hover:bg-purple-100 border-none dark:bg-purple-950/50 dark:text-purple-400",
    },
    DELIVERED: {
      label: "Delivered",
      className:
        "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none dark:bg-emerald-950/50 dark:text-emerald-400",
    },
    CANCELLED: {
      label: "Cancelled",
      className:
        "bg-rose-100 text-rose-700 hover:bg-rose-100 border-none dark:bg-rose-950/50 dark:text-rose-400",
    },
    RETURNED: {
      label: "Returned",
      className:
        "bg-rose-100 text-rose-700 hover:bg-rose-100 border-none dark:bg-rose-950/50 dark:text-rose-400",
    },
  };

function formatDate(dateInput: Date | string): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-border/60 bg-card">
      <div className="flex items-center justify-between p-4 pb-3">
        <h3 className="text-base font-bold text-foreground">Recent Orders</h3>
        <Link
          href="/admin/orders"
          className="text-xs font-semibold text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-500"
        >
          View all &rarr;
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="p-6 text-center text-sm text-muted-foreground">
          No orders yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-t border-border/60 hover:bg-transparent">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                CUSTOMER
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                ITEMS
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                AMOUNT
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                STATUS
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                DATE
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusConfig = statusStyles[order.status] ?? {
                label: order.status,
                className: "bg-muted text-muted-foreground",
              };

              return (
                <TableRow
                  key={order.orderId}
                  onClick={() => router.push(`/admin/orders/${order.orderId}`)}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-semibold text-foreground">
                    {order.customerName}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-foreground">
                    {order.itemsCount ?? 1}
                  </TableCell>
                  <TableCell className="font-bold text-foreground tabular-nums">
                    ৳{(order.productCost ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-full px-3 py-0.5 text-xs font-medium shadow-none ${statusConfig.className}`}
                    >
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(order.orderDate)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
