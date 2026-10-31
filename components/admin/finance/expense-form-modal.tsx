"use client";

import { upsertExpense } from "@/actions/admin/expense-mutations";
import type { getExpenses } from "@/actions/admin/finance-actions";
import { FormModal } from "@/components/my-ui/form-modal";
import { NumberInput } from "@/components/my-ui/number-input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toDhakaDay } from "@/lib/dhaka-time";
import { EXPENSE_CATEGORY_LABELS } from "@/utils/expense-category";
import { formatPrice } from "@/utils/format-price";
import { getErrorMessage } from "@/utils/get-error-message";
import {
  expenseSchema,
  type ExpenseInput,
} from "@/validation/expense.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

type Expense = Awaited<ReturnType<typeof getExpenses>>["expenses"][number];

function getFormValues(expense?: Expense): ExpenseInput {
  if (!expense) {
    return {
      title: "",
      category: "PRODUCT_PURCHASE",
      amount: 0,
      paidAmount: 0,
      supplier: "",
      date: toDhakaDay(new Date()),
      note: "",
    };
  }

  return {
    id: expense.id,
    title: expense.title,
    category: expense.category,
    amount: expense.amount,
    paidAmount: expense.paidAmount,
    supplier: expense.supplier ?? "",
    date: toDhakaDay(expense.date),
    note: expense.note ?? "",
  };
}

export function ExpenseFormModal({
  open,
  onOpenChange,
  expense,
  supplierNames,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense;
  supplierNames: string[];
}) {
  const initialPaidInFull = !expense || expense.paidAmount >= expense.amount;

  const [formError, setFormError] = useState<string | null>(null);
  const [paidInFull, setPaidInFull] = useState(initialPaidInFull);

  const { control, handleSubmit, reset, setValue, getValues } =
    useForm<ExpenseInput>({
      resolver: zodResolver(expenseSchema),
      defaultValues: getFormValues(expense),
    });

  const amount = useWatch({ control, name: "amount" }) || 0;
  const paidAmount = useWatch({ control, name: "paidAmount" }) || 0;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ExpenseInput) => {
      const res = await upsertExpense(data);
      if (!res.success) throw new Error(res.error);
    },
    onSuccess: () => closeModal(),
    onError: (error: unknown) => setFormError(getErrorMessage(error)),
  });

  function closeModal() {
    reset(getFormValues(expense));
    setPaidInFull(initialPaidInFull);
    setFormError(null);
    onOpenChange(false);
  }

  function togglePaidInFull(checked: boolean) {
    setPaidInFull(checked);
    setValue("paidAmount", checked ? getValues("amount") : 0, {
      shouldValidate: true,
    });
  }

  return (
    <FormModal
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) onOpenChange(true);
        else closeModal();
      }}
      title={expense ? "Edit Expense" : "Add Expense"}
      maxWidth="36rem"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button type="submit" form="expense-form" disabled={isPending}>
            {isPending ? "Saving..." : "Save Expense"}
          </Button>
        </div>
      }
    >
      <form
        id="expense-form"
        onSubmit={handleSubmit((values) => {
          setFormError(null);
          mutate(values);
        })}
        className="space-y-4"
      >
        {formError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="font-medium">{formError}</p>
          </div>
        )}

        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="expense-title">Title *</FieldLabel>
              <Input
                id="expense-title"
                placeholder="e.g. Rice, 50 bags"
                {...field}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="expense-category">Category *</FieldLabel>
                <NativeSelect id="expense-category" {...field}>
                  {Object.entries(EXPENSE_CATEGORY_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ),
                  )}
                </NativeSelect>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="date"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="expense-date">Date *</FieldLabel>
                <Input id="expense-date" type="date" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="amount"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="expense-amount">
                  Bill Amount (৳) *
                </FieldLabel>
                <NumberInput
                  id="expense-amount"
                  placeholder="0"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    if (paidInFull) setValue("paidAmount", value);
                  }}
                  onBlur={field.onBlur}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="supplier"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="expense-supplier">
                  Supplier{!paidInFull && " *"}
                </FieldLabel>
                <Input
                  id="expense-supplier"
                  list="expense-suppliers"
                  placeholder="Optional"
                  {...field}
                />
                <datalist id="expense-suppliers">
                  {supplierNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border p-3.5">
          <div>
            <p className="text-sm font-medium text-foreground">Paid in full</p>
            <p className="text-xs text-muted-foreground">
              Turn off if you still owe the supplier
            </p>
          </div>
          <Switch
            checked={paidInFull}
            onCheckedChange={togglePaidInFull}
            aria-label="Paid in full"
          />
        </div>

        {!paidInFull && (
          <Controller
            name="paidAmount"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="expense-paid">Paid So Far (৳)</FieldLabel>
                <NumberInput
                  id="expense-paid"
                  placeholder="0"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
                <p className="text-xs text-muted-foreground">
                  Still owed: {formatPrice(Math.max(0, amount - paidAmount))}
                </p>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        )}

        <Controller
          name="note"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="expense-note">Note</FieldLabel>
              <Textarea
                id="expense-note"
                placeholder="Optional"
                className="resize-none"
                {...field}
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
