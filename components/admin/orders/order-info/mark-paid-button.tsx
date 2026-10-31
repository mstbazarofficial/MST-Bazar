"use client";

import {
  DeleteDialog,
  type DeleteDialogActionType,
} from "@/components/my-ui/delete-dialog";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format-price";
import { CheckCheck } from "lucide-react";

export function MarkPaidButton({
  amount,
  onMarkPaid,
  variant = "default",
  className,
}: {
  amount: number;
  onMarkPaid: () => DeleteDialogActionType;
  variant?: "default" | "outline";
  className?: string;
}) {
  return (
    <DeleteDialog
      title={`Mark ${formatPrice(amount)} as paid?`}
      description="This records the remaining amount as money received. Check the TrxID first."
      action={onMarkPaid}
      successMessage="Order marked as paid."
      errorMessage="Failed to mark the order as paid."
      confirmText="Mark as paid"
      loadingText="Saving..."
      confirmVariant="default"
    >
      <Button size="sm" variant={variant} className={className}>
        <CheckCheck className="size-3.5" />
        Mark as paid
      </Button>
    </DeleteDialog>
  );
}
