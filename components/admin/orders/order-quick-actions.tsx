"use client";

import { updateOrderStatus } from "@/actions/admin/order-mutations";
import { markOrderPaid } from "@/actions/admin/payment-mutations";
import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { toast } from "@/components/ui/toast";
import { OrderStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format-price";
import { getErrorMessage } from "@/utils/get-error-message";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/utils/order-status";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCheck } from "lucide-react";
import { useState } from "react";
import type { OrderRow } from "./orders-table";

// A wrong tap on these changes income and promo limits, so they are confirmed.
const CONFIRM_MESSAGES: Partial<Record<OrderStatus, string>> = {
  CANCELLED:
    "Cash collected automatically on delivery leaves income, and any promo code use is returned.",
  RETURNED:
    "Cash collected automatically on delivery leaves income. The promo code use is kept.",
};

function useRefreshOrders() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-order-stats"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-order"] }),
    ]);
}

export function OrderStatusSelect({
  order,
  className,
}: {
  order: Pick<OrderRow, "id" | "orderId" | "status">;
  className?: string;
}) {
  const refreshOrders = useRefreshOrders();
  const [confirming, setConfirming] = useState<OrderStatus | null>(null);

  const { mutate, isPending, variables } = useMutation({
    mutationFn: async (status: OrderStatus) => {
      const res = await updateOrderStatus({
        orderId: order.id,
        input: { status },
      });

      if (!res.success) throw new Error(res.error);
    },
    // Returned, so the select holds the new value until the list has reloaded.
    onSuccess: () => {
      toast.add({ title: "Order status updated", type: "success" });
      return refreshOrders();
    },
    onError: (err: unknown) => {
      toast.add({
        type: "error",
        description: getErrorMessage(err),
        priority: "high",
      });
    },
  });

  const status = isPending ? variables : order.status;

  function handleChange(next: OrderStatus) {
    if (CONFIRM_MESSAGES[next]) setConfirming(next);
    else mutate(next);
  }

  return (
    <>
      <NativeSelect
        size="sm"
        wrapperClassName={className}
        aria-label={`Status of ${order.orderId}`}
        disabled={isPending}
        value={status}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        className={cn(
          "border-transparent text-xs font-medium",
          ORDER_STATUS_STYLES[status],
        )}
      >
        {Object.values(OrderStatus).map((value) => (
          <NativeSelectOption key={value} value={value}>
            {ORDER_STATUS_LABELS[value]}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <AlertDialog
        open={confirming !== null}
        onOpenChange={(open) => !open && setConfirming(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Mark {order.orderId} as{" "}
              {confirming && ORDER_STATUS_LABELS[confirming].toLowerCase()}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirming && CONFIRM_MESSAGES[confirming]}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep current status</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirming) mutate(confirming);
                setConfirming(null);
              }}
            >
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function OrderDueStatus({ order }: { order: OrderRow }) {
  const refreshOrders = useRefreshOrders();

  // Closed orders owe nothing, and a due of 0 on them does not mean paid.
  if (order.status === "CANCELLED" || order.status === "RETURNED") {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  if (order.due <= 0) {
    return (
      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
        Paid
      </span>
    );
  }

  // COD is recorded automatically when the order is delivered.
  const canMarkPaid =
    order.paymentMethod !== "CASH_ON_DELIVERY" || order.status === "DELIVERED";

  return (
    <div className="flex flex-col items-end gap-1.5">
      <span className="text-sm font-semibold whitespace-nowrap text-foreground">
        {formatPrice(order.due)}
      </span>

      {canMarkPaid && (
        <DeleteDialog
          title={`Mark ${formatPrice(order.due)} as paid?`}
          description={`This records the amount for ${order.orderId} as money received. ${
            order.TrxID ? `Check TrxID ${order.TrxID} first.` : ""
          }${order.hasDuplicateTrxId ? " This TrxID is used on another order." : ""}`}
          action={async () => {
            const res = await markOrderPaid({ orderId: order.id });
            if (res.success) await refreshOrders();
            return res;
          }}
          successMessage="Order marked as paid."
          errorMessage="Failed to mark the order as paid."
          confirmText="Mark as paid"
          loadingText="Saving..."
          confirmVariant="default"
        >
          <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
            <CheckCheck className="size-3.5" />
            Mark as paid
          </Button>
        </DeleteDialog>
      )}
    </div>
  );
}
