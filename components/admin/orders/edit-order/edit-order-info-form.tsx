"use client";

import { updateOrderInfo } from "@/actions/admin/order-mutations";
import { searchUsersForAdmin } from "@/actions/admin/user-actions";
import { FormModal } from "@/components/my-ui/form-modal";
import {
  UserSearchResult,
  UserSearchSelect,
} from "@/components/my-ui/user-search-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { PaymentMethod } from "@/generated/prisma/enums";
import { getErrorMessage } from "@/utils/get-error-message";
import {
  EditOrderInfoInput,
  editOrderInfoSchema,
} from "@/validation/orders.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, BadgeCheck, UserX } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
  { value: "CASH_ON_DELIVERY", label: "Cash on Delivery" },
  { value: "BKASH", label: "bKash" },
  { value: "NAGAD", label: "Nagad" },
  { value: "ROCKET", label: "Rocket" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CARD", label: "Card Payment" },
  { value: "OTHER", label: "Other" },
];

interface EditOrderInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  initialData: EditOrderInfoInput;
  onSuccess?: () => void;
}

export function EditOrderInfoModal({
  open,
  onOpenChange,
  orderId,
  initialData,
  onSuccess,
}: EditOrderInfoModalProps) {
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<EditOrderInfoInput>({
    resolver: zodResolver(editOrderInfoSchema),
    values: initialData,
  });

  const { control, handleSubmit, setValue, reset } = form;

  const currentUserId = useWatch({ control, name: "userId" });
  const paymentMethod = useWatch({ control, name: "orderPaymentMethod" });

  const isCod = paymentMethod === "CASH_ON_DELIVERY";

  const handleUserSelect = (user: UserSearchResult) => {
    setValue("userId", user.id, { shouldValidate: true });
    setValue("customerName", user.name, { shouldValidate: true });
    setValue("emailAddress", user.email, { shouldValidate: true });

    if (user.phoneNumber) {
      setValue("phoneNumber", user.phoneNumber, { shouldValidate: true });
    }
    if (user.whatsappNumber) {
      setValue("whatsappNumber", user.whatsappNumber, { shouldValidate: true });
    }
    if (user.fullAddress) {
      setValue("fullAddress", user.fullAddress, { shouldValidate: true });
    }
  };

  const handleUnlinkUser = () => {
    setValue("userId", null, { shouldValidate: true, shouldDirty: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: EditOrderInfoInput) => {
      if (!orderId) throw new Error("Order ID is required.");

      const res = await updateOrderInfo({ orderId, input: data });
      if (!res.success) throw new Error(res.error);

      return res.data;
    },
    onSuccess: () => {
      setFormError(null);
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: unknown) => {
      setFormError(getErrorMessage(error));
    },
  });

  const onSubmit = (values: EditOrderInfoInput) => {
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
      title="Edit Order & Customer Information"
      maxWidth="38rem"
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

          <Button
            type="submit"
            form="edit-order-info-form"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      }
    >
      <form
        id="edit-order-info-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {formError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="font-medium">{formError}</p>
          </div>
        )}

        {/* User Search or Linked User Status Card */}
        <div className="space-y-2">
          <FieldLabel>Attach Registered User Account</FieldLabel>

          {currentUserId ? (
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm dark:bg-emerald-500/15">
              <div className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-emerald-900 dark:text-emerald-100">
                  User Linked
                </span>
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/20 text-[10px] text-emerald-700 dark:text-emerald-300"
                >
                  {currentUserId}
                </Badge>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleUnlinkUser}
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <UserX className="size-3.5" />
                Unlink User
              </Button>
            </div>
          ) : (
            <UserSearchSelect
              onSearch={searchUsersForAdmin}
              onSelect={handleUserSelect}
              placeholder="Search user to auto-fill customer fields..."
            />
          )}
          <p className="text-[0.8rem] text-muted-foreground">
            {currentUserId
              ? "Unlinking removes the user ID from this order, but keeps the customer details intact."
              : "Search for a registered account to auto-fill fields, or enter custom details manually."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Customer Name */}
          <div className="sm:col-span-2">
            <Controller
              name="customerName"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Customer Name *</FieldLabel>
                  <Input placeholder="John Doe" {...field} />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          {/* Email Address */}
          <Controller
            name="emailAddress"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Email Address *</FieldLabel>
                <Input type="email" placeholder="john@example.com" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          {/* Phone Number */}
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Phone Number *</FieldLabel>
                <Input placeholder="01700000000" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          {/* WhatsApp Number */}
          <div className="sm:col-span-2">
            <Controller
              name="whatsappNumber"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>WhatsApp Number (Optional)</FieldLabel>
                  <Input
                    placeholder="01700000000"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          {/* Shipping Address */}
          <div className="sm:col-span-2">
            <Controller
              name="fullAddress"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Shipping Address *</FieldLabel>
                  <Textarea
                    placeholder="House, Road, Area, City..."
                    rows={3}
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          {/* Payment Method Selector */}
          <div className="sm:col-span-2">
            <Controller
              name="orderPaymentMethod"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Payment Method *</FieldLabel>
                  <NativeSelect
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value as PaymentMethod)
                    }
                  >
                    <NativeSelectOption value="" disabled>
                      Select Payment Method
                    </NativeSelectOption>

                    {paymentMethodOptions.map((opt) => (
                      <NativeSelectOption key={opt.value} value={opt.value}>
                        {opt.label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          {/* Conditional Fields: Rendered when payment method is NOT Cash on Delivery */}
          {!isCod && (
            <>
              {/* Transaction Number */}
              <Controller
                name="TrxNumber"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Transaction Number (Sender)</FieldLabel>
                    <Input
                      placeholder="e.g. 01700000000"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Transaction ID / Reference */}
              <Controller
                name="TrxID"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Transaction ID / Reference</FieldLabel>
                    <Input
                      placeholder="e.g. 9B8A7C6D"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </>
          )}
        </div>
      </form>
    </FormModal>
  );
}
