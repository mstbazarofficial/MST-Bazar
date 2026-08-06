"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { updateOrderCosts } from "@/actions/admin/order-mutations";
import { FormModal } from "@/components/my-ui/form-modal";
import { NumberInput } from "@/components/my-ui/number-input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { formatPrice } from "@/utils/format-price";
import { getErrorMessage } from "@/utils/get-error-message";
import {
  EditOrderCostsInput,
  editOrderCostsSchema,
} from "@/validation/orders.validation";

interface EditOrderCostsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderRevenue: number; // Total amount paid by customer
  initialData: {
    productCost?: number | null;
    deliveryCost?: number | null;
  };
  onSuccess?: () => void;
}

export function EditOrderCostsModal({
  open,
  onOpenChange,
  orderId,
  orderRevenue,
  initialData,
  onSuccess,
}: EditOrderCostsModalProps) {
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<EditOrderCostsInput>({
    resolver: zodResolver(editOrderCostsSchema),
    values: {
      productCost: initialData.productCost ?? 0,
      deliveryCost: initialData.deliveryCost ?? 0,
    },
  });

  const { control, handleSubmit, reset } = form;

  // Live values
  const productCost = Number(useWatch({ control, name: "productCost" }) || 0);
  const deliveryCost = Number(useWatch({ control, name: "deliveryCost" }) || 0);

  // Profit Metrics Calculations
  const totalCost = productCost + deliveryCost;
  const netProfit = orderRevenue - totalCost;
  const profitMargin =
    orderRevenue > 0 ? ((netProfit / orderRevenue) * 100).toFixed(1) : "0.0";

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: EditOrderCostsInput) => {
      if (!orderId) throw new Error("Order ID is required.");

      const res = await updateOrderCosts({ orderId, input: data });
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

  const onSubmit = (values: EditOrderCostsInput) => {
    setFormError(null);
    mutate(values);
  };

  const handleModalClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      setFormError(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={handleModalClose}
      title="Admin Operational Costs & Profit"
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

          <Button type="submit" form="edit-costs-form" disabled={isPending}>
            {isPending ? "Saving..." : "Save Operational Costs"}
          </Button>
        </div>
      }
    >
      <form
        id="edit-costs-form"
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
          {/* Base Product Cost */}
          <Controller
            name="productCost"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Product Cost / Sourcing (৳)</FieldLabel>
                <NumberInput
                  placeholder="0"
                  value={field.value ?? 0}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          {/* Delivery Expense */}
          <Controller
            name="deliveryCost"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Delivery/Courier Expense (৳)</FieldLabel>
                <NumberInput
                  placeholder="0"
                  value={field.value ?? 0}
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

        {/* Live Admin Profit Analysis */}
        <div className="rounded-lg border bg-muted/40 p-4 space-y-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-foreground text-sm border-b pb-2">
            <DollarSign className="size-4" />
            Live Admin Profit Breakdown
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Customer Revenue (Order Total):</span>
            <span className="font-medium text-foreground">
              {formatPrice(orderRevenue)}
            </span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Total Operational Expenses:</span>
            <span className="font-medium text-foreground">
              {formatPrice(totalCost)}
            </span>
          </div>

          <div className="my-2 h-px bg-border" />

          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-foreground flex items-center gap-1">
              Estimated Net Profit:
            </span>
            <span
              className={
                netProfit >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-destructive"
              }
            >
              {formatPrice(netProfit)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Profit Margin:</span>
            <div className="flex items-center gap-1 font-mono font-medium">
              {netProfit >= 0 ? (
                <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown className="size-3.5 text-destructive" />
              )}
              <span
                className={
                  netProfit >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-destructive"
                }
              >
                {profitMargin}%
              </span>
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
}
