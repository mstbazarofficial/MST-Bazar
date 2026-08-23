// src/components/admin/products/product-form-page.tsx
"use client";

import {
  createProduct,
  updateProduct,
} from "@/actions/admin/product-mutations";
import { PageHeader } from "@/components/admin/layout/page-header";
import { MultipleImageUploader } from "@/components/my-ui/multiple-image-uploader";
import { NumberInput } from "@/components/my-ui/number-input";
import { QuantityStepper } from "@/components/my-ui/quantity-stepper";
import { RichTextEditor } from "@/components/my-ui/rich-text-editor";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  createProductSchema,
  type CreateProductInput,
} from "@/validation/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, Path, useForm, useWatch } from "react-hook-form";

interface Category {
  id: string;
  name: string;
}

interface ProductFormPageProps {
  mode?: string;
  productId?: string;
  categories: Category[];
  initialValues?: CreateProductInput & {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

const SHORT_DESCRIPTION_MAX = 160;

export function ProductFormPage({
  mode,
  productId,
  categories,
  initialValues,
}: ProductFormPageProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [intent, setIntent] = useState<"draft" | "publish" | null>(null);

  const isEditing = mode === "edit" || !!productId;
  const activeProductId = productId || initialValues?.id;

  const { handleSubmit, control, setError } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: initialValues || {
      title: "",
      inputSlug: "",
      sku: "",
      brand: "",
      unit: "",
      price: 0,
      discountPercentage: 0,
      shortDescription: "",
      productDetails: "",
      categoryId: "",
      isAvailable: true,
      isBestDeal: false,
      isPopular: false,
      isCombo: false,
      isTopSelling: false,
      priority: 1,

      images: [],
    },
  });

  const price = useWatch({ control, name: "price" }) || 0;
  const discountPercentage =
    useWatch({ control, name: "discountPercentage" }) || 0;
  const discountAmount = (price * discountPercentage) / 100;
  const finalPrice = price - discountAmount;
  const shortDescriptionValue =
    useWatch({ control, name: "shortDescription" }) || "";

  async function submit(
    data: CreateProductInput,
    submitIntent: "draft" | "publish",
  ) {
    setIntent(submitIntent);
    setIsPending(true);
    try {
      const payload =
        submitIntent === "draft" ? { ...data, isAvailable: false } : data;

      const result =
        isEditing && activeProductId
          ? await updateProduct(activeProductId, {
              ...payload,
              id: activeProductId,
            })
          : await createProduct(payload);

      if (result.success) {
        toast.add({
          type: "success",
          description:
            submitIntent === "draft"
              ? "Draft saved."
              : isEditing
                ? "Product updated successfully!"
                : "Product created successfully!",
        });
        router.back();
        router.refresh();
      } else {
        if (Array.isArray(result.error)) {
          result.error.forEach((err) => {
            setError(err.path.join(".") as Path<CreateProductInput>, {
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
      setIntent(null);
    }
  }

  return (
    <>
      <PageHeader
        title={isEditing ? "Edit Product" : "Add New Product"}
        backHref="/admin/products"
        actions={
          <>
            {!isEditing && (
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={handleSubmit((data) => submit(data, "draft"))}
              >
                {isPending && intent === "draft" && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {isPending && intent === "draft" ? "Saving..." : "Save Draft"}
              </Button>
            )}

            <Button
              type="button"
              disabled={isPending}
              onClick={handleSubmit((data) => submit(data, "publish"))}
            >
              {isPending && intent === "publish" && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              {isPending && intent === "publish"
                ? "Publishing..."
                : "Publish Product"}
            </Button>
          </>
        }
      />

      <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
        {/* Single column layout restricted to max-w-4xl for readability */}
        <fieldset
          disabled={isPending}
          className="mx-auto flex max-w-4xl flex-col gap-8 disabled:opacity-70"
        >
          {/* 1. Basic Information */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              1. Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="title">Product Name *</FieldLabel>
                    <Input
                      id="title"
                      placeholder="Enter product name"
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="inputSlug"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="inputSlug">Slug *</FieldLabel>
                    <Input
                      id="inputSlug"
                      placeholder="product-slug"
                      {...field}
                    />
                    <FieldDescription>
                      Slug is auto-generated from name
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="brand"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="brand">Brand</FieldLabel>
                    <Input
                      id="brand"
                      placeholder="Enter brand name"
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="categoryId"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="categoryId">Category *</FieldLabel>
                    <NativeSelect id="categoryId" {...field}>
                      <option value="" disabled>
                        Select category
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </NativeSelect>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          {/* 2. Pricing & Inventory */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              2. Pricing & Inventory
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Controller
                name="price"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="price">Price (৳) *</FieldLabel>
                    <NumberInput
                      id="price"
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
                    <FieldLabel htmlFor="discountPercentage">
                      Discount (%)
                    </FieldLabel>
                    <NumberInput
                      id="discountPercentage"
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
                name="unit"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="unit">Unit</FieldLabel>
                    <Input id="unit" placeholder="e.g. 1 Kg" {...field} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="sku"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="sku">SKU</FieldLabel>
                    <Input id="sku" placeholder="Unique SKU" {...field} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="mt-6 grid grid-cols-3 divide-x rounded-md border bg-muted/30 text-center">
              <div className="px-2 py-3">
                <p className="text-xs text-muted-foreground">Regular Price</p>
                <p className="mt-1 text-sm font-semibold">
                  ৳{price.toFixed(0)}
                </p>
              </div>
              <div className="px-2 py-3">
                <p className="text-xs text-muted-foreground">Discount</p>
                <p className="mt-1 text-sm font-semibold">
                  ৳{discountAmount.toFixed(0)} ({discountPercentage}%)
                </p>
              </div>
              <div className="px-2 py-3">
                <p className="text-xs text-muted-foreground">Final Price</p>
                <p className="mt-1 text-sm font-semibold text-primary">
                  ৳{finalPrice.toFixed(0)}
                </p>
              </div>
            </div>
          </FieldGroup>

          {/* 3. Media (Images & Video) */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              3. Media
            </h2>
            <div className="space-y-6">
              <Controller
                name="images"
                control={control}
                render={({ field, fieldState }) => {
                  const currentImages = field.value || [];
                  const featuredIndex = Math.max(
                    0,
                    currentImages.findIndex((img) => img.isFeatured),
                  );
                  return (
                    <div className="space-y-2">
                      <FieldLabel>Product Images *</FieldLabel>
                      <MultipleImageUploader
                        aspectRatio={1}
                        uploadPreset={"product_image"}
                        value={currentImages.map((img) => ({
                          url: img?.url,
                          publicId: img?.imageId,
                        }))}
                        featuredIndex={featuredIndex}
                        onFeaturedChange={(index) => {
                          const newImages = currentImages.map((img, i) => ({
                            ...img,
                            isFeatured: i === index,
                          }));
                          field.onChange(newImages);
                        }}
                        // Inside ProductFormPage.tsx -> <Controller name="images">
                        onChange={(newUploaderImages) => {
                          const newFormImages = newUploaderImages.map(
                            (uImg) => {
                              // Find the original image to keep its featured status
                              const existingImg = currentImages.find(
                                (fImg) => fImg.imageId === uImg.publicId,
                              );
                              return {
                                id: existingImg?.id,
                                imageId: uImg.publicId,
                                url: uImg.url,
                                // Preserve existing featured status, default to false for new ones
                                isFeatured: existingImg
                                  ? existingImg.isFeatured
                                  : false,
                              };
                            },
                          );

                          // If the featured image was deleted, automatically make the first remaining image featured
                          if (
                            newFormImages.length > 0 &&
                            !newFormImages.some((img) => img.isFeatured)
                          ) {
                            newFormImages[0].isFeatured = true;
                          }

                          field.onChange(newFormImages);
                        }}
                        error={
                          fieldState.error?.message ||
                          fieldState.error?.root?.message
                        }
                      />
                    </div>
                  );
                }}
              />
            </div>
          </FieldGroup>

          {/* 4. Product Details */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              4. Product Details
            </h2>
            <div className="space-y-6">
              <Controller
                name="shortDescription"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="shortDescription">
                      Short Description
                    </FieldLabel>
                    <Textarea
                      id="shortDescription"
                      placeholder="Write short description..."
                      className="h-24 resize-none"
                      maxLength={SHORT_DESCRIPTION_MAX}
                      {...field}
                    />
                    <div className="flex justify-end">
                      <span className="text-xs text-muted-foreground">
                        {shortDescriptionValue.length}/{SHORT_DESCRIPTION_MAX}
                      </span>
                    </div>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="productDetails"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Product Details</FieldLabel>
                    <RichTextEditor
                      value={field.value ?? ""}
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
          </FieldGroup>

          {/* 5. Visibility & Settings */}

          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              5. Visibility & Settings
            </h2>

            <div className="space-y-4">
              {/* Availability */}
              <Controller
                name="isAvailable"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Availability</FieldLabel>
                    <div className="mt-1 flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                          className="accent-primary"
                        />
                        Available
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                          className="accent-primary"
                        />
                        Hidden
                      </label>
                    </div>
                  </Field>
                )}
              />

              {/* Priority */}
              <Controller
                name="priority"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="priority">Priority</FieldLabel>
                    <QuantityStepper
                      value={field.value}
                      onChange={field.onChange}
                      min={1}
                      max={9999}
                      step={1}
                    />
                    <FieldDescription>
                      Determines the display order of categories. Lower numbers
                      appear first.
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Popular Switch */}
              <Controller
                name="isPopular"
                control={control}
                render={({ field }) => (
                  <Field className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FieldLabel className="mb-0">Popular</FieldLabel>
                      <FieldDescription>
                        Mark as popular product
                      </FieldDescription>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
              {/* Top Selling Switch */}
              <Controller
                name="isTopSelling"
                control={control}
                render={({ field }) => (
                  <Field className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FieldLabel className="mb-0">Top Selling</FieldLabel>
                      <FieldDescription>
                        Mark as top selling product
                      </FieldDescription>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />

              {/* Combo Switch */}
              <Controller
                name="isCombo"
                control={control}
                render={({ field }) => (
                  <Field className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FieldLabel className="mb-0">Combo</FieldLabel>
                      <FieldDescription>Mark as combo product</FieldDescription>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />

              {/* Best Deal Switch */}
              <Controller
                name="isBestDeal"
                control={control}
                render={({ field }) => (
                  <Field className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FieldLabel className="mb-0">
                        Mark as Best Deal
                      </FieldLabel>
                      <FieldDescription>
                        Highlight as a special deal
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
