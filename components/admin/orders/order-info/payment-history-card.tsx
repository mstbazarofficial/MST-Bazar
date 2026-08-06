"use client";

import {
  DeleteDialog,
  type DeleteDialogActionType,
} from "@/components/my-ui/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PaymentMethod } from "@/generated/prisma/enums";
import { formatPrice } from "@/utils/format-price";
import {
  Banknote,
  CircleDollarSign,
  CreditCard,
  HelpCircle,
  Pencil,
  Plus,
  Smartphone,
  Trash2,
} from "lucide-react";
import type { ElementType } from "react";

const methodConfig: Record<
  PaymentMethod,
  { label: string; icon: ElementType }
> = {
  CASH_ON_DELIVERY: { label: "Cash on Delivery", icon: Banknote },
  BANK_TRANSFER: { label: "Bank Transfer", icon: CreditCard },
  CARD: { label: "Card", icon: CreditCard },
  BKASH: { label: "BKASH", icon: Smartphone },
  NAGAD: { label: "NAGAD", icon: Smartphone },
  ROCKET: { label: "ROCKET", icon: Smartphone },
  OTHER: { label: "Other", icon: HelpCircle },
};

type Payment = {
  id: string;
  amount: number;
  method: PaymentMethod;
  date: Date;
  note: string | null;
};

export function PaymentHistoryCard({
  payments,
  finalTotal,
  onAdd,
  onEdit,
  onDelete,
}: {
  payments: Payment[];
  finalTotal: number;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => DeleteDialogActionType;
}) {
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = finalTotal - paidAmount;
  const progressPercent = finalTotal > 0 ? (paidAmount / finalTotal) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <CircleDollarSign className="size-4" />
            Payment History
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onAdd}>
            <Plus className="size-3.5" />
            Add Payment
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Summary */}
        <div className="space-y-2 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Payment Progress</span>
            <span className="font-medium text-foreground">
              {progressPercent.toFixed(0)}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              {formatPrice(paidAmount)} paid
            </span>
            <span className="text-muted-foreground">
              {formatPrice(Math.max(remainingAmount, 0))} remaining
            </span>
          </div>
        </div>

        {/* Payment Items List */}
        <div className="space-y-3">
          {payments.map((payment) => {
            const config = methodConfig[payment.method];
            const Icon = config.icon;
            return (
              <div
                key={payment.id}
                className="flex items-start gap-3 rounded-lg border border-border p-3.5 transition-colors hover:border-border/80"
              >
                {/* Method Icon */}
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <Icon className="size-4" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {formatPrice(payment.amount)}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[11px] font-normal px-2 py-0 h-5"
                    >
                      {config.label}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  {/* Note displayed on new line if present */}
                  {payment.note && (
                    <div className="mt-2 rounded-md bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground border border-border/40 leading-relaxed wrap-break-word">
                      {payment.note}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-0.5 shrink-0 -mr-1 -mt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(payment.id)}
                  >
                    <Pencil className="size-3.5" />
                    <span className="sr-only">Edit payment</span>
                  </Button>

                  <DeleteDialog
                    title={`Delete payment of ${formatPrice(payment.amount)}?`}
                    description="This will permanently delete this payment entry from the order. This action cannot be undone."
                    action={() => onDelete(payment.id)}
                    successMessage="Payment deleted successfully."
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" />
                      <span className="sr-only">Delete payment</span>
                    </Button>
                  </DeleteDialog>
                </div>
              </div>
            );
          })}

          {payments.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No payments recorded yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
