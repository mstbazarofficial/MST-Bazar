// src/components/admin/orders/order-form-page.tsx
"use client";

import { createOrder } from "@/actions/admin/order-mutations";
import { PageHeader } from "@/components/admin/layout/page-header";
import { NumberInput } from "@/components/my-ui/number-input";
import { SingleImageUploader } from "@/components/my-ui/single-image-uploader";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { OrderStatus, PaymentMethod } from "@/generated/prisma/enums";
import {
  createOrderSchema,
  type CreateOrderInput,
} from "@/validation/orders.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Controller,
  Path,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";

// Import your custom component and its type
import {
  ProductSearchSelect,
  type ProductSearchResult,
} from "@/components/admin/orders/product-search-select";

interface OrderFormPageProps {
  /** Server action to fetch products dynamically based on user input */
  searchProducts: (query: string) => Promise<ProductSearchResult[]>;
}

export function OrderFormPage({ searchProducts }: OrderFormPageProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const { handleSubmit, control, setValue, setError } =
    useForm<CreateOrderInput>({
      resolver: zodResolver(createOrderSchema),
      defaultValues: {
        customerName: "",
        phoneNumber: "",
        whatsappNumber: "",
        emailAddress: "",
        fullAddress: "",
        status: OrderStatus.PENDING,
        orderPaymentMethod: PaymentMethod.CASH_ON_DELIVERY,
        TrxNumber: "",
        TrxID: "",
        shippingCost: 0,
        discount: 0,
        orderItems: [
          {
            productId: "",
            productName: "",
            productImage: "",
            price: 0,
            quantity: 1,
            discountPercentage: 0,
          },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "orderItems",
  });

  const orderItems = useWatch({ control, name: "orderItems" }) || [];
  const shippingCost = useWatch({ control, name: "shippingCost" }) || 0;
  const discount = useWatch({ control, name: "discount" }) || 0;

  // Calculate Subtotal
  const subtotal = orderItems.reduce((acc, item) => {
    const itemPrice = item.price || 0;
    const itemQty = item.quantity || 1;
    const itemDiscount = item.discountPercentage || 0;
    const finalItemPrice = itemPrice - (itemPrice * itemDiscount) / 100;
    return acc + finalItemPrice * itemQty;
  }, 0);

  const finalTotal = subtotal + shippingCost - discount;

  // Handle selection from your ProductSearchSelect component
  const handleProductSelect = (index: number, product: ProductSearchResult) => {
    setValue(`orderItems.${index}.productId`, product.id, {
      shouldValidate: true,
    });
    setValue(`orderItems.${index}.productName`, product.title, {
      shouldValidate: true,
    });
    setValue(`orderItems.${index}.price`, product.price, {
      shouldValidate: true,
    });
    setValue(
      `orderItems.${index}.discountPercentage`,
      product.discountPercentage,
      { shouldValidate: true },
    );

    if (product.image) {
      setValue(`orderItems.${index}.productImage`, product.image, {
        shouldValidate: true,
      });
    }
  };

  async function submit(data: CreateOrderInput) {
    setIsPending(true);
    try {
      const result = await createOrder(data);

      if (result.success) {
        toast.add({
          type: "success",
          description: "Order placed successfully!",
        });
        router.push("/admin/orders");
      } else {
        if (Array.isArray(result.error)) {
          result.error.forEach((err) => {
            setError(err.path.join(".") as Path<CreateOrderInput>, {
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
        title="Add New Order"
        backHref="/admin/orders"
        actions={
          <Button
            type="button"
            disabled={isPending}
            onClick={handleSubmit(submit)}
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Create Order
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <fieldset
          disabled={isPending}
          className="mx-auto flex max-w-4xl flex-col gap-8 disabled:opacity-70"
        >
          {/* 1. Customer Information */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              1. Customer Details
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="customerName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="customerName">Full Name *</FieldLabel>
                    <Input
                      id="customerName"
                      placeholder="John Doe"
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="phoneNumber">
                      Phone Number *
                    </FieldLabel>
                    <Input
                      id="phoneNumber"
                      placeholder="01XXXXXXXXX"
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="whatsappNumber"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="whatsappNumber">
                      WhatsApp Number
                    </FieldLabel>
                    <Input
                      id="whatsappNumber"
                      placeholder="Optional"
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="emailAddress"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="emailAddress">
                      Email Address *
                    </FieldLabel>
                    <Input
                      id="emailAddress"
                      placeholder="email@example.com"
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <div className="sm:col-span-2">
                <Controller
                  name="fullAddress"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="fullAddress">
                        Full Shipping Address *
                      </FieldLabel>
                      <Textarea
                        id="fullAddress"
                        placeholder="House, Road, Area, City"
                        className="resize-none"
                        {...field}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>
          </FieldGroup>

          {/* 2. Order Items */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tracking-tight">
                2. Order Items
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    productId: "",
                    productName: "",
                    productImage: "",
                    price: 0,
                    quantity: 1,
                    discountPercentage: 0,
                  })
                }
              >
                <Plus className="mr-2 size-4" /> Add Item
              </Button>
            </div>

            <div className="space-y-6">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="relative rounded-md bg-muted/20 p-4 border pt-10 sm:pt-4"
                >
                  {/* Remove Item Button */}
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-4 top-4 size-8"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}

                  {/* CUSTOM SEARCH AND SELECT */}
                  <div className="mb-6 mr-10 flex flex-col gap-1.5">
                    <FieldLabel>Search & Select Product</FieldLabel>
                    <ProductSearchSelect
                      onSearch={searchProducts}
                      onSelect={(product) =>
                        handleProductSelect(index, product)
                      }
                      placeholder="Search to auto-fill..."
                    />
                    <p className="text-[0.8rem] text-muted-foreground">
                      Selecting a product auto-fills the fields below. You can
                      still manually type custom items.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
                    {/* Product Image */}
                    <div className="sm:col-span-3">
                      <Controller
                        name={`orderItems.${index}.productImage`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel>Product Image</FieldLabel>
                            <SingleImageUploader
                              aspectRatio={1}
                              uploadPreset={"category_image"}
                              value={field.value}
                              onChange={(url) => field.onChange(url)}
                              error={fieldState.error?.message}
                            />
                            {fieldState.error && (
                              <FieldError>
                                {fieldState.error.message}
                              </FieldError>
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    {/* Product Text Details */}
                    <div className="sm:col-span-9 space-y-4">
                      <Controller
                        name={`orderItems.${index}.productName`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel>Product Name *</FieldLabel>
                            <Input
                              placeholder="e.g. Wireless Mouse"
                              {...field}
                            />
                            {fieldState.error && (
                              <FieldError>
                                {fieldState.error.message}
                              </FieldError>
                            )}
                          </Field>
                        )}
                      />

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Controller
                          name={`orderItems.${index}.price`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <Field>
                              <FieldLabel>Base Price (৳) *</FieldLabel>
                              <NumberInput
                                placeholder="0"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                              />
                              {fieldState.error && (
                                <FieldError>
                                  {fieldState.error.message}
                                </FieldError>
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name={`orderItems.${index}.discountPercentage`}
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
                                <FieldError>
                                  {fieldState.error.message}
                                </FieldError>
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name={`orderItems.${index}.quantity`}
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
                                <FieldError>
                                  {fieldState.error.message}
                                </FieldError>
                              )}
                            </Field>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Root array error (if 0 items) */}
              {control._formState.errors.orderItems?.root && (
                <p className="text-sm font-medium text-destructive">
                  {control._formState.errors.orderItems.root.message}
                </p>
              )}
            </div>
          </FieldGroup>

          {/* 3. Order Summary, Status & Payment */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              3. Summary, Payment & Status
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <Controller
                  name="orderPaymentMethod"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="orderPaymentMethod">
                        Payment Method
                      </FieldLabel>
                      <NativeSelect id="orderPaymentMethod" {...field}>
                        {Object.values(PaymentMethod).map((method) => (
                          <option key={method} value={method}>
                            {method.replace(/_/g, " ")}
                          </option>
                        ))}
                      </NativeSelect>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="TrxID"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="TrxID">
                        Transaction ID (Optional)
                      </FieldLabel>
                      <Input
                        id="TrxID"
                        placeholder="TrxID or Note"
                        {...field}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="TrxNumber"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="TrxNumber">
                        Transaction Number (Optional)
                      </FieldLabel>
                      <Input
                        id="TrxNumber"
                        placeholder="TrxNumber or Note"
                        {...field}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="status">Order Status</FieldLabel>
                      <NativeSelect id="status" {...field}>
                        {Object.values(OrderStatus).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </NativeSelect>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="shippingCost"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="shippingCost">
                          Shipping Cost (৳)
                        </FieldLabel>
                        <NumberInput
                          id="shippingCost"
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
                    name="discount"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="discount">
                          Extra Discount (৳)
                        </FieldLabel>
                        <NumberInput
                          id="discount"
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
              </div>

              {/* Live Totals Card */}
              <div className="flex flex-col justify-center space-y-3 rounded-lg border bg-muted/20 p-6 h-full">
                <h3 className="font-semibold text-base mb-2 border-b pb-2">
                  Order Summary
                </h3>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal ({orderItems.length} items)</span>
                  <span>৳{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>+ ৳{shippingCost.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Extra Discount</span>
                  <span className="text-destructive">
                    - ৳{discount.toFixed(0)}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-lg text-primary">
                  <span>Total Amount</span>
                  <span>৳{finalTotal.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </FieldGroup>
        </fieldset>
      </main>
    </>
  );
}
