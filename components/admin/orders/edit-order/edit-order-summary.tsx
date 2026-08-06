"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Calculator } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { updateOrderSummary } from "@/actions/admin/order-mutations";
import { FormModal } from "@/components/my-ui/form-modal";
import { NumberInput } from "@/components/my-ui/number-input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { calculateOrderTotal } from "@/utils/calculate-order-total";
import { formatPrice } from "@/utils/format-price";
import { getErrorMessage } from "@/utils/get-error-message";
import {
  EditOrderSummaryInput,
  editOrderSummarySchema,
} from "@/validation/orders.validation";

interface EditOrderSummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  initialData: {
    shippingCost: number;
    discount: number;
  };
  orderItems: { price: number; quantity: number; discountPercentage: number }[];
  onSuccess?: () => void;
}

export function EditOrderSummaryModal({
  open,
  onOpenChange,
  orderId,
  initialData,
  orderItems,
  onSuccess,
}: EditOrderSummaryModalProps) {
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<EditOrderSummaryInput>({
    resolver: zodResolver(editOrderSummarySchema),
    values: initialData,
  });

  const { control, handleSubmit, reset } = form;

  // Watch fields for live calculations
  const currentShipping = useWatch({ control, name: "shippingCost" }) || 0;
  const currentDiscount = useWatch({ control, name: "discount" }) || 0;

  // Calculate live preview totals based on your company's order (Items -> Shipping -> Discount)
  const liveTotal = calculateOrderTotal({
    orderItems,
    shippingCost: Number(currentShipping),
    discount: Number(currentDiscount),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: EditOrderSummaryInput) => {
      if (!orderId) throw new Error("Order ID is required.");

      const res = await updateOrderSummary({ orderId, input: data });
      if (!res.success) throw new Error(res.error);

      return res.data;
    },
    onSuccess: () => {
      setFormError(null);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: unknown) => {
      setFormError(getErrorMessage(error));
    },
  });

  const onSubmit = (values: EditOrderSummaryInput) => {
    setFormError(null);
    mutate(values);
  };

  const handleModalClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset(initialData);
      setFormError(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={handleModalClose}
      title="Edit Order Summary"
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

          <Button type="submit" form="edit-summary-form" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      }
    >
      <form
        id="edit-summary-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {formError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="font-medium">{formError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Shipping Cost */}
          <Controller
            name="shippingCost"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Shipping Cost (৳)</FieldLabel>
                <NumberInput
                  placeholder="0"
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

          {/* Discount Percentage */}
          <Controller
            name="discount"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Order Discount (%)</FieldLabel>
                <NumberInput
                  placeholder="0"
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
        </div>

        {/* Live Total Calculation Preview */}
        <div className="rounded-lg border bg-muted/40 p-3.5 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-foreground text-sm border-b pb-2">
            <Calculator className="size-4" />
            Live Preview
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Items Subtotal:</span>
            <span>{formatPrice(liveTotal.itemsSubtotal)}</span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Shipping Cost:</span>
            <span>{formatPrice(currentShipping)}</span>
          </div>

          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Discount ({currentDiscount}%):</span>
            <span>-{formatPrice(liveTotal.discountAmount)}</span>
          </div>

          <div className="flex justify-between text-sm font-semibold text-foreground pt-1.5 border-t">
            <span>New Total:</span>
            <span>{formatPrice(liveTotal.finalTotal)}</span>
          </div>
        </div>
      </form>
    </FormModal>
  );
}
