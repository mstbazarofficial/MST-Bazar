"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { searchProductsForOrder } from "@/actions/admin/order-actions";
import { updateOrderItem } from "@/actions/admin/order-mutations";
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

export interface OrderItemType extends OrderItemInput {
  id: string;
}

const defaultValues: OrderItemInput = {
  productId: "",
  productName: "",
  productImage: "",
  price: 0,
  quantity: 1,
  discountPercentage: 0,
};

interface EditItemFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  item: OrderItemType | null;
  onSuccess?: () => void;
}

export function EditItemFormModal({
  open,
  onOpenChange,
  orderId,
  item,
  onSuccess,
}: EditItemFormModalProps) {
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  // ==========================================
  // 1. FORM SETUP
  // ==========================================
  const form = useForm<OrderItemInput>({
    resolver: zodResolver(orderItemSchema),
    values: item
      ? {
          productId: item.productId || "",
          productName: item.productName || "",
          productImage: item.productImage || "",
          price: item.price ?? 0,
          quantity: item.quantity ?? 1,
          discountPercentage: item.discountPercentage ?? 0,
        }
      : defaultValues,
  });

  const { control, handleSubmit, setValue, reset } = form;

  // ==========================================
  // 2. UPDATE MUTATION
  // ==========================================
  const { mutate: updateItem, isPending } = useMutation({
    mutationFn: async (data: OrderItemInput) => {
      if (!orderId || !item?.id) {
        throw new Error("Order ID and Item ID are required.");
      }

      const res = await updateOrderItem({
        orderId,
        itemId: item.id,
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

  const onSubmit = (values: OrderItemInput) => {
    setFormError(null);
    updateItem(values);
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
      title="Edit Product"
      maxWidth="38rem"
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleModalClose(false)}
            >
              Cancel
            </Button>

            <Button type="submit" form="edit-item-form" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      }
    >
      <form
        id="edit-item-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Inline Form Error Banner */}
        {formError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="font-medium">{formError}</p>
          </div>
        )}

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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
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
