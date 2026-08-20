// src/components/admin/orders/orders-table.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatus, PaymentMethod } from "@/generated/prisma/enums";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type OrderRow = {
  id: string;
  orderId: string; // e.g., "ORD-2026-0001"
  customerName: string;
  emailAddress: string;
  userAvatar: string | null;
  orderDate: Date;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
};

export function OrdersTable({
  orders,
  isLoading,
}: {
  orders: OrderRow[];
  isLoading: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-64">Customer</TableHead>
            <TableHead className="w-48 pl-4">Order ID</TableHead>

            <TableHead className="w-36">Date</TableHead>
            <TableHead className="w-32 text-right">Total Amount</TableHead>
            <TableHead className="w-32 text-center">Status</TableHead>
            <TableHead className="w-36 text-center pr-4">
              Payment Method
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && orders.length === 0 && <TableSkeletonRows />}

          {!isLoading && orders.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-muted-foreground"
              >
                No orders match these filters.
              </TableCell>
            </TableRow>
          )}

          {orders.map((order) => {
            return (
              <TableRow
                key={order.id}
                className="group relative hover:bg-muted/50 transition-colors"
              >
                {/* Customer Cell */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted border">
                      {order.userAvatar ? (
                        <Image
                          src={order.userAvatar}
                          alt={order.customerName}
                          width={36}
                          height={36}
                          className="size-full object-cover"
                        />
                      ) : (
                        <User className="size-4 text-muted-foreground" />
                      )}
                    </div>
                    {/* Name & Email */}
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground text-sm">
                        {order.customerName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {order.emailAddress}
                      </span>
                    </div>
                  </div>
                </TableCell>
                {/* Order ID Cell with Stretched Link */}
                <TableCell className="pl-4 font-medium">
                  <Link
                    href={`/admin/orders/${order.orderId}`}
                    className="text-foreground group-hover:text-primary transition-colors focus:outline-none after:absolute after:inset-0"
                  >
                    {order.orderId}
                  </Link>
                </TableCell>

                {/* Date Cell */}
                <TableCell className="text-muted-foreground text-sm">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(order.orderDate))}
                </TableCell>

                {/* Total Amount Cell */}
                <TableCell className="text-right font-medium whitespace-nowrap">
                  ৳ {Math.round(order.totalAmount).toLocaleString()}
                </TableCell>

                {/* Status Cell */}
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`border-transparent ${getStatusColor(order.status)}`}
                  >
                    {order.status.toUpperCase()}
                  </Badge>
                </TableCell>

                {/* Payment Method Cell */}
                <TableCell className="text-center pr-4">
                  <Badge
                    variant="outline"
                    className={`border-transparent ${getPaymentColor(order.paymentMethod)}`}
                  >
                    {order.paymentMethod.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// Helpers for dynamic badge colors
function getStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case "DELIVERED":
    case "SHIPPED":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
    case "PENDING":
    case "CONFIRMED":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
    case "PROCESSING":
      return "bg-blue-500/15 text-blue-700 dark:text-blue-400";
    case "CANCELLED":
      return "bg-red-500/15 text-red-700 dark:text-red-400";
    default:
      return "bg-gray-500/15 text-gray-700 dark:text-gray-400";
  }
}

function getPaymentColor(method: string) {
  switch (method.toUpperCase()) {
    case "CASH":
    case "COD":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
    case "CARD":
    case "STRIPE":
      return "bg-blue-500/15 text-blue-700 dark:text-blue-400";
    default:
      return "bg-gray-500/15 text-gray-700 dark:text-gray-400";
  }
}

function TableSkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {/* Order ID */}
          <TableCell className="pl-4">
            <Skeleton className="h-4 w-24" />
          </TableCell>
          {/* Customer */}
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </TableCell>
          {/* Date */}
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          {/* Total */}
          <TableCell className="text-right">
            <Skeleton className="ml-auto h-4 w-16" />
          </TableCell>
          {/* Status */}
          <TableCell className="text-center">
            <Skeleton className="mx-auto h-6 w-24 rounded-full" />
          </TableCell>
          {/* Payment */}
          <TableCell className="text-center pr-4">
            <Skeleton className="mx-auto h-6 w-20 rounded-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
