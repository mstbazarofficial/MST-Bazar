"use client";

import { EmptyState } from "@/components/admin/layout/empty-state";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OrderStatus } from "@/generated/prisma/enums";
import { formatDateTime } from "@/utils/format-date";
import { formatPrice } from "@/utils/format-price";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type RecentOrder = {
  orderId: string;
  customerName: string;
  status: OrderStatus;
  totalAmount: number;
  itemsCount: number;
  orderDate: Date | string;
};

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
        <EmptyState icon={ShoppingCart} title="No orders yet." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-t border-border/60 hover:bg-transparent">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                CUSTOMER
              </TableHead>
              <TableHead className="hidden text-xs font-bold uppercase tracking-wider text-muted-foreground sm:table-cell">
                ITEMS
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                AMOUNT
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                STATUS
              </TableHead>
              <TableHead className="hidden text-xs font-bold uppercase tracking-wider text-muted-foreground sm:table-cell">
                DATE
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.orderId}
                onClick={() => router.push(`/admin/orders/${order.orderId}`)}
                className="cursor-pointer transition-colors hover:bg-muted/50"
              >
                <TableCell className="font-semibold text-foreground">
                  {order.customerName}
                </TableCell>
                <TableCell className="hidden text-sm font-medium text-foreground sm:table-cell">
                  {order.itemsCount}
                </TableCell>
                <TableCell className="font-bold whitespace-nowrap text-foreground tabular-nums">
                  {formatPrice(order.totalAmount)}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="hidden text-xs whitespace-nowrap text-muted-foreground sm:table-cell">
                  {formatDateTime(order.orderDate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
