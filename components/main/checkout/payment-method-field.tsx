"use client";

import { CreditCard } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import {
  PAYMENT_METHODS,
  type CheckoutFormValues,
  type PaymentMethodType,
} from "@/validation/checkout.validation";

const METHOD_COPY: Record<
  PaymentMethodType,
  { title: string; subtitle: string; badgeText: string; badgeClass: string }
> = {
  cod: {
    title: "Cash on Delivery (COD)",
    subtitle: "Pay when you receive your order",
    badgeText: "COD",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold",
  },
  bkash: {
    title: "bKash",
    subtitle: "Pay securely with bKash",
    badgeText: "bKash",
    badgeClass: "bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold",
  },
  nagad: {
    title: "Nagad",
    subtitle: "Pay securely with Nagad",
    badgeText: "নগদ",
    badgeClass:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold",
  },
};

export function PaymentMethodField() {
  const { control } = useFormContext<CheckoutFormValues>();

  return (
    <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
      <div className="mb-4 flex items-center gap-2.5 border-b pb-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CreditCard className="h-4 w-4" />
        </span>
        <h2 className="text-base font-bold tracking-tight text-foreground">
          Payment Method
        </h2>
      </div>

      <FieldGroup className="space-y-4">
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <div
                role="radiogroup"
                aria-label="Payment method"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = field.value === method;
                  const copy = METHOD_COPY[method];
                  return (
                    <button
                      key={method}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => field.onChange(method)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-lg border p-3.5 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border bg-card hover:border-primary/50 hover:bg-accent/50",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40",
                          )}
                        >
                          {isSelected && (
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          )}
                        </span>
                        <div>
                          <span className="block text-xs font-bold text-foreground">
                            {copy.title}
                          </span>
                          <span className="block text-[11px] font-medium text-muted-foreground">
                            {copy.subtitle}
                          </span>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded px-2.5 py-0.5 text-xs",
                          copy.badgeClass,
                        )}
                      >
                        {copy.badgeText}
                      </span>
                    </button>
                  );
                })}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}
