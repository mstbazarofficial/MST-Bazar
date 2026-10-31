"use client";

import { Loader2, Lock } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { formatPrice } from "@/utils/format-price";
import type { CheckoutFormValues } from "@/validation/checkout.validation";

interface CheckoutSubmitBarProps {
  isSubmitting: boolean;
  total: number;
}

/** Fixed to the bottom of the screen below the lg breakpoint. */
export function CheckoutSubmitBar({
  isSubmitting,
  total,
}: CheckoutSubmitBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-2px_8px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground">Total</p>
          <p className="truncate text-lg font-black text-emerald-800">
            {formatPrice(total)}
          </p>
        </div>
        <SubmitButton isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}

/** Sits under the order summary from the lg breakpoint up. */
export function CheckoutSubmitPanel({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <div className="hidden space-y-2 lg:block">
      <SubmitButton isSubmitting={isSubmitting} className="w-full" />
      <PaymentNote />
    </div>
  );
}

function PaymentNote() {
  const { control } = useFormContext<CheckoutFormValues>();
  const paymentMethod = useWatch({ control, name: "paymentMethod" });

  return (
    <p className="text-center text-xs font-medium text-muted-foreground">
      {paymentMethod === "cod"
        ? "Pay in cash when your order arrives."
        : "Send the payment first, then enter your TrxID to place the order."}
    </p>
  );
}

function SubmitButton({
  isSubmitting,
  className = "",
}: {
  isSubmitting: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary-dark px-8 py-3 text-sm font-extrabold text-white shadow-md transition-all hover:bg-emerald-900 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Placing Order...</span>
        </>
      ) : (
        <>
          <Lock className="h-4 w-4" />
          <span>Place Order</span>
        </>
      )}
    </button>
  );
}
