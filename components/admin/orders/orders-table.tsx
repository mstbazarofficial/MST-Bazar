// src/components/admin/orders/orders-table.tsx
"use client";

import {
  EmptyState,
  TableEmptyRow,
} from "@/components/admin/layout/empty-state";
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
import { formatDate } from "@/utils/format-date";
import { formatPaymentMethod } from "@/utils/format-payment-method";
import { formatPrice } from "@/utils/format-price";
import { ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { OrderDueStatus, OrderStatusSelect } from "./order-quick-actions";

export type OrderRow = {
  id: string;
  orderId: string; // e.g., "ORD-2026-0001"
  customerName: string;
  emailAddress: string | null;
  phoneNumber: string;
  userAvatar: string | null;
  orderDate: Date;
  totalAmount: number;
  due: number;
  promoCode: string | null;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  TrxID: string | null;
  hasDuplicateTrxId: boolean;
};

const EMPTY_MESSAGE = "No orders match these filters.";

export function OrdersTable({
  orders,
  isLoading,
}: {
  orders: OrderRow[];
  isLoading: boolean;
}) {
  return (
    <>
      {/* Phones and tablets: one card per order */}
      <div className="space-y-3 lg:hidden">
        {isLoading &&
          orders.length === 0 &&
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}

        {!isLoading && orders.length === 0 && (
          <EmptyState
            icon={ShoppingCart}
            title={EMPTY_MESSAGE}
            className="rounded-lg border bg-card"
          />
        )}

        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border bg-card lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-56 pl-4">Customer</TableHead>
              <TableHead className="w-44">Order ID</TableHead>
              <TableHead className="w-28">Date</TableHead>
              <TableHead className="w-28 text-right">Total</TableHead>
              <TableHead className="w-36 text-center">Status</TableHead>
              <TableHead className="w-32 text-center">Payment</TableHead>
              <TableHead className="w-32 pr-4 text-right">Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && orders.length === 0 && <TableSkeletonRows />}

            {!isLoading && orders.length === 0 && (
              <TableEmptyRow
                colSpan={7}
                icon={ShoppingCart}
                title={EMPTY_MESSAGE}
              />
            )}

            {orders.map((order) => (
              <TableRow
                key={order.id}
                className="group relative hover:bg-muted/50 transition-colors"
              >
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <OrderAvatar order={order} />
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground text-sm">
                        {order.customerName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {order.phoneNumber}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Stretched link, so the quick actions below sit above it */}
                <TableCell className="font-medium">
                  <Link
                    href={`/admin/orders/${order.orderId}`}
                    className="text-foreground group-hover:text-primary transition-colors focus:outline-none after:absolute after:inset-0"
                  >
                    {order.orderId}
                  </Link>
                </TableCell>

                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(order.orderDate)}
                </TableCell>

                <TableCell className="text-right font-medium whitespace-nowrap">
                  {formatPrice(order.totalAmount)}
                  {order.promoCode && (
                    <p className="mt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      {order.promoCode}
                    </p>
                  )}
                </TableCell>

                <TableCell>
                  <div className="relative z-10 flex justify-center">
                    <OrderStatusSelect order={order} />
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <PaymentMethodBadge order={order} />
                </TableCell>

                <TableCell className="pr-4 text-right">
                  <div className="relative z-10 flex justify-end">
                    <OrderDueStatus order={order} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function OrderCard({ order }: { order: OrderRow }) {
  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/admin/orders/${order.orderId}`}
            className="block truncate text-sm font-semibold text-foreground"
          >
            {order.customerName}
          </Link>
          <p className="truncate text-xs text-muted-foreground">
            {order.orderId} · {formatDate(order.orderDate)}
          </p>
          <p className="text-xs text-muted-foreground">{order.phoneNumber}</p>
        </div>

        <div className="shrink-0 text-right text-sm font-semibold whitespace-nowrap text-foreground">
          {formatPrice(order.totalAmount)}
          {order.promoCode && (
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              {order.promoCode}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t pt-3">
        <PaymentMethodBadge order={order} align="left" />
        <OrderStatusSelect order={order} />
      </div>

      <div className="flex items-start justify-between gap-3">
        <span className="text-xs text-muted-foreground">Due</span>
        <OrderDueStatus order={order} />
      </div>
    </div>
  );
}

function OrderAvatar({ order }: { order: OrderRow }) {
  return (
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
  );
}

function PaymentMethodBadge({
  order,
  align = "center",
}: {
  order: OrderRow;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <Badge
        variant="outline"
        className={`border-transparent ${getPaymentColor(order.paymentMethod)}`}
      >
        {formatPaymentMethod(order.paymentMethod)}
      </Badge>
      {order.hasDuplicateTrxId && (
        <p className="mt-1 text-[11px] font-semibold text-red-600 dark:text-red-400">
          Duplicate TrxID
        </p>
      )}
    </div>
  );
}

function getPaymentColor(method: string) {
  switch (method.toUpperCase()) {
    case "CASH_ON_DELIVERY":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
    case "CARD":
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
          {/* Customer */}
          <TableCell className="pl-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </TableCell>
          {/* Order ID */}
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          {/* Date */}
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          {/* Total */}
          <TableCell className="text-right">
            <Skeleton className="ml-auto h-4 w-16" />
          </TableCell>
          {/* Status */}
          <TableCell>
            <Skeleton className="mx-auto h-8 w-28 rounded-md" />
          </TableCell>
          {/* Payment */}
          <TableCell>
            <Skeleton className="mx-auto h-6 w-20 rounded-full" />
          </TableCell>
          {/* Due */}
          <TableCell className="pr-4">
            <Skeleton className="ml-auto h-4 w-16" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
