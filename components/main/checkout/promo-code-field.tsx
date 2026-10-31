"use client";

import { applyPromoCode, type AppliedPromo } from "@/actions/main/promo-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { formatPrice } from "@/utils/format-price";
import type { CheckoutFormValues } from "@/validation/checkout.validation";
import { PROMO_CODE_MAX_LENGTH } from "@/validation/promo-code.validation";
import { Loader2, TicketPercent, X } from "lucide-react";
import { useState, useTransition, type KeyboardEvent } from "react";
import { useFormContext } from "react-hook-form";

interface PromoCodeFieldProps {
  applied: AppliedPromo | null;
  subtotal: number;
  onApply: (promo: AppliedPromo) => void;
  onRemove: () => void;
}

export function PromoCodeField({
  applied,
  subtotal,
  onApply,
  onRemove,
}: PromoCodeFieldProps) {
  const { getValues } = useFormContext<CheckoutFormValues>();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleApply = () => {
    if (!code.trim()) return;

    setError("");
    startTransition(async () => {
      try {
        const result = await applyPromoCode(code, getValues("phone"));

        if (!result.success) {
          setError(result.error);
          return;
        }

        onApply(result.promo);
        setCode("");
        toast.add({ title: `${result.promo.code} applied.`, type: "success" });
      } catch {
        setError("Couldn't check this promo code. Please try again.");
      }
    });
  };

  // This sits inside the checkout form, where Enter would place the order.
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    handleApply();
  };

  if (applied) {
    const amountShort = applied.minOrderAmount - subtotal;

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2 rounded-sm border border-emerald-600/40 bg-emerald-50/10 px-2.5 py-1.5">
          <span className="flex min-w-0 items-center gap-1.5 text-xs font-bold text-emerald-800">
            <TicketPercent className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{applied.code}</span>
          </span>
          <button
            type="button"
            onClick={onRemove}
            className="cursor-pointer rounded p-0.5 text-muted-foreground transition-all hover:text-red-600"
            aria-label={`Remove promo code ${applied.code}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        {amountShort > 0 && (
          <p className="text-[11px] font-medium text-destructive">
            Add {formatPrice(amountShort)} more to use this code.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Input
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          maxLength={PROMO_CODE_MAX_LENGTH}
          placeholder="Promo code"
          aria-label="Promo code"
          aria-invalid={!!error}
          className="uppercase placeholder:normal-case"
        />
        <Button
          type="button"
          variant="outline"
          disabled={isPending || !code.trim()}
          onClick={handleApply}
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Apply
        </Button>
      </div>
      {error && (
        <p className="text-[11px] font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}
