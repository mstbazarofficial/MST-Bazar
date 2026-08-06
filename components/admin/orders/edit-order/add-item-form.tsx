"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { searchProductsForOrder } from "@/actions/admin/order-actions";
import { addOrderItem } from "@/actions/admin/order-mutations";
import { FormModal } from "@/components/my-ui/form-modal";
import { NumberInput } from "@/components/my-ui/number-input";
import { SingleImageUploader } from "@/components/my-ui/single-image-uploader";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/utils/get-error-message";
import {
  OrderItemInput,
  orderItemSchema,
} from "@/validation/orders.validation";
import {
  ProductSearchResult,
  ProductSearchSelect,
} from "../product-search-select";

const defaultValues: OrderItemInput = {
  productId: "",
  productName: "",
  productImage: "",
  price: 0,
  quantity: 1,
  discountPercentage: 0,
};

interface AddItemFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onSuccess?: () => void;
}

export function AddItemFormModal({
  open,
  onOpenChange,
  orderId,
  onSuccess,
}: AddItemFormModalProps) {
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  // ==========================================
  // FORM SETUP
  // ==========================================
  const form = useForm<OrderItemInput>({
    resolver: zodResolver(orderItemSchema),
    defaultValues,
  });

  const { control, handleSubmit, setValue, reset } = form;

  // ==========================================
  // MUTATION
  // ==========================================
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: OrderItemInput) => {
      if (!orderId) {
        throw new Error("Order ID is required.");
      }

      const res = await addOrderItem({ orderId, input: data });

      if (!res.success) {
        throw new Error(res.error);
      }

      return res.data;
    },
    onSuccess: () => {
      setFormError(null);
      reset(defaultValues);
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      // Trigger custom onSuccess action or close modal
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: unknown) => {
      // Parse the error using our reusable helper
      setFormError(getErrorMessage(error));
    },
  });

  const onSubmit = (values: OrderItemInput) => {
    setFormError(null); // Clear previous errors on re-submit
    mutate(values);
  };

  // Helper when selecting a product search result
  const handleProductSelect = (product: ProductSearchResult) => {
    setValue("productId", product.id, { shouldValidate: true });
    setValue("productName", product.title, { shouldValidate: true });
    setValue("price", product.price, { shouldValidate: true });
    setValue("discountPercentage", product.discountPercentage ?? 0, {
      shouldValidate: true,
    });

    if (product.image) {
      setValue("productImage", product.image, { shouldValidate: true });
    }
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
      title="Add Product"
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

          <Button type="submit" form="add-item-form" disabled={isPending}>
            {isPending ? "Adding..." : "Add Product"}
          </Button>
        </div>
      }
    >
      <form
        id="add-item-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Reusable Form-Level Error Banner */}
        {formError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="font-medium">{formError}</p>
          </div>
        )}

        {/* Product Search */}
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Search & Select Product</FieldLabel>
          <ProductSearchSelect
            onSearch={searchProductsForOrder}
            onSelect={handleProductSelect}
            placeholder="Search to auto-fill..."
          />
          <p className="text-[0.8rem] text-muted-foreground">
            Selecting a product auto-fills fields below. You can still customize
            manually.
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
          {/* Product Image */}
          <div className="sm:col-span-4">
            <Controller
              name="productImage"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Product Image</FieldLabel>
                  <SingleImageUploader
                    aspectRatio={1}
                    uploadPreset="category_image"
                    value={field.value}
                    onChange={(url) => field.onChange(url)}
                    error={fieldState.error?.message}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          {/* Details */}
          <div className="space-y-4 sm:col-span-8">
            <Controller
              name="productName"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Product Name *</FieldLabel>
                  <Input placeholder="e.g. Wireless Mouse" {...field} />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Controller
                name="price"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Price (৳) *</FieldLabel>
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

              <Controller
                name="discountPercentage"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Discount (%)</FieldLabel>
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

              <Controller
                name="quantity"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Quantity *</FieldLabel>
                    <NumberInput
                      placeholder="1"
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
          </div>
        </div>
      </form>
    </FormModal>
  );
}
