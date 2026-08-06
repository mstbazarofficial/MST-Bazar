"use client";

import { User } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CheckoutFormValues } from "@/validation/checkout.validation";

export function ContactInfoFields() {
  const { control } = useFormContext<CheckoutFormValues>();

  return (
    <div className="rounded-xl border bg-card  p-5 text-card-foreground shadow-xs">
      <div className="mb-4 flex items-center gap-2.5 border-b pb-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-4 w-4" />
        </span>
        <h2 className="text-base font-bold tracking-tight text-foreground">
          Contact Information
        </h2>
      </div>

      <FieldGroup className="gap-4!">
        <Controller
          name="fullName"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Enter your full name"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="tel"
                  inputMode="numeric"
                  placeholder="017XXXXXXXX"
                  autoComplete="tel"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="whatsapp"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor={field.name}>
                  WhatsApp Number (optional)
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="tel"
                  inputMode="numeric"
                  placeholder="017XXXXXXXX"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>
    </div>
  );
}
