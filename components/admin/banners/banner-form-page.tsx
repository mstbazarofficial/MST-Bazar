"use client";

import { upsertBanner } from "@/actions/admin/banner-mutations";
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
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { Banner } from "@/generated/prisma/client";
import {
  BANNER_ASPECT_RATIO,
  BANNER_PLACEMENT_LABELS,
  BANNER_UPLOAD_PRESET,
  bannerPlacementEnum,
  upsertBannerSchema,
  type UpsertBannerInput,
} from "@/validation/banner.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, Path, useForm, useWatch } from "react-hook-form";

interface BannerFormPageProps {
  initialValues?: Banner;
}

const PLACEMENT_OPTIONS = bannerPlacementEnum.options;

export function BannerFormPage({ initialValues }: BannerFormPageProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const isEditing = !!initialValues?.id;

  const { handleSubmit, control, setError } = useForm<UpsertBannerInput>({
    resolver: zodResolver(upsertBannerSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      imageUrl: initialValues?.imageUrl ?? "",
      linkUrl: initialValues?.linkUrl ?? "",
      placement: initialValues?.placement ?? "HERO_SLIDER",
      order: initialValues?.order ?? 1,
      isActive: initialValues?.isActive ?? true,
    },
  });

  const placement = useWatch({ control, name: "placement" });
  const aspectRatio = BANNER_ASPECT_RATIO[placement];
  const uploadPreset = BANNER_UPLOAD_PRESET[placement];

  async function submit(data: UpsertBannerInput) {
    setIsPending(true);
    try {
      const result = await upsertBanner(
        isEditing ? { ...data, id: initialValues!.id } : data,
      );

      if (result.success) {
        toast.add({
          type: "success",
          description: isEditing
            ? "Banner updated successfully!"
            : "Banner created successfully!",
        });
        router.back();
        router.refresh();
      } else if (Array.isArray(result.error)) {
        result.error.forEach((err) => {
          setError(err.path.join(".") as Path<UpsertBannerInput>, {
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
        title={isEditing ? "Edit Banner" : "Add New Banner"}
        backHref="/admin/banners"
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
                : "Create Banner"}
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <fieldset
          disabled={isPending}
          className="mx-auto flex max-w-3xl flex-col gap-8 disabled:opacity-70"
        >
          {/* 1. Placement */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              1. Placement
            </h2>
            <Controller
              name="placement"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="placement">Placement *</FieldLabel>
                  <NativeSelect id="placement" {...field}>
                    {PLACEMENT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {BANNER_PLACEMENT_LABELS[option]}
                      </option>
                    ))}
                  </NativeSelect>
                  <FieldDescription>
                    Changes the required image crop below.
                  </FieldDescription>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* 2. Image */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              2. Image
            </h2>
            <Controller
              name="imageUrl"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    Banner Image *{" "}
                    <span className="font-normal text-muted-foreground">
                      ({placement === "HERO_SIDE_BANNER" ? "1:1" : "5:2"})
                    </span>
                  </FieldLabel>
                  <SingleImageUploader
                    aspectRatio={aspectRatio}
                    uploadPreset={uploadPreset}
                    value={field.value ?? null}
                    onChange={(img) => field.onChange(img ?? "")}
                    error={fieldState.error?.message}
                  />
                </Field>
              )}
            />
          </FieldGroup>

          {/* 3. Details */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              3. Details
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="title">Title / Alt Text</FieldLabel>
                    <Input
                      id="title"
                      placeholder="Enter banner title"
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="linkUrl"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="linkUrl">Link URL</FieldLabel>
                    <Input id="linkUrl" placeholder="https://..." {...field} />
                    <FieldDescription>
                      Where the banner navigates when clicked.
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          {/* 4. Visibility & Settings */}
          <FieldGroup className="gap-0! rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              4. Visibility & Settings
            </h2>
            <div className="space-y-4">
              <Controller
                name="order"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="order">Order</FieldLabel>
                    <QuantityStepper
                      value={field.value}
                      onChange={field.onChange}
                      min={1}
                      max={9999}
                      step={1}
                    />
                    <FieldDescription>
                      Sorting order for slides. Lower numbers appear first.
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Field className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FieldLabel className="mb-0">Active</FieldLabel>
                      <FieldDescription>
                        Inactive banners are hidden from the storefront.
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
