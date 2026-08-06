"use client";

import { Truck } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import {
  DELIVERY_CHARGES,
  DELIVERY_OPTIONS,
  type CheckoutFormValues,
  type DeliveryOptionType,
} from "@/validation/checkout.validation";

const OPTION_COPY: Record<
  DeliveryOptionType,
  { title: string; description: string }
> = {
  inside: { title: "Inside Dhaka", description: "Delivery within Dhaka City" },
  outside: {
    title: "Outside Dhaka",
    description: "Delivery outside Dhaka City",
  },
};

export function DeliveryOptionsField() {
  const { control } = useFormContext<CheckoutFormValues>();

  return (
    <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
      <div className="mb-4 flex items-center gap-2.5 border-b pb-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Truck className="h-4 w-4" />
        </span>
        <h2 className="text-base font-bold tracking-tight text-foreground">
          Delivery Options
        </h2>
      </div>

      <FieldGroup className="space-y-4">
        <Controller
          name="deliveryOption"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <div
                role="radiogroup"
                aria-label="Delivery option"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {DELIVERY_OPTIONS.map((option) => {
                  const isSelected = field.value === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => field.onChange(option)}
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
                            {OPTION_COPY[option].title}
                          </span>
                          <span className="block text-[11px] font-medium text-muted-foreground">
                            {OPTION_COPY[option].description}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        ৳{DELIVERY_CHARGES[option]}
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
