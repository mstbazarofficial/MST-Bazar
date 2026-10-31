"use client";

import type { getFinanceOverview } from "@/actions/admin/finance-actions";
import { markOrderPaid } from "@/actions/admin/payment-mutations";
import { EmptyState } from "@/components/admin/layout/empty-state";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/format-date";
import { formatPaymentMethod } from "@/utils/format-payment-method";
import { formatPrice } from "@/utils/format-price";
import { AlertTriangle, CheckCheck, CircleCheck } from "lucide-react";
import Link from "next/link";

type UnpaidOrder = Awaited<
  ReturnType<typeof getFinanceOverview>
>["unpaidOrders"][number];

export function UnpaidOrdersCard({ orders }: { orders: UnpaidOrder[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Unpaid orders ({orders.length})
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          All open orders with money still to collect, oldest first
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {orders.length === 0 && (
          <EmptyState icon={CircleCheck} title="Every order is paid." />
        )}

        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-start justify-between gap-3 rounded-lg border border-border p-3.5"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/orders/${order.orderId}`}
                  className="font-mono text-sm font-semibold text-foreground hover:underline"
                >
                  {order.orderId}
                </Link>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-xs text-muted-foreground">
                {order.customerName} · {order.phoneNumber} ·{" "}
                {formatDate(order.orderDate)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPaymentMethod(order.paymentMethod)}
                {order.TrxID && ` · TrxID ${order.TrxID}`}
                {order.TrxNumber && ` · From ${order.TrxNumber}`}
              </p>
              {order.hasDuplicateTrxId && (
                <p className="flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="size-3.5" />
                  This TrxID is used on another order
                </p>
              )}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <p className="text-sm font-semibold text-foreground">
                {formatPrice(order.due)}
              </p>
              <DeleteDialog
                title={`Mark ${formatPrice(order.due)} as paid?`}
                description={`This records the amount for ${order.orderId} as money received. Check the TrxID first.`}
                action={() => markOrderPaid({ orderId: order.id })}
                successMessage="Order marked as paid."
                errorMessage="Failed to mark the order as paid."
                confirmText="Mark as paid"
                loadingText="Saving..."
                confirmVariant="default"
              >
                <Button size="sm" variant="outline">
                  <CheckCheck className="size-3.5" />
                  Mark as paid
                </Button>
              </DeleteDialog>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
