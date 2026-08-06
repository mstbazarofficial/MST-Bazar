"use client";

import {
  createCategory,
  updateCategory,
} from "@/actions/admin/category-mutations";
import { SingleImageUploader } from "@/components/my-ui/single-image-uploader"; // Adjust path as needed
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
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

interface CategoryFormProps {
  mode?: "create" | "edit";
  categoryId?: string;
  initialValues?: Partial<CreateCategoryInput>;
}

export function CategoryForm({
  mode = "create",
  categoryId,
  initialValues,
}: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { handleSubmit, control } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      inputSlug: "",
      image: "",
      ...initialValues,
    },
  });

  function onSubmit(values: CreateCategoryInput) {
    startTransition(async () => {
      try {
        const result =
          mode === "edit" && categoryId
            ? await updateCategory(categoryId, { ...values, id: categoryId })
            : await createCategory(values);

        if (result.success) {
          toast.add({
            type: "success",
            description:
              mode === "edit"
                ? "Category updated successfully!"
                : "Category created successfully!",
          });

          router.push("/admin/categories");
          router.refresh();
        } else {
          toast.add({
            type: "error",
            description:
              typeof result.error === "string"
                ? result.error
                : "Please check the form for errors.",
            priority: "high",
          });
        }
      } catch {
        toast.add({
          type: "error",
          description: "An unexpected error occurred.",
          priority: "high",
        });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      <FieldGroup className="bg-card border rounded-lg p-6 shadow-sm space-y-6">
        {/* Name Field */}
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" placeholder="e.g. Dairy & Eggs" {...field} />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Slug Field */}
        <Controller
          name="inputSlug"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="inputSlug">Slug</FieldLabel>
              <Input
                id="inputSlug"
                placeholder="Leave blank to auto-generate from name"
                {...field}
              />
              <FieldDescription>Used in the category URL.</FieldDescription>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Image Uploader Field */}
        <Controller
          name="image"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Category Image</FieldLabel>
              <div className="mt-2">
                <SingleImageUploader
                  value={field.value}
                  onChange={(url) => field.onChange(url)}
                  uploadPreset={
                    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                    "your_preset"
                  }
                  aspectRatio={1} // Assuming 1:1 for category icons/cards
                  error={fieldState.error?.message}
                />
              </div>
              <FieldDescription>
                Shown on the category card in the storefront.
              </FieldDescription>
            </Field>
          )}
        />
      </FieldGroup>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "edit" ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
