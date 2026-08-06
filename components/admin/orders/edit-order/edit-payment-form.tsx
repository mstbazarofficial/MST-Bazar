"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { updatePayment } from "@/actions/admin/payment-mutations";
import { DatePicker } from "@/components/my-ui/date-picker";
import { FormModal } from "@/components/my-ui/form-modal";
import { NumberInput } from "@/components/my-ui/number-input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PaymentMethod } from "@/generated/prisma/enums";
import { getErrorMessage } from "@/utils/get-error-message";
import {
  PaymentInput,
  paymentSchema,
  PaymentType,
} from "@/validation/payment.validation";

const defaultValues: PaymentInput = {
  amount: 0,
  method: PaymentMethod.CASH_ON_DELIVERY, // Default fallback option
  date: new Date(),
  note: "",
};

interface EditPaymentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  payment: PaymentType | null;
  onSuccess?: () => void;
}

export function EditPaymentFormModal({
  open,
  onOpenChange,
  orderId,
  payment,
  onSuccess,
}: EditPaymentFormModalProps) {
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    values: payment
      ? {
          amount: payment.amount ?? 0,
          method: payment.method ?? PaymentMethod.CASH_ON_DELIVERY,
          date: payment.date ? new Date(payment.date) : new Date(),
          note: payment.note ?? "",
        }
      : defaultValues,
  });

  const { control, handleSubmit, reset } = form;

  const methodOptions = Object.values(PaymentMethod).map((method) => ({
    value: method,
    label: method.charAt(0) + method.slice(1).toLowerCase().replace(/_/g, " "),
  }));

  const { mutate: updatePaymentMutate, isPending } = useMutation({
    mutationFn: async (data: PaymentInput) => {
      if (!orderId || !payment?.id) {
        throw new Error("Order ID and Payment ID are required.");
      }

      const res = await updatePayment({
        orderId,
        paymentId: payment.id,
        input: data,
      });

      if (!res.success) {
        throw new Error(res.error);
      }

      return res.data;
    },
    onSuccess: () => {
      setFormError(null);
      reset(defaultValues);
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: unknown) => {
      setFormError(getErrorMessage(error));
    },
  });

  const onSubmit = (values: PaymentInput) => {
    setFormError(null);
    updatePaymentMutate(values);
  };

  const handleModalClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset(defaultValues);
      setFormError(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={handleModalClose}
      title="Edit Payment"
      maxWidth="32rem"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleModalClose(false)}
          >
            Cancel
          </Button>

          <Button type="submit" form="edit-payment-form" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      }
    >
      <form
        id="edit-payment-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Error Banner */}
        {formError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="font-medium">{formError}</p>
          </div>
        )}

        {/* Amount */}
        <Controller
          name="amount"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Amount (৳) *</FieldLabel>
              <NumberInput
                placeholder="0.00"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Payment Method */}
          <Controller
            name="method"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Payment Method *</FieldLabel>
                <div className="relative">
                  <select
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value as PaymentMethod)
                    }
                    className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {methodOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-50" />
                </div>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          {/* Date Picker */}
          <Controller
            name="date"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Payment Date *</FieldLabel>
                <DatePicker
                  selected={field.value}
                  onSelect={(date) => field.onChange(date ?? new Date())}
                  className="w-full"
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        {/* Note */}
        <Controller
          name="note"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Note / Reference</FieldLabel>
              <Input
                placeholder="e.g. Transaction ID, Check #, Cash receipt"
                {...field}
                value={field.value || ""}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
      </form>
    </FormModal>
  );
}
