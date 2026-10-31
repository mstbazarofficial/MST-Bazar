"use client";

import { upsertPromoCode } from "@/actions/admin/promo-code-mutations";
import { PageHeader } from "@/components/admin/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { PromoCode } from "@/generated/prisma/client";
import { toDhakaDay } from "@/lib/dhaka-time";
import {
  PROMO_DISCOUNT_TYPE_LABELS,
  promoDiscountTypeEnum,
  upsertPromoCodeSchema,
  type UpsertPromoCodeFormValues,
  type UpsertPromoCodeInput,
} from "@/validation/promo-code.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Control, Controller, Path, useForm, useWatch } from "react-hook-form";

interface PromoCodeFormPageProps {
  initialValues?: PromoCode;
}

type NumberFieldName =
  | "discountValue"
  | "maxDiscount"
  | "minOrderAmount"
  | "usageLimit"
  | "perCustomerLimit";

function NumberField({
  control,
  name,
  label,
  description,
  placeholder,
}: {
  control: Control<UpsertPromoCodeFormValues, unknown, UpsertPromoCodeInput>;
  name: NumberFieldName;
  label: string;
  description?: string;
  placeholder?: string;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            id={name}
            type="number"
            min={0}
            step="any"
            placeholder={placeholder}
            ref={field.ref}
            name={field.name}
            onBlur={field.onBlur}
            value={field.value ?? ""}
            onChange={(event) =>
              field.onChange(
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}

export function PromoCodeFormPage({ initialValues }: PromoCodeFormPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const isEditing = !!initialValues?.id;

  const { handleSubmit, control, setError } = useForm<
    UpsertPromoCodeFormValues,
    unknown,
    UpsertPromoCodeInput
  >({
    resolver: zodResolver(upsertPromoCodeSchema),
    defaultValues: {
      code: initialValues?.code ?? "",
      description: initialValues?.description ?? "",
      discountType: initialValues?.discountType ?? "PERCENT",
      discountValue: initialValues?.discountValue,
      maxDiscount: initialValues?.maxDiscount ?? null,
      minOrderAmount: initialValues?.minOrderAmount ?? 0,
      startsAt: initialValues?.startsAt ? toDhakaDay(initialValues.startsAt) : "",
      // endsAt is exclusive, so the last valid day is the one before it.
      endsAt: initialValues?.endsAt
        ? toDhakaDay(new Date(initialValues.endsAt.getTime() - 1))
        : "",
      usageLimit: initialValues?.usageLimit ?? null,
      perCustomerLimit: initialValues?.perCustomerLimit ?? null,
      isActive: initialValues?.isActive ?? true,
    },
  });

  const discountType = useWatch({ control, name: "discountType" });

  async function submit(data: UpsertPromoCodeInput) {
    setIsPending(true);
    try {
      const result = await upsertPromoCode(
        isEditing ? { ...data, id: initialValues!.id } : data,
      );

      if (result.success) {
        toast.add({
          type: "success",
          description: isEditing
            ? "Promo code updated successfully!"
            : "Promo code created successfully!",
        });
        void queryClient.invalidateQueries();
        router.back();
      } else if (Array.isArray(result.error)) {
        result.error.forEach((err) => {
          setError(err.path.join(".") as Path<UpsertPromoCodeFormValues>, {
            message: err.message,
          });
        });
        toast.add({
          type: "error",
          description: "Please check the form for errors.",
          priority: "high",
        });
      } else {
        toast.add({
          type: "error",
          description: result.error || "Something went wrong.",
          priority: "high",
        });
      }
    } catch {
      toast.add({
        type: "error",
        description: "An unexpected error occurred.",
        priority: "high",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <PageHeader
        title={isEditing ? "Edit Promo Code" : "Add New Promo Code"}
        backHref="/admin/promo-codes"
        actions={
          <Button
            type="button"
            disabled={isPending}
            onClick={handleSubmit(submit)}
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isPending
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Promo Code"}
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <fieldset
          disabled={isPending}
          className="mx-auto flex max-w-3xl flex-col gap-8 disabled:opacity-70"
        >
          {/* 1. Code */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              1. Code
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="code"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="code">Code *</FieldLabel>
                    <Input
                      id="code"
                      placeholder="EID2026"
                      className="font-mono uppercase"
                      {...field}
                    />
                    <FieldDescription>
                      Customers type this at checkout. Capitals do not matter.
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Input
                      id="description"
                      placeholder="Eid campaign"
                      {...field}
                    />
                    <FieldDescription>
                      Only shown in the admin panel.
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          {/* 2. Discount */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              2. Discount
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="discountType"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="discountType">Type *</FieldLabel>
                    <NativeSelect id="discountType" {...field}>
                      {promoDiscountTypeEnum.options.map((option) => (
                        <option key={option} value={option}>
                          {PROMO_DISCOUNT_TYPE_LABELS[option]}
                        </option>
                      ))}
                    </NativeSelect>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <NumberField
                control={control}
                name="discountValue"
                label={
                  discountType === "PERCENT"
                    ? "Discount (%) *"
                    : "Discount (৳) *"
                }
                description="Applies to the items, not the delivery charge."
              />
              {discountType === "PERCENT" && (
                <NumberField
                  control={control}
                  name="maxDiscount"
                  label="Maximum discount (৳)"
                  placeholder="No maximum"
                />
              )}
              <NumberField
                control={control}
                name="minOrderAmount"
                label="Minimum order (৳)"
                description="Set to 0 for no minimum. Delivery is not counted."
              />
            </div>
          </FieldGroup>

          {/* 3. Dates */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              3. Dates
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="startsAt"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="startsAt">Start date</FieldLabel>
                    <Input id="startsAt" type="date" {...field} />
                    <FieldDescription>
                      Leave empty to start now.
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="endsAt"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="endsAt">End date</FieldLabel>
                    <Input id="endsAt" type="date" {...field} />
                    <FieldDescription>
                      Works until the end of this day, Dhaka time.
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          {/* 4. Limits & Settings */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              4. Limits & Settings
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NumberField
                  control={control}
                  name="usageLimit"
                  label="Total uses"
                  placeholder="Unlimited"
                  description="Cancelled orders give their use back."
                />
                <NumberField
                  control={control}
                  name="perCustomerLimit"
                  label="Uses per customer"
                  placeholder="Unlimited"
                  description="Customers are matched by phone number and account."
                />
              </div>

              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Field className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FieldLabel className="mb-0">Active</FieldLabel>
                      <FieldDescription>
                        Turn off to pause the code without deleting it.
                      </FieldDescription>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </fieldset>
      </main>
    </>
  );
}
