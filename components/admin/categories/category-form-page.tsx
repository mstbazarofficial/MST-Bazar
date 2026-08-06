// src/components/admin/categories/category-form-page.tsx
"use client";

import {
  createCategory,
  updateCategory,
} from "@/actions/admin/category-mutations";
import { PageHeader } from "@/components/admin/layout/page-header";
import { QuantityStepper } from "@/components/my-ui/quantity-stepper";
import { SingleImageUploader } from "@/components/my-ui/single-image-uploader";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import {
  createCategorySchema,
  type CreateCategoryInput,
} from "@/validation/category.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, Path, useForm } from "react-hook-form";

interface CategoryFormPageProps {
  mode?: string;
  categoryId?: string;
  initialValues?: CreateCategoryInput & {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export function CategoryFormPage({
  mode,
  categoryId,
  initialValues,
}: CategoryFormPageProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const isEditing = mode === "edit" || !!categoryId;
  const activeCategoryId = categoryId || initialValues?.id;

  const { handleSubmit, control, setError } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: initialValues || {
      name: "",
      inputSlug: "",
      image: "",
      priority: 0,
    },
  });

  async function submit(data: CreateCategoryInput) {
    setIsPending(true);
    try {
      const result =
        isEditing && activeCategoryId
          ? await updateCategory(activeCategoryId, {
              ...data,
              id: activeCategoryId,
            })
          : await createCategory(data);

      if (result.success) {
        toast.add({
          type: "success",
          description: isEditing
            ? "Category updated successfully!"
            : "Category created successfully!",
        });
        router.push("/admin/categories");
        router.refresh();
      } else {
        if (Array.isArray(result.error)) {
          result.error.forEach((err) => {
            setError(err.path.join(".") as Path<CreateCategoryInput>, {
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
            description: result.error?.toString() || "Something went wrong.",
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
        title={isEditing ? "Edit Category" : "Add New Category"}
        backHref="/admin/categories"
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
                : "Create Category"}
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
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
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="name">Category Name *</FieldLabel>
                    <Input id="name" placeholder="e.g., Staples" {...field} />
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
                    <FieldLabel htmlFor="inputSlug">Slug</FieldLabel>
                    <Input
                      id="inputSlug"
                      placeholder="category-slug"
                      {...field}
                    />
                    <FieldDescription>
                      Auto-generated from name if left blank
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

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
                      max={9999} // 4 digits max
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
            </div>
          </FieldGroup>

          {/* 2. Category Image */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              2. Category Image
            </h2>
            <Controller
              name="image"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Thumbnail Image</FieldLabel>
                  <SingleImageUploader
                    aspectRatio={1}
                    uploadPreset={"category_image"}
                    value={field.value}
                    onChange={(url) => field.onChange(url)}
                    error={fieldState.error?.message}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </fieldset>
      </main>
    </>
  );
}
