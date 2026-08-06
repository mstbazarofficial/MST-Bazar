"use client";

import { MapPin } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { CheckoutFormValues } from "@/validation/checkout.validation";

const MAX_LENGTH = 200;

export function DeliveryAddressField() {
  const { control } = useFormContext<CheckoutFormValues>();

  return (
    <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
      <div className="mb-4 flex items-center gap-2.5 border-b pb-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MapPin className="h-4 w-4" />
        </span>
        <h2 className="text-base font-bold tracking-tight text-foreground">
          Delivery Address
        </h2>
      </div>

      <FieldGroup className="space-y-4">
        <Controller
          name="address"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor={field.name}>Address</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                rows={3}
                maxLength={MAX_LENGTH}
                placeholder="House/Flat, Road, Area, City"
                aria-invalid={fieldState.invalid}
                className="resize-none"
              />
              <div className="flex items-center justify-between gap-2 pt-1">
                <FieldDescription>
                  Include house/flat, road, area and city so we can find you
                  fast.
                </FieldDescription>
                <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                  {field.value?.length ?? 0}/{MAX_LENGTH}
                </span>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}
