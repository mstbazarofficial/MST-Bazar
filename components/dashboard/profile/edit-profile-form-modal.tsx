"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { FormModal } from "@/components/my-ui/form-modal";
import { SingleImageUploader } from "@/components/my-ui/single-image-uploader";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { getErrorMessage } from "@/utils/get-error-message";
import { useRouter } from "next/navigation";
import type { ProfileUser } from "./profile-info-card";

// ==========================================
// SCHEMA
// ==========================================
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().optional(),
  phoneNumber: z.string().optional(),
  whatsappNumber: z.string().optional(),
  fullAddress: z.string().optional(),
});

type ProfileInput = z.infer<typeof profileSchema>;

// ==========================================
// PROPS
// ==========================================
interface EditProfileFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ProfileUser;
  onSuccess?: () => void;
}

export function EditProfileFormModal({
  open,
  onOpenChange,
  user,
  onSuccess,
}: EditProfileFormModalProps) {
  const { refetch } = authClient.useSession();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  // ==========================================
  // FORM SETUP
  // ==========================================
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name ?? "",
      image: user.image ?? "",
      phoneNumber: user.phoneNumber ?? "",
      whatsappNumber: user.whatsappNumber ?? "",
      fullAddress: user.fullAddress ?? "",
    },
  });

  const { control, handleSubmit, reset } = form;

  // Keep form values in sync when `user` prop changes
  useEffect(() => {
    if (open) {
      reset({
        name: user.name ?? "",
        image: user.image ?? "",
        phoneNumber: user.phoneNumber ?? "",
        whatsappNumber: user.whatsappNumber ?? "",
        fullAddress: user.fullAddress ?? "",
      });
    }
  }, [user, open, reset]);

  // ==========================================
  // MUTATION & BETTER AUTH REFRESH
  // ==========================================
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ProfileInput) => {
      const { data: updatedData, error } = await authClient.updateUser(data, {
        disableSignal: true, // Prevents automatic component re-renders during update
      });

      if (error) {
        throw new Error(error.message || "Failed to update profile");
      }

      return updatedData;
    },
    onSuccess: async () => {
      setFormError(null);

      // Manually refetch the updated session state
      await refetch();
      router.refresh(); // Refresh the current route to reflect updated data
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      setFormError(getErrorMessage(error));
    },
  });
  const onSubmit = (values: ProfileInput) => {
    setFormError(null);
    mutate(values);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset({
        name: user.name ?? "",
        image: user.image ?? "",
        phoneNumber: user.phoneNumber ?? "",
        whatsappNumber: user.whatsappNumber ?? "",
        fullAddress: user.fullAddress ?? "",
      });
      setFormError(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={handleClose}
      title="Edit Profile"
      description="Update your personal information below."
      maxWidth="40rem"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleClose(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="edit-profile-form" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      }
    >
      <form
        id="edit-profile-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Form-level error */}
        {formError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="font-medium">{formError}</p>
          </div>
        )}

        {/* Profile Image */}
        <Controller
          name="image"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="shrink-0">
              <FieldLabel>Profile Photo</FieldLabel>
              <SingleImageUploader
                aspectRatio={1}
                uploadPreset="avatar"
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

        {/* Name & Email */}
        <div className="flex-1 space-y-3">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Full Name *</FieldLabel>
                <Input placeholder="e.g. John Doe" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          {/* Email — read-only */}
          <Field>
            <FieldLabel>Email Address</FieldLabel>
            <Input
              value={user.email}
              disabled
              className="bg-muted/50 text-muted-foreground cursor-not-allowed"
            />
            <p className="text-[0.75rem] text-muted-foreground mt-1">
              Email cannot be changed here.
            </p>
          </Field>
        </div>

        <div className="border-t border-border" />

        {/* Contact fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Phone Number</FieldLabel>
                <Input placeholder="+880 1700 000000" {...field} />
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
                <FieldLabel>WhatsApp Number</FieldLabel>
                <Input placeholder="+880 1700 000000" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        {/* Address */}
        <Controller
          name="fullAddress"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Full Address</FieldLabel>
              <Textarea placeholder="House, Road, Area, City" {...field} />
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
